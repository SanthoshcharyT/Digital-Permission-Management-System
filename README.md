<<<<<<< HEAD
# Digital Permission Management System

A comprehensive full-stack web application for managing college/university permission requests between students and faculty.

## Features

### 🎓 Student Features
- **Secure Login**: Role-based authentication with email/password
- **Request Submission**: Submit permission requests with reason, date/time, and file attachments
- **Real-time Updates**: See status changes instantly via Socket.IO
- **Request History**: View all submitted requests with status tracking
- **File Upload**: Support for medical certificates, invitations, and other documents

### 👨‍🏫 Faculty Features
- **Request Management**: View all student permission requests
- **Status Updates**: Approve, reject, or request more information
- **Real-time Notifications**: Get notified of new requests instantly
- **Filtering**: Filter requests by status (Pending, Approved, Rejected, Need More Info)
- **Comments**: Add comments when updating request status

### 🔧 Technical Features
- **Real-time Communication**: Socket.IO for instant updates
- **File Upload**: Multer for handling document uploads
- **Secure Authentication**: JWT-based authentication
- **Responsive Design**: Bootstrap 5 with custom styling
- **Database Integration**: MySQL for persistent data storage

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Styling**: Custom CSS with Bootstrap components

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd digital-permission-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup (Auto-Setup - Recommended)
Run the automated setup that creates everything for you:
```bash
npm run auto-setup
```

This will automatically:
- Create the database and tables
- Insert 5 faculty members and 10 students
- Add sample permission requests
- Set up all relationships

**Alternative Manual Setup:**
1. Create a MySQL database named `permission_system`
2. Run the SQL script to create tables and insert sample data:
```bash
mysql -u root -p permission_system < database_setup.sql
```

### 4. Configuration
Update the database configuration in `config.js` if needed:
```javascript
module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'permission_system'
  },
  jwt: {
    secret: 'your_jwt_secret_key_here'
  },
  port: 3000
};
```

### 5. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Demo Credentials

### Faculty Members (Password: 12345)
- Dr. Meena Reddy (meena.reddy@mallareddyuniversity.ac.in)
- Dr. Arjun Rao (arjun.rao@mallareddyuniversity.ac.in)

