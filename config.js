module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'your-password',
    database: 'permission_system'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret-key'
  },
  port: 3000
};
 
