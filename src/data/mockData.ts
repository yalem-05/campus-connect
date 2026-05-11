import type { Student, Faculty, Course, Department, Enrollment, Attendance, Grade, Payment, Announcement } from "@/types/models";

export const departments: Department[] = [
  { id: 1, guid: "d1", departmentCode: "CS", departmentName: "Computer Science", description: "Computer Science and Engineering", headOfDepartment: "Dr. Alan Turing", contactEmail: "cs@university.edu", contactPhone: "555-0101", createdDate: "2024-01-01", isActive: true },
  { id: 2, guid: "d2", departmentCode: "MATH", departmentName: "Mathematics", description: "Pure and Applied Mathematics", headOfDepartment: "Dr. Emily Noether", contactEmail: "math@university.edu", contactPhone: "555-0102", createdDate: "2024-01-01", isActive: true },
  { id: 3, guid: "d3", departmentCode: "PHY", departmentName: "Physics", description: "Physics and Astrophysics", headOfDepartment: "Dr. Richard Feynman", contactEmail: "physics@university.edu", contactPhone: "555-0103", createdDate: "2024-01-01", isActive: true },
  { id: 4, guid: "d4", departmentCode: "BIO", departmentName: "Biology", description: "Life Sciences", headOfDepartment: "Dr. Jane Goodall", contactEmail: "bio@university.edu", contactPhone: "555-0104", createdDate: "2024-01-01", isActive: true },
  { id: 5, guid: "d5", departmentCode: "ENG", departmentName: "English", description: "English Literature and Language", headOfDepartment: "Dr. Maya Angelou", contactEmail: "eng@university.edu", contactPhone: "555-0105", createdDate: "2024-01-01", isActive: true },
];

export const students: Student[] = [
  { id: 1, guid: "s1", studentId: "STU-2024-001", firstName: "James", lastName: "Wilson", dateOfBirth: "2002-03-15", gender: "Male", email: "james.wilson@student.edu", phoneNumber: "555-1001", address: "123 Oak St", city: "Springfield", state: "IL", country: "USA", postalCode: "62701", emergencyContactName: "Sarah Wilson", emergencyContactNumber: "555-1002", enrollmentDate: "2024-08-20", enrollmentStatus: "Active", departmentId: 1, createdDate: "2024-08-20", isActive: true },
  { id: 2, guid: "s2", studentId: "STU-2024-002", firstName: "Emma", lastName: "Davis", dateOfBirth: "2001-07-22", gender: "Female", email: "emma.davis@student.edu", phoneNumber: "555-1003", address: "456 Elm Ave", city: "Portland", state: "OR", country: "USA", postalCode: "97201", emergencyContactName: "John Davis", emergencyContactNumber: "555-1004", enrollmentDate: "2024-08-20", enrollmentStatus: "Active", departmentId: 2, createdDate: "2024-08-20", isActive: true },
  { id: 3, guid: "s3", studentId: "STU-2024-003", firstName: "Liam", lastName: "Chen", dateOfBirth: "2003-01-10", gender: "Male", email: "liam.chen@student.edu", phoneNumber: "555-1005", address: "789 Pine Rd", city: "Austin", state: "TX", country: "USA", postalCode: "73301", emergencyContactName: "Wei Chen", emergencyContactNumber: "555-1006", enrollmentDate: "2024-08-21", enrollmentStatus: "Active", departmentId: 1, createdDate: "2024-08-21", isActive: true },
  { id: 4, guid: "s4", studentId: "STU-2024-004", firstName: "Sophia", lastName: "Martinez", dateOfBirth: "2002-11-05", gender: "Female", email: "sophia.martinez@student.edu", phoneNumber: "555-1007", address: "321 Maple Dr", city: "Denver", state: "CO", country: "USA", postalCode: "80201", emergencyContactName: "Carlos Martinez", emergencyContactNumber: "555-1008", enrollmentDate: "2024-08-22", enrollmentStatus: "Active", departmentId: 3, createdDate: "2024-08-22", isActive: true },
  { id: 5, guid: "s5", studentId: "STU-2024-005", firstName: "Noah", lastName: "Johnson", dateOfBirth: "2001-09-18", gender: "Male", email: "noah.johnson@student.edu", phoneNumber: "555-1009", address: "654 Cedar Ln", city: "Seattle", state: "WA", country: "USA", postalCode: "98101", emergencyContactName: "Lisa Johnson", emergencyContactNumber: "555-1010", enrollmentDate: "2024-08-23", enrollmentStatus: "Active", departmentId: 4, createdDate: "2024-08-23", isActive: true },
  { id: 6, guid: "s6", studentId: "STU-2023-006", firstName: "Olivia", lastName: "Brown", dateOfBirth: "2000-05-30", gender: "Female", email: "olivia.brown@student.edu", phoneNumber: "555-1011", address: "987 Birch St", city: "Boston", state: "MA", country: "USA", postalCode: "02101", emergencyContactName: "Mark Brown", emergencyContactNumber: "555-1012", enrollmentDate: "2023-08-20", enrollmentStatus: "Graduated", departmentId: 5, createdDate: "2023-08-20", isActive: true },
  { id: 7, guid: "s7", studentId: "STU-2024-007", firstName: "Ethan", lastName: "Kim", dateOfBirth: "2002-12-01", gender: "Male", email: "ethan.kim@student.edu", phoneNumber: "555-1013", address: "147 Walnut Ave", city: "Chicago", state: "IL", country: "USA", postalCode: "60601", emergencyContactName: "Min Kim", emergencyContactNumber: "555-1014", enrollmentDate: "2024-08-24", enrollmentStatus: "Active", departmentId: 1, createdDate: "2024-08-24", isActive: true },
  { id: 8, guid: "s8", studentId: "STU-2024-008", firstName: "Ava", lastName: "Patel", dateOfBirth: "2003-04-14", gender: "Female", email: "ava.patel@student.edu", phoneNumber: "555-1015", address: "258 Spruce Ct", city: "San Francisco", state: "CA", country: "USA", postalCode: "94101", emergencyContactName: "Raj Patel", emergencyContactNumber: "555-1016", enrollmentDate: "2024-08-25", enrollmentStatus: "Active", departmentId: 2, createdDate: "2024-08-25", isActive: true },
];

