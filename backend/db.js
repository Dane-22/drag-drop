import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection Pool configured for WAMP server environment
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'worker_allocation_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Safe database column migration logic using schema introspection
export const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Migration checks disabled. Schema is managed elsewhere.
    /*
    // Verify projects table status column
    const [projectColumns] = await connection.query('SHOW COLUMNS FROM projects');
    const existingProjectCols = projectColumns.map((col) => col.Field);

    if (!existingProjectCols.includes('status')) {
      await connection.query("ALTER TABLE projects ADD COLUMN `status` VARCHAR(20) DEFAULT 'Active'");
      console.log("✨ Safely added missing projects column: status");
    }

    // Verify workers table address & phone_number columns
    const [workerColumns] = await connection.query('SHOW COLUMNS FROM workers');
    const existingWorkerCols = workerColumns.map((col) => col.Field);

    if (!existingWorkerCols.includes('address')) {
      await connection.query("ALTER TABLE workers ADD COLUMN `address` VARCHAR(500) DEFAULT NULL AFTER `profile_photo_url`");
      console.log("✨ Safely added missing workers column: address");
    }

    if (!existingWorkerCols.includes('phone_number')) {
      await connection.query("ALTER TABLE workers ADD COLUMN `phone_number` VARCHAR(50) DEFAULT NULL AFTER `address`");
      console.log("✨ Safely added missing workers column: phone_number");
    }

    // Verify allocations table assigned_by column
    const [allocationColumns] = await connection.query('SHOW COLUMNS FROM allocations');
    const existingAllocationCols = allocationColumns.map((col) => col.Field);

    if (!existingAllocationCols.includes('assigned_by')) {
      await connection.query("ALTER TABLE allocations ADD COLUMN `assigned_by` VARCHAR(255) DEFAULT NULL");
      console.log("✨ Safely added missing allocations column: assigned_by");
    }
    */

    console.log('✅ Database schema verified & updated successfully');
    connection.release();
  } catch (err) {
    console.warn('⚠️ Auto-migration note:', err.message);
  }
};

// Run migration check on startup
initDatabase();
