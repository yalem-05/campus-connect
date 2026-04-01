// TypeScript interfaces mapped from C# domain models

export type UserRole = "Admin" | "Student" | "Faculty" | "Staff";

export interface BaseEntity {
  id: number;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
}

export interface Student extends BaseEntity {
  guid: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  enrollmentDate: string;
  enrollmentStatus: "Active" | "Inactive" | "Graduated" | "Suspended" | "Withdrawn";
  departmentId?: number;
  department?: Department;
  enrollments?: Enrollment[];
  attendances?: Attendance[];
  grades?: Grade[];
  documents?: StudentDocument[];
  payments?: Payment[];
}

export interface StudentDocument extends BaseEntity {
  guid: string;
  studentId: number;
  documentType: string;
  documentName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  remarks: string;
  student?: Student;
}

export interface User extends BaseEntity {
  guid: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  password:string;
  isEmailVerified: boolean;
  lastLoginDate?: string;
  studentId?: number;
  facultyId?: number;
  student?: Student;
  faculty?: Faculty;
}

export interface Payment extends BaseEntity {
  guid: string;
  paymentId: string;
  studentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentType: "Tuition" | "Library" | "Lab" | "Hostel" | "Other";
  referenceNumber: string;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  semester: string;
  academicYear: number;
  description: string;
  student?: Student;
}

export interface Grade extends BaseEntity {
  guid: string;
  studentId: number;
  courseId: number;
  semester: string;
  academicYear: number;
  marksObtained: number;
  totalMarks: number;
  gradeLetter: string;
  gradePoint: number;
  remarks: string;
  gradeDate: string;
  student?: Student;
  course?: Course;
}

export interface Faculty extends BaseEntity {
  guid: string;
  facultyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  hireDate: string;
  designation: "Professor" | "Associate Professor" | "Assistant Professor" | "Lecturer";
  qualification: string;
  specialization: string;
  salary: number;
  status: "Active" | "On Leave" | "Retired" | "Terminated";
  departmentId?: number;
  department?: Department;
  courseSchedules?: CourseSchedule[];
}

export interface Enrollment extends BaseEntity {
  guid: string;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  enrollmentStatus: "Enrolled" | "Completed" | "Dropped" | "Waitlisted";
  semester: string;
  academicYear: number;
  student?: Student;
  course?: Course;
}

export interface Department extends BaseEntity {
  guid: string;
  departmentCode: string;
  departmentName: string;
  description: string;
  headOfDepartment: string;
  contactEmail: string;
  contactPhone: string;
  students?: Student[];
  courses?: Course[];
  facultyMembers?: Faculty[];
}

export interface CourseSchedule extends BaseEntity {
  guid: string;
  courseId: number;
  facultyId: number;
  classroom: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  scheduleType: "Lecture" | "Lab" | "Tutorial" | "Seminar";
  course?: Course;
  faculty?: Faculty;
  attendances?: Attendance[];
}

export interface Course extends BaseEntity {
  guid: string;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  durationInHours: number;
  courseLevel: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string;
  fee: number;
  departmentId: number;
  department?: Department;
  enrollments?: Enrollment[];
  schedules?: CourseSchedule[];
  grades?: Grade[];
}

export interface Attendance extends BaseEntity {
  guid: string;
  studentId: number;
  courseScheduleId: number;
  attendanceDate: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks: string;
  student?: Student;
  courseSchedule?: CourseSchedule;
}

export interface Announcement extends BaseEntity {
  guid: string;
  title: string;
  content: string;
  announcementType: "General" | "Academic" | "Event" | "Emergency";
  publishDate: string;
  expiryDate?: string;
  targetAudience: "All" | "Students" | "Faculty" | "Staff";
  departmentId?: number;
  author: string;
  department?: Department;
}