export const faculty: Faculty[] = [
  { id: 1, guid: "f1", facultyId: "FAC-001", firstName: "Dr. Robert", lastName: "Smith", email: "r.smith@university.edu", phoneNumber: "555-2001", dateOfBirth: "1975-06-15", hireDate: "2010-08-01", designation: "Professor", qualification: "PhD Computer Science", specialization: "Machine Learning", salary: 120000, status: "Active", departmentId: 1, createdDate: "2010-08-01", isActive: true },
  { id: 2, guid: "f2", facultyId: "FAC-002", firstName: "Dr. Maria", lastName: "Garcia", email: "m.garcia@university.edu", phoneNumber: "555-2002", dateOfBirth: "1980-02-28", hireDate: "2015-01-15", designation: "Associate Professor", qualification: "PhD Mathematics", specialization: "Algebra", salary: 95000, status: "Active", departmentId: 2, createdDate: "2015-01-15", isActive: true },
  { id: 3, guid: "f3", facultyId: "FAC-003", firstName: "Dr. Thomas", lastName: "Lee", email: "t.lee@university.edu", phoneNumber: "555-2003", dateOfBirth: "1978-11-10", hireDate: "2012-09-01", designation: "Professor", qualification: "PhD Physics", specialization: "Quantum Mechanics", salary: 115000, status: "Active", departmentId: 3, createdDate: "2012-09-01", isActive: true },
  { id: 4, guid: "f4", facultyId: "FAC-004", firstName: "Dr. Sarah", lastName: "Thompson", email: "s.thompson@university.edu", phoneNumber: "555-2004", dateOfBirth: "1982-08-22", hireDate: "2018-03-01", designation: "Assistant Professor", qualification: "PhD Biology", specialization: "Genetics", salary: 85000, status: "Active", departmentId: 4, createdDate: "2018-03-01", isActive: true },
  { id: 5, guid: "f5", facultyId: "FAC-005", firstName: "Dr. David", lastName: "Anderson", email: "d.anderson@university.edu", phoneNumber: "555-2005", dateOfBirth: "1985-04-05", hireDate: "2020-08-15", designation: "Lecturer", qualification: "PhD English Literature", specialization: "Modern Literature", salary: 72000, status: "Active", departmentId: 5, createdDate: "2020-08-15", isActive: true },
];

