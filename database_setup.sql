-- Create database to store the data for the permission system
CREATE DATABASE IF NOT EXISTS permission_system;
USE permission_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create request_categories table
CREATE TABLE IF NOT EXISTS request_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
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

-- Insert dummy users (passwords are hashed '12345')
INSERT INTO users (name, email, password, role) VALUES
('Santhosh Chary', '2311cs010647@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'student'),
('Tula Kethana Patel', '2311cs010640@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'student'),
('Tenali Megana Reddy', '2311cs010644@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'student'),
('Takkala Vineesh Reddy', '2311cs010640b@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'student'),
('Dr. Meena Reddy', 'meena.reddy@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'faculty'),
('Dr. Arjun Rao', 'arjun.rao@mallareddyuniversity.ac.in', '$2b$10$BxsU2V5PZV0YH8A9.3iR8eJ7J8Uq1/JXjG4McU1DZ1zS3MqqE6aQ6', 'faculty');

-- Insert request categories
INSERT INTO request_categories (name, description) VALUES
('Medical Leave', 'Leave for medical reasons, health checkups, or medical emergencies'),
('Personal Leave', 'Leave for personal reasons, family functions, or personal commitments'),
('Academic Leave', 'Leave for academic purposes, conferences, competitions, or educational events'),
('Emergency Leave', 'Leave for urgent or emergency situations requiring immediate attention'),
('Other', 'Any other type of leave not covered by the above categories');

-- Insert sample requests for new students
INSERT INTO requests (student_id, reason, date_time, status, faculty_id, category_id, expected_duration_days) VALUES
-- Santhosh Chary (id = 1) -> Dr. Meena Reddy (id = 5) -> Medical Leave (id = 1)
(1, 'Medical leave for checkup', '2025-09-20 10:00:00', 'Pending', 5, 1, 1),

-- Tula Kethana Patel (id = 2) -> Dr. Arjun Rao (id = 6) -> Personal Leave (id = 2)
(2, 'Attending a cultural festival', '2025-09-21 09:00:00', 'Approved', 6, 2, 2),

--

-- Takkala Vineesh Reddy (id = 4) -> Dr. Arjun Rao (id = 6) → Academic Leave (id = 3)
(4, 'Project presentation at external college', '2025-09-23 14:00:00', 'Rejected', 6, 3, 1);
