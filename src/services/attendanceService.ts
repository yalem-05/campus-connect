import api from "./api";

export interface AttendanceDto {
  id: number; guid: string; studentId: number; studentName?: string;
  courseScheduleId: number; courseName?: string; attendanceDate: string;
  status: string; remarks?: string; createdDate: string; isActive: boolean;
}

export interface CreateAttendanceDto {
  studentId: number; courseScheduleId: number; attendanceDate: string;
  status: string; remarks?: string;
}

export interface BulkCreateAttendanceDto {
  courseScheduleId: number; attendanceDate: string;
  attendances: { studentId: number; status: string; remarks?: string }[];
}

export interface AttendanceSummaryDto {
  totalClasses: number; presentCount: number; absentCount: number;
  lateCount: number; excusedCount: number; attendancePercentage: number;
}

export const attendanceService = {
  getAll: () => api.get<AttendanceDto[]>("/attendance").then(r => r.data),
  getById: (id: number) => api.get<AttendanceDto>(`/attendance/${id}`).then(r => r.data),
  create: (data: CreateAttendanceDto) => api.post<AttendanceDto>("/attendance", data).then(r => r.data),
  createBulk: (data: BulkCreateAttendanceDto) => api.post("/attendance/bulk", data),
  getByStudent: (studentId: number) => api.get<AttendanceDto[]>(`/attendance/student/${studentId}`).then(r => r.data),
  getSummary: (studentId: number) => api.get<AttendanceSummaryDto>(`/attendance/student/${studentId}/summary`).then(r => r.data),
  delete: (id: number) => api.delete(`/attendance/${id}`),
};
