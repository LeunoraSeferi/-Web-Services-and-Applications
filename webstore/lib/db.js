import { Pool } from 'pg';

// ==========================================
// PostgreSQL Connection Pool
// Creates a reusable pool of database connections
// DATABASE_URL must be set in the environment (.env)
// ==========================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Connection string for PostgreSQL
});

// Export pool for use in all API routes
export default pool;
