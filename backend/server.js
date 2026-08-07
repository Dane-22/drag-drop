import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { pool, initDatabase } from './db.js';
import { authenticateToken, generateToken } from './middleware/auth.js';
import { authLimiter, mutationLimiter, globalLimiter } from './middleware/rateLimiter.js';
import { validate, allocateWorkerSchema, removeAllocationSchema, createProjectSchema, createWorkerSchema } from './middleware/validation.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCache, setCache, clearCache } from './cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;
const V2_ATTENDANCE_API_URL = process.env.V2_ATTENDANCE_API_URL || 'http://localhost:5000';

function formatProfilePhotoUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Clean leading slash if any
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  if (cleanPath.startsWith('uploads/') || cleanPath.startsWith('assets/')) {
    return `${V2_ATTENDANCE_API_URL}/${cleanPath}`;
  }
  return `${V2_ATTENDANCE_API_URL}/assets/profile-images/employees/${cleanPath}`;
}



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
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username and password required' });
  }

  const cleanUser = username.trim().toLowerCase();

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE (LOWER(username) = ? OR LOWER(email) = ?) AND password = ?',
      [cleanUser, cleanUser, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
    }

    const targetUser = rows[0];

    if (targetUser.status !== 'Active') {
      return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
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
      user: {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during login' });
  }
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


// ----------------------------------------------------------------------
// 1. GET /api/get_data - Read workers, projects, and matrix allocations
// ----------------------------------------------------------------------
app.get('/api/get_data', async (req, res) => {
  try {
    const cachedData = await getCache('api_get_data');
    if (cachedData) {
      return res.json({
        status: 'success',
        message: 'Matrix allocation data retrieved from cache',
        data: cachedData
      });
    }

    const [workers] = await pool.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name, position AS trade, 'Experienced' AS skill_level, IF(branch_code IS NOT NULL AND branch_code != '', 'Assigned', 'Available') AS status, '5 yrs Exp.' AS experience, profile_image AS profile_photo_url, NULL AS address, NULL AS phone_number, created_at FROM \`attendance-system\`.employees ORDER BY id ASC"
    );
    workers.forEach(w => w.profile_photo_url = formatProfilePhotoUrl(w.profile_photo_url));
    const [projects] = await pool.query(
      "SELECT id, id AS site_number, branch_name AS name, address AS description, status, created_at FROM \`attendance-system\`.branches ORDER BY id ASC"
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
          CONCAT(w.first_name, ' ', w.last_name) AS worker_name,
          w.position AS worker_trade,
          w.profile_image AS worker_photo,
          p.branch_name AS project_name,
          p.id AS site_number
        FROM allocations a
        JOIN \`attendance-system\`.employees w ON a.worker_id = w.id
        JOIN \`attendance-system\`.branches p ON a.project_id = p.id
        WHERE a.allocation_date >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
          AND a.allocation_date <= DATE_ADD(CURDATE(), INTERVAL 60 DAY)
        ORDER BY p.id ASC, a.day_of_week ASC
      `);
      allocations = allocRows;
      allocations.forEach(a => a.worker_photo = formatProfilePhotoUrl(a.worker_photo));
    } catch (allocErr) {
      console.warn('Fallback query for allocations:', allocErr.message);
    }

    const dataToCache = { workers, projects, allocations };
    await setCache('api_get_data', dataToCache);

    res.json({
      status: 'success',
      message: 'Matrix allocation data retrieved successfully',
      data: dataToCache
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

// ----------------------------------------------------------------------
// 1.5. POST /api/allocations/sync_transfer - Sync worker transfer from Attendance
// ----------------------------------------------------------------------
app.post('/api/allocations/sync_transfer', mutationLimiter, async (req, res) => {
  try {
    const { employeeId, branchCode, date } = req.body;

    if (!employeeId || !branchCode || !date) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    // 1. Get Project ID from branchCode
    const [pRows] = await pool.query('SELECT id, branch_name AS name FROM \`attendance-system\`.branches WHERE branch_code = ?', [branchCode]);
    if (pRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found for branchCode: ' + branchCode });
    }
    const project = pRows[0];

    // 2. Get Worker Info
    const [wRows] = await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name, position AS trade, profile_image AS profile_photo_url FROM \`attendance-system\`.employees WHERE id = ?", [employeeId]);
    if (wRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    const worker = wRows[0];

    // 3. Determine Day of Week
    const dateObj = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day_of_week = days[dateObj.getDay()];

    // 4. Upsert Allocation
    const [existingRows] = await pool.query(`
      SELECT id FROM allocations 
      WHERE worker_id = ? AND allocation_date = ?
    `, [employeeId, date]);

    let allocationId;
    let isTransfer = false;

    if (existingRows.length > 0) {
      allocationId = existingRows[0].id;
      isTransfer = true;
      await pool.query(`
        UPDATE allocations 
        SET project_id = ?, day_of_week = ?, assigned_by = ?
        WHERE id = ?
      `, [project.id, day_of_week, 'Attendance Sync', allocationId]);
    } else {
      const [insertResult] = await pool.query(`
        INSERT INTO allocations (worker_id, project_id, day_of_week, allocation_date, assigned_by)
        VALUES (?, ?, ?, ?, ?)
      `, [employeeId, project.id, day_of_week, date, 'Attendance Sync']);
      allocationId = insertResult.insertId;
    }

    // 5. Emit Event
    const payload = {
      id: allocationId,
      worker_id: Number(employeeId),
      project_id: project.id,
      day_of_week,
      allocation_date: date,
      status: 'assigned',
      assigned_by: 'Attendance Sync',
      worker_name: worker.name,
      worker_trade: worker.trade,
      worker_photo: formatProfilePhotoUrl(worker.profile_photo_url),
      project_name: project.name
    };

    io.emit('allocation_updated', { is_transfer: isTransfer, allocation: payload });

    await clearCache('api_get_data');

    res.json({ success: true, message: 'Allocation synced successfully', data: payload });
  } catch (err) {
    console.error('Error syncing transfer allocation:', err);
    res.status(500).json({ success: false, message: err.message });
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
    const [wRows] = await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name, position AS trade, profile_image AS profile_photo_url FROM \`attendance-system\`.employees WHERE id = ?", [worker_id]);
    if (wRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Worker not found' });
    }
    const worker = wRows[0];

    const [pRows] = await pool.query('SELECT branch_name AS name, id AS site_number, branch_code FROM \`attendance-system\`.branches WHERE id = ?', [project_id]);
    const project = pRows[0] || {};
    const branchCode = project.branch_code;

    const [existingRows] = await pool.query(`
      SELECT a.id, a.project_id, p.branch_name AS old_project_name, p.id AS old_site_number
      FROM allocations a
      JOIN \`attendance-system\`.branches p ON a.project_id = p.id
      WHERE a.worker_id = ? AND a.allocation_date = ?
    `, [worker_id, allocDate]);

    let isTransfer = false;
    let oldSiteName = '';

    // Fire-and-forget sync function
    const syncToAttendance = () => {
      if (branchCode) {
        const attendanceApiUrl = process.env.V2_ATTENDANCE_API_URL || 'http://localhost:5000';
        fetch(`${attendanceApiUrl}/api/webhooks/drag-and-drop-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: worker_id,
            branchCode: branchCode,
            date: allocDate
          })
        }).catch(err => console.error('[Sync] Failed to sync to attendance system:', err.message));
      }
    };

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
        worker_photo: formatProfilePhotoUrl(worker.profile_photo_url),
        project_name: project.name || ''
      };

      io.emit('allocation_updated', { is_transfer: isTransfer, allocation: payload });
      syncToAttendance();
      await clearCache('api_get_data');

      return res.json({
        status: 'success',
        is_transfer: isTransfer,
        message: isTransfer
          ? `Worker '${worker.name}' transferred from ${oldSiteName} to Site ${project.site_number} ("${project.name}") on ${day_of_week}.`
          : `Worker '${worker.name}' updated on Site ${project.site_number}.`,
        data: payload
      });
    }

    // Sync worker status in DB is now managed by attendance-system webhook
    // await pool.query("UPDATE workers SET status = 'Assigned' WHERE id = ?", [worker_id]);

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
      worker_photo: formatProfilePhotoUrl(worker.profile_photo_url),
      project_name: project.name || ''
    };

    io.emit('allocation_updated', { is_transfer: false, allocation: payload });
    syncToAttendance();
    await clearCache('api_get_data');

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
  const { id, worker_id, project_id, day_of_week, allocation_date } = req.body;

  try {
    let targetWorkerId = worker_id;
    if (id && !targetWorkerId) {
      const [allocRows] = await pool.query('SELECT worker_id FROM allocations WHERE id = ?', [id]);
      if (allocRows.length > 0) targetWorkerId = allocRows[0].worker_id;
    }

    if (id) {
      await pool.query('DELETE FROM allocations WHERE id = ?', [id]);
    } else if (worker_id && project_id && allocation_date) {
      await pool.query('DELETE FROM allocations WHERE worker_id = ? AND project_id = ? AND allocation_date = ?', [
        worker_id,
        project_id,
        allocation_date
      ]);
    }

    if (targetWorkerId) {
      const [remRows] = await pool.query('SELECT COUNT(*) AS cnt FROM allocations WHERE worker_id = ?', [targetWorkerId]);
      if (remRows[0]?.cnt === 0) {
        // Status now managed by attendance-system webhook (branch_code will be cleared)
        // await pool.query("UPDATE workers SET status = 'Available' WHERE id = ?", [targetWorkerId]);
      }
    }

    io.emit('allocation_removed', { id, worker_id, project_id, day_of_week });
    await clearCache('api_get_data');

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
    const branchCode = 'B' + Math.floor(Math.random() * 100000); // Generate simple branch_code
    const [result] = await pool.query(
      'INSERT INTO \`attendance-system\`.branches (branch_name, address, branch_code) VALUES (?, ?, ?)',
      [name.trim(), (description || '').trim(), branchCode]
    );

    const newProject = {
      id: result.insertId,
      site_number: result.insertId,
      name: name.trim(),
      description: (description || '').trim()
    };

    io.emit('site_created', newProject);
    await clearCache('api_get_data');

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
    await pool.query('UPDATE \`attendance-system\`.branches SET status = ? WHERE id = ?', [newStatus, project_id]);

    const payload = { id: Number(project_id), status: newStatus };
    io.emit('site_status_updated', payload);
    await clearCache('api_get_data');

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
      'UPDATE \`attendance-system\`.branches SET branch_name = ?, address = ?, status = ? WHERE id = ?',
      [name.trim(), (description || '').trim(), updatedStatus, project_id]
    );

    const [rows] = await pool.query(
      "SELECT id, id AS site_number, branch_name AS name, address AS description, status, created_at FROM \`attendance-system\`.branches WHERE id = ?",
      [project_id]
    );

    const updatedProject = rows[0];
    io.emit('site_updated', updatedProject);
    await clearCache('api_get_data');

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
// 7.4. GET /api/allocations/verify - Check if worker is allocated
// ----------------------------------------------------------------------
app.get('/api/allocations/verify', async (req, res) => {
  try {
    const { employeeId, branchCode, date } = req.query;

    console.log(`[VERIFY] Params: employeeId=${employeeId}, branchCode=${branchCode}, date=${date}`);

    if (!employeeId || !branchCode || !date) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const [rows] = await pool.query(
      `SELECT a.id, a.allocation_date, p.branch_code, a.worker_id 
       FROM allocations a
       JOIN \`attendance-system\`.branches p ON a.project_id = p.id
       WHERE a.worker_id = ? 
         AND DATE(a.allocation_date) = ? 
         AND p.branch_code = ?`,
      [employeeId, date, branchCode]
    );

    const allocated = rows.length > 0;

    res.json({
      success: true,
      allocated
    });
  } catch (err) {
    console.error('Error verifying allocation:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Webhook /api/projects/sync has been removed as it is no longer necessary.

// Start Express HTTP & Socket.io server
httpServer.listen(PORT, () => {
  console.log(`🚀 Node.js Express & Socket.io server running at http://localhost:${PORT}`);
});
