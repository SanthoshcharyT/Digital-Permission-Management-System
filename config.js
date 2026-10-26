require('dotenv').config();

module.exports = {
  database: {
    // Supabase: Project Settings > Database > Connection string (URI)
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL !== 'false'
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  port: process.env.PORT || 3000
};
