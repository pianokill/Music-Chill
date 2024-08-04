import pg from 'pg';
import env from 'dotenv';
const { Pool } = pg;
env.config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;