### Students (Password: 12345)
- Santhosh Chary (2311cs010647@mallareddyuniversity.ac.in)
- Tula Kethana Patel (2311cs010640@mallareddyuniversity.ac.in)
- Takkala Vineesh Reddy (2311cs010640b@mallareddyuniversity.ac.in)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Request Categories Table
```sql
CREATE TABLE request_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Requests Table
```sql
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    reason TEXT NOT NULL,
    date_time DATETIME NOT NULL,
    file_path VARCHAR(500) NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Need More Info') DEFAULT 'Pending',
    faculty_comment TEXT NULL,
    faculty_id INT NOT NULL,
    category_id INT NOT NULL,
    expected_duration_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES request_categories(id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Student Routes
- `GET /api/student/requests` - Get student's requests
- `POST /api/requests` - Submit new request

### Faculty Routes
- `GET /api/faculty/requests` - Get all requests
- `PUT /api/requests/:id/status` - Update request status

### General
- `GET /api/profile` - Get user profile

## File Structure
```
digital-permission-system/
├── public/
│   ├── index.html          # Login page
│   ├── student.html        # Student dashboard
│   └── faculty.html        # Faculty dashboard
├── uploads/                # File upload directory
├── server.js              # Main server file
├── config.js              # Configuration
├── database_setup.sql     # Database schema
├── package.json           # Dependencies
└── README.md             # This file
```

## Features in Detail

### Real-time Updates
The application uses Socket.IO to provide real-time communication:
- Students see status updates immediately
- Faculty get notified of new requests instantly
- No page refresh required for updates

### File Upload
- Supports multiple file formats (PDF, DOC, DOCX, JPG, PNG, GIF)
- 5MB file size limit
- Files stored in `/uploads` directory
- Secure file handling with validation

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- File upload security

### Responsive Design
- Mobile-friendly interface
- Bootstrap 5 components
- Custom CSS animations
- Smooth transitions and hover effects

## Development and modifications

### Adding New Features
1. Update the database schema if needed
2. Add new API routes in `server.js`
3. Update frontend JavaScript for new functionality
4. Test with different user roles

### Customization
- Modify `config.js` for different database settings
- Update CSS in HTML files for styling changes
- Add new user roles by updating the database schema


## Troubleshooting

### Common Issues
1. **Database Connection Error**: Check MySQL service and credentials
2. **File Upload Issues**: Ensure `/uploads` directory exists and is writable
3. **Socket.IO Connection**: Check if port 3000 is available
4. **Authentication Issues**: Verify JWT secret in config

### Logs
Check the console output for detailed error messages and debugging information.

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please create an issue in the repository or send a message. 
=======
# Digital-Permission-Management-System
Digital Permission Management System is a full-stack web app built with Node.js, Express.js, MySQL, HTML, CSS, and Bootstrap. It enables students to request permissions online and faculty to approve, reject, or ask for details, replacing paperwork with a secure, efficient, and real-time digital process.
 
<<<<<<< HEAD
- Updated on 8-04-2026
=======








- Update for 2026-04-08 at 10:00:00

- Update for 2026-04-08 at 18:00:00

- Update for 2026-04-09 at 10:00:00

- Update for 2026-04-09 at 18:00:00

<!-- update: 2026-04-11 11:01:00 -->

<!-- update: 2026-04-11 12:02:00 -->

<!-- update: 2026-04-12 11:01:00 -->

<!-- update: 2026-04-12 12:02:00 -->

<!-- update: 2026-04-13 11:01:00 -->

<!-- update: 2026-04-13 12:02:00 -->

<!-- update: 2026-04-14 11:01:00 -->

<!-- update: 2026-04-14 12:02:00 -->

<!-- update: 2026-04-15 11:01:00 -->

<!-- update: 2026-04-15 12:02:00 -->

<!-- update: 2026-04-16 11:01:00 -->

<!-- update: 2026-04-16 12:02:00 -->

<!-- update: 2026-04-17 11:01:00 -->

<!-- update: 2026-04-17 12:02:00 -->

<!-- update: 2026-04-18 11:01:00 -->

<!-- update: 2026-04-18 12:02:00 -->

<!-- update: 2026-04-19 11:01:00 -->

<!-- update: 2026-04-19 12:02:00 -->

<!-- update: 2026-04-20 11:01:00 -->

<!-- update: 2026-04-20 12:02:00 -->

<!-- update: 2026-04-21 11:01:00 -->

<!-- update: 2026-04-21 12:02:00 -->

<!-- update: 2026-04-22 11:01:00 -->

<!-- update: 2026-04-22 12:02:00 -->

<!-- update: 2026-04-23 11:01:00 -->

<!-- update: 2026-04-23 12:02:00 -->

<!-- update: 2026-04-24 11:01:00 -->

<!-- update: 2026-04-24 12:02:00 -->

<!-- update: 2026-04-25 11:01:00 -->

<!-- update: 2026-04-25 12:02:00 -->

<!-- update: 2026-04-26 11:01:00 -->

<!-- update: 2026-04-26 12:02:00 -->

<!-- update: 2026-04-27 11:01:00 -->

<!-- update: 2026-04-27 12:02:00 -->

<!-- update: 2026-04-28 11:01:00 -->

<!-- update: 2026-04-28 12:02:00 -->

<!-- update: 2026-04-29 11:01:00 -->

<!-- update: 2026-04-29 12:02:00 -->

<!-- update: 2026-04-30 11:01:00 -->

<!-- update: 2026-04-30 12:02:00 -->

<!-- update: 2026-05-01 11:01:00 -->

<!-- update: 2026-05-01 12:02:00 -->

<!-- update: 2026-05-02 11:01:00 -->

<!-- update: 2026-05-02 12:02:00 -->

<!-- update: 2026-05-03 11:01:00 -->

<!-- update: 2026-05-03 12:02:00 -->

<!-- update: 2026-05-04 11:01:00 -->

<!-- update: 2026-05-04 12:02:00 -->

<!-- update: 2026-04-11 11:01:00 -->

<!-- update: 2026-04-11 12:02:00 -->

<!-- update: 2026-04-12 11:01:00 -->

<!-- update: 2026-04-12 12:02:00 -->

<!-- update: 2026-04-13 11:01:00 -->

<!-- update: 2026-04-13 12:02:00 -->

<!-- update: 2026-04-14 11:01:00 -->

<!-- update: 2026-04-14 12:02:00 -->

<!-- update: 2026-04-15 11:01:00 -->

<!-- update: 2026-04-15 12:02:00 -->

<!-- update: 2026-04-16 11:01:00 -->

<!-- update: 2026-04-16 12:02:00 -->

<!-- update: 2026-04-17 11:01:00 -->

<!-- update: 2026-04-17 12:02:00 -->

<!-- update: 2026-04-18 11:01:00 -->

<!-- update: 2026-04-18 12:02:00 -->

<!-- update: 2026-04-19 11:01:00 -->

<!-- update: 2026-04-19 12:02:00 -->

<!-- update: 2026-04-20 11:01:00 -->

<!-- update: 2026-04-20 12:02:00 -->

<!-- update: 2026-04-21 11:01:00 -->

<!-- update: 2026-04-21 12:02:00 -->

<!-- update: 2026-04-22 11:01:00 -->

<!-- update: 2026-04-22 12:02:00 -->

<!-- update: 2026-04-23 11:01:00 -->

<!-- update: 2026-04-23 12:02:00 -->

<!-- update: 2026-04-24 11:01:00 -->

<!-- update: 2026-04-24 12:02:00 -->

<!-- update: 2026-04-25 11:01:00 -->

<!-- update: 2026-04-25 12:02:00 -->

<!-- update: 2026-04-26 11:01:00 -->

<!-- update: 2026-04-26 12:02:00 -->

<!-- update: 2026-04-27 11:01:00 -->

<!-- update: 2026-04-27 12:02:00 -->

<!-- update: 2026-04-28 11:01:00 -->

<!-- update: 2026-04-28 12:02:00 -->

<!-- update: 2026-04-29 11:01:00 -->

<!-- update: 2026-04-29 12:02:00 -->

<!-- update: 2026-04-30 11:01:00 -->

<!-- update: 2026-04-30 12:02:00 -->

<!-- update: 2026-05-01 11:01:00 -->

<!-- update: 2026-05-01 12:02:00 -->

<!-- update: 2026-05-02 11:01:00 -->

<!-- update: 2026-05-02 12:02:00 -->

<!-- update: 2026-05-03 11:01:00 -->

<!-- update: 2026-05-03 12:02:00 -->

<!-- update: 2026-05-04 11:01:00 -->

<!-- update: 2026-05-04 12:02:00 -->

Update: 2026-04-11 11:01:00

Update: 2026-04-11 12:02:00

Update: 2026-04-12 11:01:00

Update: 2026-04-12 12:02:00

Update: 2026-04-13 11:01:00

Update: 2026-04-13 12:02:00

Update: 2026-04-14 11:01:00

Update: 2026-04-14 12:02:00

Update: 2026-04-15 11:01:00

Update: 2026-04-15 12:02:00

Update: 2026-04-16 11:01:00

Update: 2026-04-16 12:02:00

Update: 2026-04-17 11:01:00

Update: 2026-04-17 12:02:00

Update: 2026-04-18 11:01:00

Update: 2026-04-18 12:02:00

Update: 2026-04-19 11:01:00

Update: 2026-04-19 12:02:00

Update: 2026-04-20 11:01:00

Update: 2026-04-20 12:02:00

Update: 2026-04-21 11:01:00

Update: 2026-04-21 12:02:00

Update: 2026-04-22 11:01:00

Update: 2026-04-22 12:02:00

Update: 2026-04-23 11:01:00

Update: 2026-04-23 12:02:00

Update: 2026-04-24 11:01:00

Update: 2026-04-24 12:02:00

Update: 2026-04-25 11:01:00

Update: 2026-04-25 12:02:00

Update: 2026-04-26 11:01:00

Update: 2026-04-26 12:02:00

Update: 2026-04-27 11:01:00

Update: 2026-04-27 12:02:00

Update: 2026-04-28 11:01:00

Update: 2026-04-28 12:02:00

Update: 2026-04-29 11:01:00

Update: 2026-04-29 12:02:00

Update: 2026-04-30 11:01:00

Update: 2026-04-30 12:02:00

Update: 2026-05-01 11:01:00

Update: 2026-05-01 12:02:00

Update: 2026-05-02 11:01:00
