#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Digital Permission Management System - Offline Setup\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

// Check if config.js exists
if (!fs.existsSync('config.js')) {
    console.error('❌ Error: config.js not found. Please ensure the configuration file exists.');
    process.exit(1);
}

console.log('📋 Starting offline setup process...\n');

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
    console.log('✅ Dependencies found (node_modules exists)\n');
} else {
    console.log('❌ Dependencies not found. Please install them first:\n');
    console.log('💡 Try one of these methods:');
    console.log('1. npm install');
    console.log('2. yarn install');
    console.log('3. Copy node_modules from working device\n');
    process.exit(1);
}

// Check if database setup is needed
console.log('🔧 Setting up database...\n');

try {
    const { execSync } = require('child_process');
    
    // Run auto-setup
    execSync('node auto_setup.js', { stdio: 'inherit' });
    console.log('✅ Database setup completed\n');
    
    console.log('🎉 Offline setup completed successfully!\n');
    
    console.log('📱 Your Digital Permission Management System is ready!');
    console.log('🌐 Access it at: http://localhost:3000\n');
    
    console.log('👥 Quick Login Credentials:');
    console.log('📚 Faculty: smith@univ.com (Password: 12345)');
    console.log('🎓 Student: alice@univ.com (Password: 12345)\n');
    
    console.log('💡 To start the server, run: npm start');
    console.log('💡 For development mode, run: npm run dev\n');
    
} catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in config.js');
    console.log('3. Ensure you have Node.js installed');
    console.log('4. Run as administrator if needed');
    process.exit(1);
}