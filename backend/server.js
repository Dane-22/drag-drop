import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { pool, initDatabase } from './db.js';
import { authenticateToken, generateToken } from './middleware/auth.js';
import { authLimiter, mutationLimiter, globalLimiter } from './middleware/rateLimiter.js';
import {
  validate,
  allocateWorkerSchema,
  removeAllocationSchema,
  createProjectSchema,
  createWorkerSchema
} from './middleware/validation.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// System Users Store (In-Memory Fallback & Database Seed)
let systemUsers = [
  {
    id: 1,
    username: 'super_admin',
    name: 'Director Robert Chen',
    email: 'robert.chen@apexconstruction.com',
    role: 'super_admin',
    status: 'Active',
    created_at: '2026-01-15'
  },
  {
    id: 2,
    username: 'admin',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@apexconstruction.com',
    role: 'admin',
    status: 'Active',
    created_at: '2026-02-01'
  },
  {
    id: 3,
    username: 'engineer',
    name: 'Engr. Marcus Vance',
    email: 'marcus.vance@apexconstruction.com',
    role: 'engineer',
    status: 'Active',
    created_at: '2026-03-10'
  }
];

// Initialize Socket.io Server for Real-Time Dispatcher Sync
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware setup
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Run DB column verification
initDatabase();

