// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:16050@localhost:5432/quora",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // ป้องกัน error SSL บน cloud
});

export default connectionPool;