import { z } from 'zod';
import db from '../config/db.js';

// Define the expected shape of the request body using Zod
const createAllocationSchema = z.object({
  worker_id: z.number().int().positive(),
  project_id: z.number().int().positive(),
  allocation_date: z.string(), // e.g., 'YYYY-MM-DD'
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  assigned_by: z.string().min(2)
});

/**
 * Controller to create a new worker allocation
 * Best practices demonstrated:
 * - Zod payload validation
 * - Parameterized SQL queries (prevents injection)
 * - Standardized error responses
 */
export const createAllocation = async (req, res) => {
  try {
    // 1. Validate payload
    const validatedData = createAllocationSchema.parse(req.body);
    
    // 2. Execute Query safely
    const query = `
      INSERT INTO allocations (worker_id, project_id, allocation_date, day_of_week, status, assigned_by) 
      VALUES (?, ?, ?, ?, 'assigned', ?)
    `;
    const values = [
      validatedData.worker_id, 
      validatedData.project_id, 
      validatedData.allocation_date, 
      validatedData.day_of_week, 
      validatedData.assigned_by
    ];

    const [result] = await db.execute(query, values);

    // 3. Optional: Emit Socket.io event here
    // req.app.get('io').emit('worker:assigned', { id: result.insertId, ...validatedData });

    res.status(201).json({ message: 'Allocation created successfully', id: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating allocation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
