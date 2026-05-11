import api from "./api";

export interface StudentDto {
  id: number; guid: string; studentId: string; firstName: string; lastName: string;
  dateOfBirth: string; gender: string; email: string; phoneNumber?: string;
  address?: string; city?: string; state?: string; country?: string; postalCode?: string;
  emergencyContactName?: string; emergencyContactNumber?: string;
  enrollmentDate: string; enrollmentStatus: string; departmentId?: number;
  departmentName?: string; createdDate: string; isActive: boolean;
}

export interface CreateStudentDto {
  studentId: string; firstName: string; lastName: string; dateOfBirth: string;
  gender: string; email: string; phoneNumber?: string; address?: string; city?: string;
  state?: string; country?: string; postalCode?: string;
  emergencyContactName?: string; emergencyContactNumber?: string; departmentId?: number;
}

export interface UpdateStudentDto {
  phoneNumber?: string; address?: string; city?: string; state?: string; country?: string;
  postalCode?: string; emergencyContactName?: string; emergencyContactNumber?: string;
  enrollmentStatus?: string; departmentId?: number;
}

export const studentService = {
  getAll: () => api.get<StudentDto[]>("/students").then(r => r.data),
  getById: (id: number) => api.get<StudentDto>(`/students/${id}`).then(r => r.data),
  create: (data: CreateStudentDto) => api.post<StudentDto>("/students", data).then(r => r.data),
  update: (id: number, data: UpdateStudentDto) => api.put<StudentDto>(`/students/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/students/${id}`),
};
