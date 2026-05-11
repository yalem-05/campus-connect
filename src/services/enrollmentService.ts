import api from "./api";

export interface EnrollmentDto {
  id: number; guid: string; studentId: number; studentName?: string;
  courseId: number; courseName?: string; enrollmentDate: string;
  enrollmentStatus: string; semester: string; academicYear: number;
  createdDate: string; isActive: boolean;
}

export interface CreateEnrollmentDto {
  studentId: number; courseId: number; semester: string; academicYear: number;
}

export interface UpdateEnrollmentDto {
  enrollmentStatus?: string; isActive?: boolean;
}

export const enrollmentService = {
  getAll: () => api.get<EnrollmentDto[]>("/enrollments").then(r => r.data),
  getById: (id: number) => api.get<EnrollmentDto>(`/enrollments/${id}`).then(r => r.data),
  create: (data: CreateEnrollmentDto) => api.post<EnrollmentDto>("/enrollments", data).then(r => r.data),
  update: (id: number, data: UpdateEnrollmentDto) => api.put<EnrollmentDto>(`/enrollments/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/enrollments/${id}`),
};
