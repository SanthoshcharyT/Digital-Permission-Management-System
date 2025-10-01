# VS Code Setup Guide for Digital Permission System

## 🚀 Quick Start

### 1. Open Project in VS Code
1. Open VS Code
2. File → Open Folder
3. Select the `digital-permission-system` folder

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
The database has already been set up with the correct schema. If you need to reset it:
```bash
npm run setup
```

### 4. Start the Server
You have several options:

#### Option A: Using VS Code Tasks
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Start Server" or "Start Development Server"

#### Option B: Using Terminal
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

#### Option C: Using VS Code Debugger
1. Go to Run and Debug panel (Ctrl+Shift+D)
2. Select "Launch Server" from dropdown
3. Press F5 or click the play button

### 5. Access the Application
Open your browser and go to: http://localhost:3000

## 🔧 VS Code Configuration

### Debugging
- **Launch Server**: Debug the main server
- **Launch Setup**: Debug the database setup script

### Tasks Available
- **Install Dependencies**: Run `npm install`
- **Setup Database**: Run `npm run setup`
- **Start Server**: Run `npm start`
- **Start Development Server**: Run `npm run dev`

### Settings
The project includes optimized VS Code settings:
- Format on save enabled
- Auto-fix on save enabled
- Node.js modules excluded from file explorer
- JavaScript auto-imports enabled

## 🗄️ Database Information

### Connection Details
- **Host**: localhost
- **User**: root
- **Password**: 12345
- **Database**: permission_system

### Demo Credentials

#### Faculty (Password: 12345)
- Dr. Meena Reddy (meena.reddy@mallareddyuniversity.ac.in)
- Dr. Arjun Rao (arjun.rao@mallareddyuniversity.ac.in)

#### Students (Password: 12345)
- Santhosh Chary (2311cs010647@mallareddyuniversity.ac.in)
- Tula Kethana Patel (2311cs010640@mallareddyuniversity.ac.in)
- Tenali Megana Reddy (2311cs010644@mallareddyuniversity.ac.in)
- Takkala Vineesh Reddy (2311cs010640b@mallareddyuniversity.ac.in)

## 🐛 Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if MySQL is running
   - Verify database credentials in `config.js`
   - Check if port 3000 is available

2. **Database connection error**
   - Ensure MySQL service is running
   - Check credentials in `config.js`
   - Run `npm run setup` to reset database

3. **File upload issues**
   - Ensure `uploads/` directory exists
   - Check file permissions

4. **Socket.IO connection issues**
   - Check browser console for errors
   - Ensure server is running on port 3000

### Debug Steps
1. Check the terminal output for error messages
2. Use VS Code debugger to step through code
3. Check browser developer tools for frontend errors
4. Verify database connection with MySQL client

## 📁 Project Structure

```
digital-permission-system/
├── .vscode/
│   ├── launch.json          # Debug configurations
│   ├── settings.json        # VS Code settings
│   └── tasks.json           # Available tasks
├── public/
│   ├── index.html           # Login page
│   ├── student.html         # Student dashboard
│   └── faculty.html         # Faculty dashboard
├── uploads/                 # File upload directory
├── server.js               # Main server file
├── config.js               # Configuration
├── database_setup.sql      # Database schema
├── package.json            # Dependencies
└── README.md              # Project documentation
```

## 🎯 Development Tips

1. **Use the debugger**: Set breakpoints and step through code
2. **Check console output**: Server logs provide valuable debugging info
3. **Test both roles**: Use different browser windows for student/faculty testing
4. **Monitor network requests**: Use browser dev tools to see API calls
5. **Database queries**: Use MySQL client to verify data changes

## 🔄 Hot Reload

For development, use:
```bash
npm run dev
```

This will automatically restart the server when you make changes to the code.

## 📝 Next Steps

1. **Test the application**: Login with demo credentials
2. **Submit a request**: Test the student workflow
3. **Approve/Reject**: Test the faculty workflow
4. **File uploads**: Test document upload functionality
5. **Real-time updates**: Test Socket.IO functionality

## 🆘 Getting Help

If you encounter issues:
1. Check the console output
2. Review this setup guide
3. Check the main README.md
4. Verify all prerequisites are installed
5. Ensure MySQL is running and accessible

Happy coding! 🎉
