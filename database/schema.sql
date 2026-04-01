-- School Management System Database Schema
-- PostgreSQL

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS student_documents CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS course_schedules CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    head_of_department VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Users Table (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'Student', 'Faculty', 'Staff')) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    last_login_date TIMESTAMP,
    student_id INTEGER,
    faculty_id INTEGER,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
);

-- Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    enrollment_status VARCHAR(20) DEFAULT 'Active' CHECK (enrollment_status IN ('Active', 'Inactive', 'Graduated', 'Suspended', 'Withdrawn')),
    department_id INTEGER,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Add foreign key after students table exists
ALTER TABLE users ADD CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES students(id);

-- Faculty Table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    faculty_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE,
    designation VARCHAR(50) CHECK (designation IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer')),
    qualification VARCHAR(100),
    specialization VARCHAR(100),
    salary DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Retired', 'Terminated')),
    department_id INTEGER,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Add foreign key after faculty table exists
ALTER TABLE users ADD CONSTRAINT fk_user_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id);

-- Courses Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    duration_in_hours INTEGER,
    course_level VARCHAR(20) CHECK (course_level IN ('Beginner', 'Intermediate', 'Advanced')),
    prerequisites TEXT,
    fee DECIMAL(10, 2) DEFAULT 0,
    department_id INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Course Schedules Table
CREATE TABLE course_schedules (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_id INTEGER NOT NULL,
    faculty_id INTEGER NOT NULL,
    classroom VARCHAR(50),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    schedule_type VARCHAR(20) CHECK (schedule_type IN ('Lecture', 'Lab', 'Tutorial', 'Seminar')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- Enrollments Table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    enrollment_status VARCHAR(20) DEFAULT 'Enrolled' CHECK (enrollment_status IN ('Enrolled', 'Completed', 'Dropped', 'Waitlisted')),
    semester VARCHAR(20) NOT NULL,
    academic_year INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id, semester, academic_year)
);

-- Grades Table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    semester VARCHAR(20) NOT NULL,
    academic_year INTEGER NOT NULL,
    marks_obtained DECIMAL(5, 2),
    total_marks DECIMAL(5, 2) DEFAULT 100,
    grade_letter VARCHAR(5),
    grade_point DECIMAL(3, 2),
    remarks TEXT,
    grade_date DATE DEFAULT CURRENT_DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id, semester, academic_year)
);

-- Attendance Table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    course_schedule_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')) NOT NULL,
    remarks TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_schedule_id) REFERENCES course_schedules(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_schedule_id, attendance_date)
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    payment_id VARCHAR(20) UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50),
    payment_type VARCHAR(20) CHECK (payment_type IN ('Tuition', 'Library', 'Lab', 'Hostel', 'Other')),
    reference_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    semester VARCHAR(20),
    academic_year INTEGER,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Announcements Table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(20) CHECK (announcement_type IN ('General', 'Academic', 'Event', 'Emergency')),
    publish_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    target_audience VARCHAR(20) CHECK (target_audience IN ('All', 'Students', 'Faculty', 'Staff')),
    department_id INTEGER,
    author VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Student Documents Table
CREATE TABLE student_documents (
    id SERIAL PRIMARY KEY,
    guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    student_id INTEGER NOT NULL,
    document_type VARCHAR(50),
    document_name VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    upload_date DATE DEFAULT CURRENT_DATE,
    remarks TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Login History Table
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_faculty_faculty_id ON faculty(faculty_id);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_announcements_publish ON announcements(publish_date);

-- Insert default departments
INSERT INTO departments (department_code, department_name, description, head_of_department, contact_email, contact_phone) VALUES
('CS', 'Computer Science', 'Department of Computer Science and Engineering', 'Dr. John Smith', 'cs@school.edu', '555-0101'),
('ENG', 'English', 'Department of English Language and Literature', 'Dr. Sarah Johnson', 'eng@school.edu', '555-0102'),
('MATH', 'Mathematics', 'Department of Mathematics', 'Dr. Michael Brown', 'math@school.edu', '555-0103'),
('PHY', 'Physics', 'Department of Physics', 'Dr. Emily Davis', 'phy@school.edu', '555-0104'),
('CHEM', 'Chemistry', 'Department of Chemistry', 'Dr. Robert Wilson', 'chem@school.edu', '555-0105');

-- Insert admin user (password: admin123 - hashed with bcrypt)
-- Default admin: username: admin, email: admin@school.edu, password: admin123
INSERT INTO users (username, email, password_hash, role, first_name, last_name, is_email_verified)
VALUES ('admin', 'admin@school.edu', '$2a$10$xT6GkLbKzKqLbKzKqLbKzO9YvZ1YvZ1YvZ1YvZ1YvZ1YvZ1YvZ', 'Admin', 'System', 'Administrator', true);

-- Note: The password hash above is a placeholder. In production, use bcrypt to hash actual passwords.
-- Example: bcrypt.hash('admin123', 10) will produce a real hash