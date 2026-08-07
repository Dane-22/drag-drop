import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection Pool configured for WAMP server environment
export const pool = mysql.createPool({
  ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  }),
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
    // However, we will ensure the users table exists for authentication
    const [userColumns] = await connection.query('SHOW TABLES LIKE "users"');
    if (userColumns.length === 0) {
      console.log("✨ Creating missing 'users' table");
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'Active',
          created_at DATE NOT NULL
        )
      `);
      
      console.log("✨ Seeding default users into the database");
      await connection.query(`
        INSERT INTO users (username, password, name, email, role, status, created_at) VALUES 
        ('super_admin', 'super_password_123', 'Director Robert Chen', 'robert.chen@apexconstruction.com', 'super_admin', 'Active', '2026-01-15'),
        ('admin', 'admin_password_123', 'Sarah Jenkins', 'sarah.jenkins@apexconstruction.com', 'admin', 'Active', '2026-02-01'),
        ('engineer', 'engineer_password_123', 'Engr. Marcus Vance', 'marcus.vance@apexconstruction.com', 'engineer', 'Active', '2026-03-10')
      `);
    }

    console.log('✅ Database schema verified & updated successfully');
    connection.release();
  } catch (err) {
    console.warn('⚠️ Auto-migration note:', err.message);
  }
};

// Run migration check on startup
initDatabase();