export const courses: Course[] = [
  { id: 1, guid: "c1", courseCode: "CS101", courseName: "Intro to Programming", description: "Fundamentals of programming using Python", credits: 3, durationInHours: 45, courseLevel: "Beginner", prerequisites: "None", fee: 1500, departmentId: 1, createdDate: "2024-01-01", isActive: true },
  { id: 2, guid: "c2", courseCode: "CS201", courseName: "Data Structures", description: "Arrays, linked lists, trees, and graphs", credits: 4, durationInHours: 60, courseLevel: "Intermediate", prerequisites: "CS101", fee: 2000, departmentId: 1, createdDate: "2024-01-01", isActive: true },
  { id: 3, guid: "c3", courseCode: "MATH101", courseName: "Calculus I", description: "Limits, derivatives, and integrals", credits: 4, durationInHours: 60, courseLevel: "Beginner", prerequisites: "None", fee: 1800, departmentId: 2, createdDate: "2024-01-01", isActive: true },
  { id: 4, guid: "c4", courseCode: "PHY101", courseName: "Physics I", description: "Mechanics and thermodynamics", credits: 4, durationInHours: 60, courseLevel: "Beginner", prerequisites: "None", fee: 1800, departmentId: 3, createdDate: "2024-01-01", isActive: true },
  { id: 5, guid: "c5", courseCode: "BIO101", courseName: "Biology I", description: "Cell biology and genetics", credits: 3, durationInHours: 45, courseLevel: "Beginner", prerequisites: "None", fee: 1500, departmentId: 4, createdDate: "2024-01-01", isActive: true },
  { id: 6, guid: "c6", courseCode: "CS301", courseName: "Machine Learning", description: "Supervised and unsupervised learning", credits: 4, durationInHours: 60, courseLevel: "Advanced", prerequisites: "CS201, MATH101", fee: 2500, departmentId: 1, createdDate: "2024-01-01", isActive: true },
  { id: 7, guid: "c7", courseCode: "ENG101", courseName: "English Composition", description: "Academic writing and rhetoric", credits: 3, durationInHours: 45, courseLevel: "Beginner", prerequisites: "None", fee: 1200, departmentId: 5, createdDate: "2024-01-01", isActive: true },
];

