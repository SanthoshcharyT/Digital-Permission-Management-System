const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const config = require('./config');

if (!config.jwt.secret) {
  console.error('JWT_SECRET is not set. Copy .env.example to .env and set it.');
  process.exit(1);
}

if (!config.database.url) {
  console.error('DATABASE_URL is not set. Add your Supabase connection string to .env.');
  process.exit(1);
}

const pool = require('./db');

const app = express();

// Socket.IO only runs on a long-lived server (`npm start`). On Vercel's serverless
// functions there is no io, so notifications are skipped and the pages poll instead.
let io = null;
const notify = (room, event, payload) => {
  if (io) io.to(room).emit(event, payload);
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uploaded files are stored in the database (serverless hosts have no persistent disk)
// and served at /uploads/<name>, the same path older disk-stored files use.
app.get('/uploads/:name', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT data FROM request_files WHERE name = $1', [req.params.name]);
    if (rows.length === 0) {
      return res.status(404).send('File not found');
    }
    res.set('X-Content-Type-Options', 'nosniff');
    res.type(path.extname(req.params.name)).send(rows[0].data);
  } catch (error) {
    next(error);
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
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

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
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
    const { rows: facultyCheck } = await pool.query(
      'SELECT id, name FROM users WHERE id = $1 AND role = $2',
      [facultyId, 'faculty']
    );

    if (facultyCheck.length === 0) {
      return res.status(400).json({ error: 'Invalid faculty selection' });
    }

    let filePath = null;
    if (req.file) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname).toLowerCase();
      await pool.query('INSERT INTO request_files (name, data) VALUES ($1, $2)', [fileName, req.file.buffer]);
      filePath = 'uploads/' + fileName;
    }

    const { rows: inserted } = await pool.query(
      'INSERT INTO requests (student_id, reason, date_time, file_path, faculty_id, category_id, expected_duration_days) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [studentId, reason, requestDateTime, filePath, facultyId, categoryId, expectedDurationDays]
    );
    const requestId = inserted[0].id;

    // Emit real-time update to specific faculty member
    notify(`faculty_${facultyId}`, 'new_request', {
      id: requestId,
      student_id: studentId,
      student_name: req.user.name,
      reason,
      date_time: requestDateTime,
      file_path: filePath,
      faculty_id: facultyId,
      faculty_name: facultyCheck[0].name,
      status: 'Pending'
    });

    res.json({
      message: 'Request submitted successfully',
      requestId
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

    const { rows } = await pool.query(
      'SELECT * FROM requests WHERE student_id = $1 ORDER BY created_at DESC',
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

    const { rows } = await pool.query(`
      SELECT r.*, u.name as student_name, u.email as student_email
      FROM requests r
      JOIN users u ON r.student_id = u.id
      WHERE r.faculty_id = $1
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

    // Only the faculty member the request was sent to may update it
    const result = await pool.query(
      'UPDATE requests SET status = $1, faculty_comment = $2 WHERE id = $3 AND faculty_id = $4',
      [status, comment || null, id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Get updated request with student info
    const { rows: updatedRequest } = await pool.query(`
      SELECT r.*, u.name as student_name, u.email as student_email
      FROM requests r
      JOIN users u ON r.student_id = u.id
      WHERE r.id = $1
    `, [id]);

    // Emit real-time update only to the student who owns the request
    notify(`student_${updatedRequest[0].student_id}`, 'request_updated', updatedRequest[0]);

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
    const { rows } = await pool.query(
      'SELECT id, name, email FROM users WHERE role = $1 ORDER BY name',
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
    const { rows } = await pool.query(
      'SELECT * FROM request_categories ORDER BY name'
    );

    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

module.exports = app;

// Start a long-lived server when run directly (`npm start`); Vercel imports the app instead
if (require.main === module) {
  const http = require('http');
  const socketIo = require('socket.io');
  const server = http.createServer(app);
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO authentication: identity comes from the JWT, not from the client
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Access token required'));
    }
    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        return next(new Error('Invalid or expired token'));
      }
      socket.user = user;
      next();
    });
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Each user joins a private room for targeted notifications
    socket.join(`${socket.user.role}_${socket.user.id}`);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const PORT = config.port || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
  });
}
