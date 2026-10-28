const { Pool } = require('pg');
const config = require('./config');

// Supabase hosts a standard Postgres database, so the server connects with its connection string
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  // Each Vercel function instance gets its own pool, so keep it to one connection there
  max: process.env.VERCEL ? 1 : 10
});

module.exports = pool;
