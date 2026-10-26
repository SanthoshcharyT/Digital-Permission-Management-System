const { Pool } = require('pg');
const config = require('./config');

// Supabase hosts a standard Postgres database, so the server connects with its connection string
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  max: 10
});

module.exports = pool;
