// Creates the tables in the Supabase database. Usage: npm run db:setup
const fs = require('fs');
const path = require('path');
const config = require('../config');

if (!config.database.url) {
  console.error('DATABASE_URL is not set. Add your Supabase connection string to .env.');
  process.exit(1);
}

const pool = require('../db');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
  await pool.query(sql);
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM request_categories');
  console.log(`Schema applied. ${rows[0].n} request categories present.`);
  await pool.end();
})().catch(async (error) => {
  console.error('Setup failed:', error.message);
  await pool.end();
  process.exit(1);
});
