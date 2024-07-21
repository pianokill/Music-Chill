import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'musicchill',
  password: 'hieu0703',
  port: 5432,
});

export default pool;

