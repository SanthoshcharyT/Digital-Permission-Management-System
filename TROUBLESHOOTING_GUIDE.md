# 🚨 Complete Troubleshooting Guide for Digital Permission System

## ⚡ Quick Fix for Tomorrow's AI Execution

### **Step 1: Start the Server (ALWAYS DO THIS FIRST)**

```bash
# Open Command Prompt or PowerShell in the project folder
cd C:\Users\santh\Downloads\digital-permission-system

# Kill any existing processes
taskkill /F /IM node.exe

# Start the server
npm start
```

**✅ You should see:**
```
Server running on port 3000
Visit http://localhost:3000 to access the application
```

### **Step 2: Test the Server**

Open a new terminal and run:
```bash
curl http://localhost:3000
```

**✅ You should see HTML content (not an error)**

### **Step 3: Open in Browser**

1. **Open Chrome/Edge/Firefox**
2. **Go to:** http://localhost:3000
3. **You should see the login page**

---

## 🔧 Common Issues & Solutions

### **Issue 1: "EADDRINUSE" Error (Port 3000 in use)**

**Solution:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number you see)
taskkill /F /PID <PID_NUMBER>

# Start server again
npm start
```

### **Issue 2: "Network Error" in Browser**

**Solution:**
1. **Check if server is running:**
   ```bash
   netstat -ano | findstr :3000
   ```
   Should show: `LISTENING`

2. **Clear browser cache:**
   - Press `Ctrl+Shift+R`
   - Or `F12` → Network tab → Right-click → "Clear browser cache"

3. **Try different URL:**
   - http://localhost:3000
   - http://127.0.0.1:3000

### **Issue 3: "Invalid Credentials" Error**

**Use these EXACT credentials:**

**Students:**
- Email: `2311cs010647@mallareddyuniversity.ac.in`
- Password: `12345`
- Role: `Student`

**Faculty:**
- Email: `meena.reddy@mallareddyuniversity.ac.in`
- Password: `12345`
- Role: `Faculty`

### **Issue 4: "All required fields must be filled" Error**

**This is FIXED!** The form should work now. If you still get this error:
1. **Refresh the page** (`Ctrl+F5`)
2. **Clear browser cache**
3. **Make sure all fields are filled**

### **Issue 5: "Internal server error" when updating status**

**This is FIXED!** All status updates should work now.

---

## 🎯 For Tomorrow's AI Execution

### **Pre-Execution Checklist:**

1. **✅ Server Running:**
   ```bash
   npm start
   ```

2. **✅ Test Login:**
   - Go to http://localhost:3000
   - Login with student credentials
   - Submit a test request

3. **✅ Test Faculty:**
   - Login with faculty credentials
   - Update request status

### **If Something Goes Wrong Tomorrow:**

1. **Kill all Node processes:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Start fresh:**
   ```bash
   npm start
   ```

3. **Test in browser:**
   - http://localhost:3000

---

## 📱 Demo Credentials (Copy-Paste Ready)

### **Student Login:**
```
Email: 2311cs010647@mallareddyuniversity.ac.in
Password: 12345
Role: Student
```

### **Faculty Login:**
```
Email: meena.reddy@mallareddyuniversity.ac.in
Password: 12345
Role: Faculty
```

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd C:\Users\santh\Downloads\digital-permission-system

# Kill existing processes
taskkill /F /IM node.exe

# Start server
npm start

# Test server (in new terminal)
curl http://localhost:3000
```

---

## 📞 Emergency Fixes

### **If Server Won't Start:**
1. Check if port 3000 is free: `netstat -ano | findstr :3000`
2. Kill processes: `taskkill /F /IM node.exe`
3. Restart: `npm start`

### **If Browser Shows Error:**
1. Clear cache: `Ctrl+Shift+R`
2. Try: http://127.0.0.1:3000
3. Check console: `F12` → Console tab

### **If Database Error:**
1. Make sure MySQL is running
2. Check credentials in `config.js`

---

## ✅ Success Indicators

**Server is working when you see:**
```
Server running on port 3000
Visit http://localhost:3000 to access the application
```

**Browser is working when you see:**
- Login page loads
- Can login with credentials
- Can submit requests (students)
- Can update status (faculty)

**Everything is ready for tomorrow! 🎉**
