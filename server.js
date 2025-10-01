const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Database connection
const dbConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit permission request
app.post('/api/requests', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const {
      reason,
      date_time,
      dateTime,
      faculty_id,
      faculty,
      category_id,
      category,
      expected_duration_days,
      duration
    } = req.body;
    const studentId = req.user.id;

    // Handle both date_time and dateTime field names
    const requestDateTime = date_time || dateTime;
    // Handle both faculty_id and faculty field names
    const facultyId = faculty_id || faculty;
    // Handle both category_id and category field names
    const categoryId = category_id || category;
    // Handle both expected_duration_days and duration field names
    const expectedDurationDays = expected_duration_days || duration;

    if (!reason || !requestDateTime || !facultyId || !categoryId || !expectedDurationDays) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit requests' });
    }

    // Verify the selected faculty exists and is actually a faculty member
    const [facultyCheck] = await pool.execute(
      'SELECT id, name FROM users WHERE id = ? AND role = ?',
      [facultyId, 'faculty']
    );

    if (facultyCheck.length === 0) {
      return res.status(400).json({ error: 'Invalid faculty selection' });
    }

    const filePath = req.file ? req.file.path : null;

    const [result] = await pool.execute(
      'INSERT INTO requests (student_id, reason, date_time, file_path, faculty_id, category_id, expected_duration_days) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [studentId, reason, requestDateTime, filePath, facultyId, categoryId, expectedDurationDays]
    );

    // Emit real-time update to specific faculty member
    io.to(`faculty_${facultyId}`).emit('new_request', {
      id: result.insertId,
      student_id: studentId,
      student_name: req.user.name,
      reason,
      date_time: requestDateTime,
      file_path: filePath,
      faculty_id: facultyId,
      faculty_name: facultyCheck[0].name,
      status: 'pending'
    });

    res.json({
      message: 'Request submitted successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student's own requests
app.get('/api/student/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM requests WHERE student_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Get student requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all requests (for faculty)
app.get('/api/faculty/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [rows] = await pool.execute(`
      SELECT r.*, u.name as student_name, u.email as student_email 
      FROM requests r 
      JOIN users u ON r.student_id = u.id 
      WHERE r.faculty_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (error) {
    console.error('Get faculty requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update request status
app.put('/api/requests/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can update request status' });
    }

    if (!['Pending', 'Approved', 'Rejected', 'Need More Info'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Convert status to lowercase to match database ENUM
    const statusMap = {
      'Pending': 'pending',
      'Approved': 'approved',
      'Rejected': 'rejected',
      'Need More Info': 'need_more_info'
    };

    const dbStatus = statusMap[status];

    const [result] = await pool.execute(
      'UPDATE requests SET status = ?, faculty_comment = ? WHERE id = ?',
      [dbStatus, comment, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Get updated request with student info
    const [updatedRequest] = await pool.execute(`
      SELECT r.*, u.name as student_name, u.email as student_email 
      FROM requests r 
      JOIN users u ON r.student_id = u.id 
      WHERE r.id = ?
    `, [id]);

    // Emit real-time update to student
    io.emit('request_updated', updatedRequest[0]);

    res.json({ message: 'Request status updated successfully' });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get list of faculty members
app.get('/api/faculty', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE role = ? ORDER BY name',
      ['faculty']
    );

    res.json(rows);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get request categories
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM request_categories ORDER BY name'
    );

    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (data) => {
    if (data.role === 'student') {
      socket.join('students');
    } else if (data.role === 'faculty') {
      socket.join('faculty');
      // Join specific faculty room for targeted notifications
      socket.join(`faculty_${data.userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/faculty', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faculty.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});
