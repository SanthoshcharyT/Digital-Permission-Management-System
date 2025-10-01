module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'permission_system'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'b2d02c70c41cb6181baf2d71359cd039b1655cc8d562248eb7f275822f154724a38c9a55e39b3c8897f1a8c94b88a83ce7e09eae8b16bb7c66c9983ee21e9a9d'
  },
  port: 3000
};
 