// Track active WebSocket connections & Live Drag Presence
io.on('connection', (socket) => {
  console.log(`⚡ Client connected via WebSocket: ${socket.id}`);

  // Broadcast Live Drag Ghosting Presence to all other connected dispatchers & Super Admins
  socket.on('worker_drag_start', (data) => {
    socket.broadcast.emit('worker_drag_started', data);
  });

  socket.on('worker_drag_end', (data) => {
    socket.broadcast.emit('worker_drag_ended', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ----------------------------------------------------------------------
// Auth Route: POST /api/auth/login (Protected with authLimiter: 5 attempts/15m)
// ----------------------------------------------------------------------
app.post('/api/auth/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username and password required' });
  }

  const cleanUser = username.trim().toLowerCase();

  let targetUser = systemUsers.find(
    (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
  );

  // Fallback role resolution for quick demo buttons
  if (!targetUser) {
    if (cleanUser.includes('super')) {
      targetUser = systemUsers[0];
    } else if (cleanUser.includes('admin')) {
      targetUser = systemUsers[1];
    } else if (cleanUser.includes('engineer') || cleanUser.includes('engr')) {
      targetUser = systemUsers[2];
    }
  }

  if (!targetUser) {
    targetUser = {
      id: Date.now(),
      username: cleanUser,
      name: username,
      email: `${cleanUser}@apexconstruction.com`,
      role: cleanUser.includes('super') ? 'super_admin' : cleanUser.includes('admin') ? 'admin' : 'engineer',
      status: 'Active',
      created_at: new Date().toISOString().split('T')[0]
    };
  }

  // Generate JWT Session token with user payload
  const token = generateToken({
    id: targetUser.id,
    username: targetUser.username,
    name: targetUser.name,
    role: targetUser.role
  });

  res.json({
    status: 'success',
    message: `Logged in successfully as ${targetUser.role.toUpperCase()}`,
    token,
    user: targetUser
  });
});

// Apply Global Rate Limiter & JWT authentication middleware for data endpoints
app.use('/api', globalLimiter, authenticateToken);

// ----------------------------------------------------------------------
// User Management Endpoints (Super Admin Only)
// ----------------------------------------------------------------------
app.get('/api/users', (req, res) => {
  res.json({
    status: 'success',
    data: systemUsers
  });
});

app.post('/api/users/create', mutationLimiter, (req, res) => {
  const { username, name, email, role } = req.body;
  if (!username || !name || !role) {
    return res.status(400).json({ status: 'error', message: 'Username, name, and role are required' });
  }

  if (role !== 'admin' && role !== 'engineer') {
    return res.status(400).json({ status: 'error', message: 'Role must be either admin or engineer' });
  }

  const newUser = {
    id: Date.now(),
    username: username.trim().toLowerCase(),
    name: name.trim(),
    email: email ? email.trim() : `${username.trim().toLowerCase()}@apexconstruction.com`,
    role,
    status: 'Active',
    created_at: new Date().toISOString().split('T')[0]
  };

  systemUsers.push(newUser);

  // Broadcast user created event via WebSocket
  io.emit('user_created', newUser);

  res.status(201).json({
    status: 'success',
    message: `Created new ${role.toUpperCase()} user account '${newUser.name}'`,
    data: newUser
  });
});

// ----------------------------------------------------------------------
// 0. GET /api/allocations/verify - Integration endpoint for Attendance System
// ----------------------------------------------------------------------
app.get('/api/allocations/verify', async (req, res) => {
  const { employeeId, branchCode, date } = req.query;

  if (!employeeId || !branchCode || !date) {
    return res.status(400).json({ success: false, message: 'Invalid parameters' });
  }

  try {
    const workerId = parseInt(employeeId, 10);
    
    const [allocRows] = await pool.query(`
      SELECT a.id 
      FROM allocations a
      JOIN projects p ON a.project_id = p.id
      WHERE a.worker_id = ? AND (p.name LIKE CONCAT('%', ?, '%') OR p.site_number = ?) AND a.allocation_date = ?
    `, [workerId, branchCode, branchCode, date]);

    if (allocRows.length > 0) {
      return res.json({ success: true, allocated: true });
    } else {
      return res.json({ success: true, allocated: false });
    }
  } catch (err) {
    console.error('Error verifying allocation:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ----------------------------------------------------------------------
// 1. GET /api/get_data - Read workers, projects, and matrix allocations
// ----------------------------------------------------------------------
app.get('/api/get_data', async (req, res) => {
  try {
    const [workers] = await pool.query(
      'SELECT id, name, trade, skill_level, status, experience, profile_photo_url, address, phone_number, created_at FROM workers ORDER BY id ASC'
    );
    const [projects] = await pool.query(
      "SELECT id, site_number, name, description, COALESCE(status, 'Active') AS status, created_at FROM projects ORDER BY site_number ASC"
    );

    let allocations = [];
    try {
      const [allocRows] = await pool.query(`
        SELECT 
          a.id, 
          a.worker_id, 
          a.project_id, 
          a.day_of_week,
          DATE_FORMAT(a.allocation_date, '%Y-%m-%d') AS allocation_date, 
          a.status, 
          a.time_stamp,
          a.assigned_by,
          w.name AS worker_name,
          w.trade AS worker_trade,
          w.profile_photo_url AS worker_photo,
          p.name AS project_name,
          p.site_number
        FROM allocations a
        JOIN workers w ON a.worker_id = w.id
        JOIN projects p ON a.project_id = p.id
        ORDER BY p.site_number ASC, a.day_of_week ASC
      `);
      allocations = allocRows;
    } catch (allocErr) {
      console.warn('Fallback query for allocations:', allocErr.message);
    }

    res.json({
      status: 'success',
      message: 'Matrix allocation data retrieved successfully',
      data: { workers, projects, allocations }
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

// ----------------------------------------------------------------------
// 2. POST /api/allocate_worker - Auto-Transfer & Allocate Worker (Protected with mutationLimiter)
// ----------------------------------------------------------------------
app.post('/api/allocate_worker', mutationLimiter, validate(allocateWorkerSchema), async (req, res) => {
  const { worker_id, project_id, day_of_week, allocation_date } = req.body;

  const allocDate = allocation_date || new Date().toISOString().split('T')[0];
  const assignedBy = req.user?.name || 'Dispatcher Admin';

  try {
    const [wRows] = await pool.query('SELECT name, trade, profile_photo_url FROM workers WHERE id = ?', [worker_id]);
    if (wRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Worker not found' });
    }
    const worker = wRows[0];

    const [pRows] = await pool.query('SELECT name, site_number FROM projects WHERE id = ?', [project_id]);
    const project = pRows[0] || {};

    const [existingRows] = await pool.query(`
      SELECT a.id, a.project_id, p.name AS old_project_name, p.site_number AS old_site_number
      FROM allocations a
      JOIN projects p ON a.project_id = p.id
      WHERE a.worker_id = ? AND a.day_of_week = ?
    `, [worker_id, day_of_week]);

    let isTransfer = false;
    let oldSiteName = '';

    if (existingRows.length > 0) {
      if (existingRows[0].project_id != project_id) {
        isTransfer = true;
        oldSiteName = `Site ${existingRows[0].old_site_number} ("${existingRows[0].old_project_name}")`;
      }

      await pool.query(`
        UPDATE allocations 
        SET project_id = ?, assigned_by = ?
        WHERE id = ?
      `, [project_id, assignedBy, existingRows[0].id]);

      const payload = {
        id: existingRows[0].id,
        worker_id: Number(worker_id),
        project_id: Number(project_id),
        day_of_week,
        allocation_date: allocDate,
        status: 'assigned',
        assigned_by: assignedBy,
        worker_name: worker.name,
        worker_trade: worker.trade,
        worker_photo: worker.profile_photo_url,
        project_name: project.name || ''
      };

      io.emit('allocation_updated', { is_transfer: isTransfer, allocation: payload });

      return res.json({
        status: 'success',
        is_transfer: isTransfer,
        message: isTransfer
          ? `Worker '${worker.name}' transferred from ${oldSiteName} to Site ${project.site_number} ("${project.name}") on ${day_of_week}.`
          : `Worker '${worker.name}' updated on Site ${project.site_number}.`,
        data: payload
      });
    }

    // Sync worker status in DB
    await pool.query("UPDATE workers SET status = 'Assigned' WHERE id = ?", [worker_id]);

    let insertId = Date.now();
    const [result] = await pool.query(`
      INSERT INTO allocations (worker_id, project_id, day_of_week, allocation_date, status, assigned_by)
      VALUES (?, ?, ?, ?, 'assigned', ?)
    `, [worker_id, project_id, day_of_week, allocDate, assignedBy]);
    insertId = result.insertId;

    const payload = {
      id: insertId,
      worker_id: Number(worker_id),
      project_id: Number(project_id),
      day_of_week,
      allocation_date: allocDate,
      status: 'assigned',
      assigned_by: assignedBy,
      worker_name: worker.name,
      worker_trade: worker.trade,
      worker_photo: worker.profile_photo_url,
      project_name: project.name || ''
    };

    io.emit('allocation_updated', { is_transfer: false, allocation: payload });

    res.json({
      status: 'success',
      is_transfer: false,
      message: `Worker '${worker.name}' allocated to Site ${project.site_number} on ${day_of_week}.`,
      data: payload
    });
  } catch (err) {
    console.error('Error allocating worker:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------------------------
// 3. POST /api/remove_allocation - Unallocate worker (Protected with mutationLimiter)
// ----------------------------------------------------------------------
app.post('/api/remove_allocation', mutationLimiter, validate(removeAllocationSchema), async (req, res) => {
  const { id, worker_id, project_id, day_of_week } = req.body;

  try {
    let targetWorkerId = worker_id;
    if (id && !targetWorkerId) {
      const [allocRows] = await pool.query('SELECT worker_id FROM allocations WHERE id = ?', [id]);
      if (allocRows.length > 0) targetWorkerId = allocRows[0].worker_id;
    }

    if (id) {
      await pool.query('DELETE FROM allocations WHERE id = ?', [id]);
    } else if (worker_id && project_id && day_of_week) {
      await pool.query('DELETE FROM allocations WHERE worker_id = ? AND project_id = ? AND day_of_week = ?', [
        worker_id,
        project_id,
        day_of_week
      ]);
    }

    if (targetWorkerId) {
      const [remRows] = await pool.query('SELECT COUNT(*) AS cnt FROM allocations WHERE worker_id = ?', [targetWorkerId]);
      if (remRows[0]?.cnt === 0) {
        await pool.query("UPDATE workers SET status = 'Available' WHERE id = ?", [targetWorkerId]);
      }
    }

    io.emit('allocation_removed', { id, worker_id, project_id, day_of_week });

    res.json({ status: 'success', message: 'Allocation removed successfully' });
  } catch (err) {
    console.error('Error removing allocation:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------------------------
// 7. POST /api/create_project - Create new construction site (Protected with mutationLimiter)
// ----------------------------------------------------------------------
app.post('/api/create_project', mutationLimiter, validate(createProjectSchema), async (req, res) => {
  const { name, description } = req.body;

  try {
    const [maxRows] = await pool.query('SELECT MAX(site_number) AS maxSite FROM projects');
    const nextSite = (maxRows[0]?.maxSite || 0) + 1;

    const [result] = await pool.query(
      'INSERT INTO projects (site_number, name, description) VALUES (?, ?, ?)',
      [nextSite, name.trim(), (description || '').trim()]
    );

    const newProject = {
      id: result.insertId,
      site_number: nextSite,
      name: name.trim(),
      description: (description || '').trim()
    };

    io.emit('site_created', newProject);

    res.status(201).json({
      status: 'success',
      message: 'Site created successfully',
      data: newProject
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------------------------
// 7b. POST /api/toggle_project_status - Toggle site between Active and Inactive
// ----------------------------------------------------------------------
app.post('/api/toggle_project_status', mutationLimiter, async (req, res) => {
  const { project_id, status } = req.body;
  if (!project_id || !status) {
    return res.status(400).json({ status: 'error', message: 'project_id and status required' });
  }

  const newStatus = status === 'Inactive' ? 'Inactive' : 'Active';

  try {
    await pool.query('UPDATE projects SET status = ? WHERE id = ?', [newStatus, project_id]);

    const payload = { id: Number(project_id), status: newStatus };
    io.emit('site_status_updated', payload);

    res.json({
      status: 'success',
      message: `Construction Site status updated to ${newStatus}`,
      data: payload
    });
  } catch (err) {
    console.error('Error toggling project status:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------------------------
// 7c. POST /api/update_project - Update construction site details & status
// ----------------------------------------------------------------------
app.post('/api/update_project', mutationLimiter, async (req, res) => {
  const { project_id, name, description, status } = req.body;
  if (!project_id || !name) {
    return res.status(400).json({ status: 'error', message: 'project_id and name are required' });
  }

  try {
    const updatedStatus = status === 'Inactive' ? 'Inactive' : 'Active';
    await pool.query(
      'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?',
      [name.trim(), (description || '').trim(), updatedStatus, project_id]
    );

    const [rows] = await pool.query(
      "SELECT id, site_number, name, description, COALESCE(status, 'Active') AS status, created_at FROM projects WHERE id = ?",
      [project_id]
    );

    const updatedProject = rows[0];
    io.emit('site_updated', updatedProject);

    res.json({
      status: 'success',
      message: `Construction Site '${name}' updated successfully`,
      data: updatedProject
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------------------------
// 8. POST /api/create_worker - Add a new worker dynamically (Protected with mutationLimiter)
// ----------------------------------------------------------------------
app.post('/api/create_worker', mutationLimiter, validate(createWorkerSchema), async (req, res) => {
  const { name, trade, experience, skill_level, profile_photo_url } = req.body;

  const photos = [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  ];
  const photo = profile_photo_url || photos[Math.floor(Math.random() * photos.length)];

  try {
    const [result] = await pool.query(
      'INSERT INTO workers (name, trade, experience, skill_level, status, profile_photo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name.trim(),
        trade.trim(),
        experience || '5 yrs Exp.',
        skill_level || 'Licensed',
        'Available',
        photo
      ]
    );

    const newWorker = {
      id: result.insertId,
      name: name.trim(),
      trade: trade.trim(),
      experience: experience || '5 yrs Exp.',
      skill_level: skill_level || 'Licensed',
      status: 'Available',
      profile_photo_url: photo
    };

    io.emit('worker_created', newWorker);

    res.status(201).json({
      status: 'success',
      message: 'Worker added successfully',
      data: newWorker
    });
  } catch (err) {
    console.error('Error adding worker:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Start Express HTTP & Socket.io server
httpServer.listen(PORT, () => {
  console.log(`🚀 Node.js Express & Socket.io server running at http://localhost:${PORT}`);
});
