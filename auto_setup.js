const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('./config');

async function autoSetup() {
    console.log('🚀 Auto-setting up Digital Permission Management System...\n');
    
    try {
        // Connect to MySQL
        const connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password
        });

        console.log('✅ Connected to MySQL server');

        // Create database
        await connection.query('CREATE DATABASE IF NOT EXISTS permission_system');
        console.log('✅ Database created/verified');

        // Use the database
        await connection.query('USE permission_system');

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('student', 'faculty') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created');

        // Create requests table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                reason TEXT NOT NULL,
                date_time DATETIME NOT NULL,
                file_path VARCHAR(500) NULL,
                status ENUM('Pending', 'Approved', 'Rejected', 'Need More Info') DEFAULT 'Pending',
                faculty_comment TEXT NULL,
                faculty_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Requests table created');

        // Hash password for all users
        const hashedPassword = await bcrypt.hash('12345', 10);
        console.log('✅ Generated password hash');

        // Insert faculty members
        const facultyMembers = [
            { name: 'Dr. Sarah Smith', email: 'smith@univ.com' },
            { name: 'Dr. Michael Brown', email: 'brown@univ.com' },
            { name: 'Prof. Emily Johnson', email: 'johnson@univ.com' },
            { name: 'Dr. David Wilson', email: 'wilson@univ.com' },
            { name: 'Prof. Lisa Davis', email: 'davis@univ.com' }
        ];

        for (const faculty of facultyMembers) {
            await connection.query(`
                INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
            `, [faculty.name, faculty.email, hashedPassword, 'faculty']);
        }
        console.log(`✅ Inserted ${facultyMembers.length} faculty members`);

        // Insert students
        const students = [
            { name: 'Alice Johnson', email: 'alice@univ.com' },
            { name: 'Bob Smith', email: 'bob@univ.com' },
            { name: 'Charlie Brown', email: 'charlie@univ.com' },
            { name: 'Diana Prince', email: 'diana@univ.com' },
            { name: 'Ethan Hunt', email: 'ethan@univ.com' },
            { name: 'Fiona Green', email: 'fiona@univ.com' },
            { name: 'George Lucas', email: 'george@univ.com' },
            { name: 'Hannah Montana', email: 'hannah@univ.com' },
            { name: 'Ian Fleming', email: 'ian@univ.com' },
            { name: 'Julia Roberts', email: 'julia@univ.com' }
        ];

        for (const student of students) {
            await connection.query(`
                INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
            `, [student.name, student.email, hashedPassword, 'student']);
        }
        console.log(`✅ Inserted ${students.length} students`);

        // Insert some sample requests
        const sampleRequests = [
            { student_id: 1, faculty_id: 1, reason: 'Medical appointment for regular checkup', date_time: '2024-01-15 10:00:00', status: 'Approved' },
            { student_id: 2, faculty_id: 2, reason: 'Family emergency - need to visit hometown', date_time: '2024-01-16 14:30:00', status: 'Pending' },
            { student_id: 3, faculty_id: 1, reason: 'Academic conference attendance', date_time: '2024-01-20 09:00:00', status: 'Need More Info' },
            { student_id: 4, faculty_id: 3, reason: 'Job interview in another city', date_time: '2024-01-22 11:00:00', status: 'Approved' },
            { student_id: 5, faculty_id: 2, reason: 'Wedding ceremony of close friend', date_time: '2024-01-25 16:00:00', status: 'Pending' }
        ];

        for (const request of sampleRequests) {
            await connection.query(`
                INSERT IGNORE INTO requests (student_id, faculty_id, reason, date_time, status) VALUES (?, ?, ?, ?, ?)
            `, [request.student_id, request.faculty_id, request.reason, request.date_time, request.status]);
        }
        console.log(`✅ Inserted ${sampleRequests.length} sample requests`);

        await connection.end();
        
        console.log('\n🎉 Auto-setup completed successfully!');
        console.log('\n📋 System is ready to use:');
        console.log('1. Run: npm start');
        console.log('2. Open: http://localhost:3000');
        
        console.log('\n👥 Available Accounts:');
        console.log('\n📚 Faculty Members:');
        facultyMembers.forEach(faculty => {
            console.log(`   - ${faculty.name} (${faculty.email}) - Password: 12345`);
        });
        
        console.log('\n🎓 Students:');
        students.forEach(student => {
            console.log(`   - ${student.name} (${student.email}) - Password: 12345`);
        });
        
        console.log('\n💡 All accounts use password: 12345');
        
    } catch (error) {
        console.error('❌ Auto-setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Check your database credentials in config.js');
        console.log('3. Ensure you have permission to create databases');
        process.exit(1);
    }
}

autoSetup();
