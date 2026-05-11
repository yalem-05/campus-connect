import api from "./api";

export interface GradeDto {
  id: number; guid: string; studentId: number; studentName?: string;
  courseId: number; courseName?: string; semester: string; academicYear: number;
  marksObtained: number; totalMarks: number; gradeLetter?: string;
  gradePoint: number; remarks?: string; gradeDate: string; createdDate: string; isActive: boolean;
}

export interface CreateGradeDto {
  studentId: number; courseId: number; semester: string; academicYear: number;
  marksObtained: number; totalMarks?: number; remarks?: string;
}

export interface UpdateGradeDto {
  marksObtained?: number; remarks?: string;
}

export const gradeService = {
  getAll: () => api.get<GradeDto[]>("/grades").then(r => r.data),
  getById: (id: number) => api.get<GradeDto>(`/grades/${id}`).then(r => r.data),
  create: (data: CreateGradeDto) => api.post<GradeDto>("/grades", data).then(r => r.data),
  update: (id: number, data: UpdateGradeDto) => api.put<GradeDto>(`/grades/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/grades/${id}`),
  getByStudent: (studentId: number) => api.get<GradeDto[]>(`/grades/student/${studentId}`).then(r => r.data),
};
