#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Digital Permission Management System - Deployment Script\n');

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

console.log('📋 Starting deployment process...\n');

try {
    // Step 1: Install dependencies
    console.log('1️⃣ Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully\n');
    } catch (installError) {
        console.log('⚠ npm install failed, trying alternative methods...\n');
        
        // Try with different registry
        try {
            execSync('npm install --registry https://registry.npmjs.org/', { stdio: 'inherit' });
            console.log('✅ Dependencies installed with alternative registry\n');
        } catch (altError) {
            console.log('⚠ Alternative install failed, trying yarn...\n');
            try {
                execSync('yarn install', { stdio: 'inherit' });
                console.log('✅ Dependencies installed with yarn\n');
            } catch (yarnError) {
                console.log('❌ All installation methods failed. Please check your internet connection.\n');
                console.log('💡 Manual setup required:\n');
                console.log('1. Ensure you have internet connection');
                console.log('2. Try: npm install --verbose');
                console.log('3. Or copy node_modules from working device');
                process.exit(1);
            }
        }
    }

    // Step 2: Auto-setup database
    console.log('2️⃣ Setting up database and users...');
    execSync('npm run auto-setup', { stdio: 'inherit' });
    console.log('✅ Database setup completed\n');

    // Step 3: Start the application
    console.log('3️⃣ Starting the application...');
    console.log('🎉 Deployment completed successfully!\n');
    
    console.log('📱 Your Digital Permission Management System is ready!');
    console.log('🌐 Access it at: http://localhost:3000\n');
    
    console.log('👥 Quick Login Credentials:');
    console.log('📚 Faculty: smith@univ.com (Password: 12345)');
    console.log('🎓 Student: alice@univ.com (Password: 12345)\n');
    
    console.log('💡 To start the server, run: npm start');
    console.log('💡 For development mode, run: npm run dev\n');
    
    console.log('📖 For more information, check SETUP_GUIDE.md');

} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in config.js');
    console.log('3. Ensure you have Node.js and npm installed');
    console.log('4. Run as administrator if needed');
    process.exit(1);
}