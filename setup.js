//setup.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function setupDatabase() {
    console.log('🚀 Setting up Digital Permission Management System....\n');

    try {
        // Create database connection for mYsql
        const connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password
        });

        console.log('✅ Connected to MySQL server');

        // Create database to store the data 

        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`);
        console.log(`✅ Database '${config.database.database}' created/verified`);

        // Use the database
        await connection.execute(`USE ${config.database.database}`);

        // Read and execute SQL setup file
        const sqlFile = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
        const statements = sqlFile.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    // Use query instead of execute for DDL statements
                    await connection.query(statement);
                } catch (error) {
                    // Skip errors for statements that might already exist
                    if (!error.message.includes('already exists') && !error.message.includes('Duplicate entry')) {
                        console.log(`Warning: ${error.message}`);
                    }
                }
            }
        }

        console.log('✅ Database tables created and sample data inserted');

        // Create uploads directory
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
            console.log('✅ Uploads directory created');
        }

        await connection.end();
        console.log('\n🎉 Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Run: npm start');
        console.log('2. Open: http://localhost:3000');
        console.log('\n👥 Demo credentials:');
        console.log('Students: 2311cs010647@mallareddyuniversity.ac.in, 2311cs010640@mallareddyuniversity.ac.in (password: 12345)');
        console.log('Faculty: meena.reddy@mallareddyuniversity.ac.in, arjun.rao@mallareddyuniversity.ac.in (password: 12345)');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Check your database credentials in config.js');
        console.log('3. Ensure you have permission to create databases');
        process.exit(1);
    }
}

setupDatabase();