export const enrollments: Enrollment[] = [
  { id: 1, guid: "e1", studentId: 1, courseId: 1, enrollmentDate: "2024-08-20", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-20", isActive: true },
  { id: 2, guid: "e2", studentId: 1, courseId: 3, enrollmentDate: "2024-08-20", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-20", isActive: true },
  { id: 3, guid: "e3", studentId: 2, courseId: 3, enrollmentDate: "2024-08-20", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-20", isActive: true },
  { id: 4, guid: "e4", studentId: 3, courseId: 1, enrollmentDate: "2024-08-21", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-21", isActive: true },
  { id: 5, guid: "e5", studentId: 3, courseId: 2, enrollmentDate: "2024-08-21", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-21", isActive: true },
  { id: 6, guid: "e6", studentId: 4, courseId: 4, enrollmentDate: "2024-08-22", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-22", isActive: true },
  { id: 7, guid: "e7", studentId: 5, courseId: 5, enrollmentDate: "2024-08-23", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-23", isActive: true },
  { id: 8, guid: "e8", studentId: 6, courseId: 7, enrollmentDate: "2023-08-20", enrollmentStatus: "Completed", semester: "Fall", academicYear: 2023, createdDate: "2023-08-20", isActive: true },
  { id: 9, guid: "e9", studentId: 7, courseId: 1, enrollmentDate: "2024-08-24", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-24", isActive: true },
  { id: 10, guid: "e10", studentId: 7, courseId: 6, enrollmentDate: "2024-08-24", enrollmentStatus: "Waitlisted", semester: "Fall", academicYear: 2024, createdDate: "2024-08-24", isActive: true },
  { id: 11, guid: "e11", studentId: 8, courseId: 3, enrollmentDate: "2024-08-25", enrollmentStatus: "Enrolled", semester: "Fall", academicYear: 2024, createdDate: "2024-08-25", isActive: true },
];

export const payments: Payment[] = [
  { id: 1, guid: "p1", paymentId: "PAY-001", studentId: 1, amount: 3300, paymentDate: "2024-08-15", paymentMethod: "Credit Card", paymentType: "Tuition", referenceNumber: "REF-001", status: "Completed", semester: "Fall", academicYear: 2024, description: "Fall 2024 tuition", createdDate: "2024-08-15", isActive: true },
  { id: 2, guid: "p2", paymentId: "PAY-002", studentId: 2, amount: 1800, paymentDate: "2024-08-16", paymentMethod: "Bank Transfer", paymentType: "Tuition", referenceNumber: "REF-002", status: "Completed", semester: "Fall", academicYear: 2024, description: "Fall 2024 tuition", createdDate: "2024-08-16", isActive: true },
  { id: 3, guid: "p3", paymentId: "PAY-003", studentId: 3, amount: 3500, paymentDate: "2024-08-17", paymentMethod: "Credit Card", paymentType: "Tuition", referenceNumber: "REF-003", status: "Pending", semester: "Fall", academicYear: 2024, description: "Fall 2024 tuition", createdDate: "2024-08-17", isActive: true },
  { id: 4, guid: "p4", paymentId: "PAY-004", studentId: 4, amount: 1800, paymentDate: "2024-08-18", paymentMethod: "Online", paymentType: "Tuition", referenceNumber: "REF-004", status: "Completed", semester: "Fall", academicYear: 2024, description: "Fall 2024 tuition", createdDate: "2024-08-18", isActive: true },
  { id: 5, guid: "p5", paymentId: "PAY-005", studentId: 5, amount: 1500, paymentDate: "2024-08-19", paymentMethod: "Cash", paymentType: "Tuition", referenceNumber: "REF-005", status: "Completed", semester: "Fall", academicYear: 2024, description: "Fall 2024 tuition", createdDate: "2024-08-19", isActive: true },
];

export const grades: Grade[] = [
  { id: 1, guid: "g1", studentId: 6, courseId: 7, semester: "Fall", academicYear: 2023, marksObtained: 88, totalMarks: 100, gradeLetter: "A", gradePoint: 4.0, remarks: "Excellent", gradeDate: "2023-12-15", createdDate: "2023-12-15", isActive: true },
  { id: 2, guid: "g2", studentId: 1, courseId: 1, semester: "Fall", academicYear: 2024, marksObtained: 92, totalMarks: 100, gradeLetter: "A+", gradePoint: 4.0, remarks: "Outstanding", gradeDate: "2024-12-15", createdDate: "2024-12-15", isActive: true },
  { id: 3, guid: "g3", studentId: 2, courseId: 3, semester: "Fall", academicYear: 2024, marksObtained: 78, totalMarks: 100, gradeLetter: "B+", gradePoint: 3.3, remarks: "Good", gradeDate: "2024-12-15", createdDate: "2024-12-15", isActive: true },
];

export const announcements: Announcement[] = [
  { id: 1, guid: "a1", title: "Fall 2024 Registration Open", content: "Online registration for Fall 2024 semester is now open. Please complete your enrollment by August 15.", announcementType: "Academic", publishDate: "2024-07-01", expiryDate: "2024-08-15", targetAudience: "Students", author: "Academic Office", createdDate: "2024-07-01", isActive: true },
  { id: 2, guid: "a2", title: "Campus Maintenance Notice", content: "The main library will be closed for renovation from July 20-25. Digital resources remain accessible online.", announcementType: "General", publishDate: "2024-07-15", expiryDate: "2024-07-25", targetAudience: "All", author: "Facilities", createdDate: "2024-07-15", isActive: true },
  { id: 3, guid: "a3", title: "Annual Science Fair", content: "Submit your project proposals for the Annual Science Fair by September 30. Open to all departments.", announcementType: "Event", publishDate: "2024-08-01", targetAudience: "Students", author: "Science Committee", createdDate: "2024-08-01", isActive: true },
  { id: 4, guid: "a4", title: "New Scholarship Program", content: "Applications are open for the Merit Excellence Scholarship. GPA requirement: 3.5+. Apply online.", announcementType: "Academic", publishDate: "2024-08-10", targetAudience: "Students", author: "Financial Aid", createdDate: "2024-08-10", isActive: true },
];

// Dashboard statistics
export const dashboardStats = {
  totalStudents: students.length,
  activeStudents: students.filter(s => s.enrollmentStatus === "Active").length,
  totalFaculty: faculty.length,
  totalCourses: courses.length,
  activeCourses: courses.filter(c => c.isActive).length,
  totalEnrollments: enrollments.filter(e => e.enrollmentStatus === "Enrolled").length,
  totalRevenue: payments.filter(p => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0),
  pendingPayments: payments.filter(p => p.status === "Pending").length,
  departments: departments.length,
};

export const enrollmentTrends = [
  { month: "Jan", enrollments: 12 },
  { month: "Feb", enrollments: 18 },
  { month: "Mar", enrollments: 15 },
  { month: "Apr", enrollments: 22 },
  { month: "May", enrollments: 8 },
  { month: "Jun", enrollments: 5 },
  { month: "Jul", enrollments: 28 },
  { month: "Aug", enrollments: 45 },
  { month: "Sep", enrollments: 38 },
  { month: "Oct", enrollments: 12 },
  { month: "Nov", enrollments: 8 },
  { month: "Dec", enrollments: 3 },
];




// Add to mockData.ts
export const staff = [
  { 
    id: 1, 
    guid: "st1", 
    staffId: "STF-001", 
    firstName: "John", 
    lastName: "Smith", 
    email: "john.smith@university.edu", 
    phoneNumber: "555-0101", 
    dateOfBirth: "1985-05-15", 
    hireDate: "2020-01-15", 
    position: "Administrative Assistant", 
    department: "Computer Science", 
    employmentType: "Full-time", 
    salary: 45000, 
    status: "Active", 
    supervisor: "Dr. Alan Turing", 
    officeLocation: "Building A, Room 101", 
    qualifications: "Bachelor's Degree in Business Administration", 
    emergencyContactName: "Sarah Smith", 
    emergencyContactNumber: "555-0102", 
    address: "123 Main St", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62701", 
    createdDate: "2020-01-15", 
    isActive: true 
  },
  { 
    id: 2, 
    guid: "st2", 
    staffId: "STF-002", 
    firstName: "Mary", 
    lastName: "Johnson", 
    email: "mary.johnson@university.edu", 
    phoneNumber: "555-0103", 
    dateOfBirth: "1990-08-22", 
    hireDate: "2021-06-01", 
    position: "Student Services Coordinator", 
    department: "Student Affairs", 
    employmentType: "Full-time", 
    salary: 52000, 
    status: "Active", 
    supervisor: "Dr. Jane Wilson", 
    officeLocation: "Student Center, Room 205", 
    qualifications: "Master's in Counseling", 
    emergencyContactName: "Robert Johnson", 
    emergencyContactNumber: "555-0104", 
    address: "456 Oak Ave", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62702", 
    createdDate: "2021-06-01", 
    isActive: true 
  },
  { 
    id: 3, 
    guid: "st3", 
    staffId: "STF-003", 
    firstName: "Robert", 
    lastName: "Williams", 
    email: "robert.williams@university.edu", 
    phoneNumber: "555-0105", 
    dateOfBirth: "1978-11-10", 
    hireDate: "2019-03-20", 
    position: "IT Support Specialist", 
    department: "Information Technology", 
    employmentType: "Full-time", 
    salary: 58000, 
    status: "Active", 
    supervisor: "CIO Office", 
    officeLocation: "Tech Center, Room 301", 
    qualifications: "Bachelor's in IT, CompTIA Certified", 
    emergencyContactName: "Lisa Williams", 
    emergencyContactNumber: "555-0106", 
    address: "789 Pine St", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62703", 
    createdDate: "2019-03-20", 
    isActive: true 
  }
];

export const departmentDistribution = departments.map(d => ({
  name: d.departmentName,
  students: students.filter(s => s.departmentId === d.id).length,
  courses: courses.filter(c => c.departmentId === d.id).length,
}));
