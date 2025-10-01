# 🚀 Digital Permission Management System - Setup Guide

## 📋 Quick Setup for New Devices

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Configure Database**
Update `config.js` with your MySQL credentials:
```javascript
module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',  // Change this
    database: 'permission_system'
  },
  jwt: {
    secret: 'your_jwt_secret_key_here'
  },
  port: 3000
};
```

### **Step 3: Auto-Setup Database & Users**
```bash
npm run auto-setup
```

This command will:
- ✅ Create the database
- ✅ Create all required tables
- ✅ Insert 5 faculty members
- ✅ Insert 10 students
- ✅ Add sample permission requests
- ✅ Set up all relationships

### **Step 4: Start the Application**
```bash
npm start
```

### **Step 5: Access the System**
Open your browser and go to: `http://localhost:3000`

---

## 👥 **Pre-loaded Accounts**

### **📚 Faculty Members (Password: 12345)**
- Dr. Sarah Smith (smith@univ.com)
- Dr. Michael Brown (brown@univ.com)
- Prof. Emily Johnson (johnson@univ.com)
- Dr. David Wilson (wilson@univ.com)
- Prof. Lisa Davis (davis@univ.com)

### **🎓 Students (Password: 12345)**
- Alice Johnson (alice@univ.com)
- Bob Smith (bob@univ.com)
- Charlie Brown (charlie@univ.com)
- Diana Prince (diana@univ.com)
- Ethan Hunt (ethan@univ.com)
- Fiona Green (fiona@univ.com)
- George Lucas (george@univ.com)
- Hannah Montana (hannah@univ.com)
- Ian Fleming (ian@univ.com)
- Julia Roberts (julia@univ.com)

---

## 🔧 **Manual Setup (Alternative)**

If you prefer manual setup:

### **1. Create Database**
```sql
CREATE DATABASE permission_system;
```

### **2. Run SQL Script**
```bash
mysql -u root -p permission_system < database_setup.sql
```

### **3. Start Application**
```bash
npm start
```

---

## 📱 **Testing the System**

### **Student Workflow:**
1. Login as any student (e.g., alice@univ.com / 12345)
2. Submit a permission request
3. Select a faculty member
4. Fill in reason and date/time
5. Submit the request

### **Faculty Workflow:**
1. Login as any faculty (e.g., smith@univ.com / 12345)
2. View requests assigned to you
3. Approve/Reject/Request more info
4. Add comments if needed

---

## 🛠️ **Troubleshooting**

### **Database Connection Issues:**
- Ensure MySQL is running
- Check credentials in `config.js`
- Verify MySQL service is accessible

### **Port Already in Use:**
- Change port in `config.js`
- Or kill existing Node.js processes

### **Permission Denied:**
- Run as administrator (Windows)
- Check file permissions
- Ensure MySQL user has proper privileges

---

## 📊 **System Features**

- ✅ **Role-based Authentication**
- ✅ **Faculty Assignment System**
- ✅ **Real-time Updates**
- ✅ **File Upload Support**
- ✅ **Request Status Tracking**
- ✅ **Responsive Design**
- ✅ **Sample Data Included**

---

## 🎯 **Ready to Use!**

After running `npm run auto-setup`, your system will have:
- 5 faculty members ready to receive requests
- 10 students ready to submit requests
- Sample requests to demonstrate the system
- All relationships properly configured

**No additional setup required!** 🎉
