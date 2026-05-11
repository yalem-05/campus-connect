import api from "./api";

export interface FacultyDto {
  id: number; guid: string; facultyId: string; firstName: string; lastName: string;
  email: string; phoneNumber?: string; dateOfBirth: string; hireDate: string;
  designation: string; qualification?: string; specialization?: string;
  salary: number; status: string; departmentId?: number; departmentName?: string;
  createdDate: string; isActive: boolean;
}

export interface CreateFacultyDto {
  facultyId: string; firstName: string; lastName: string; email: string;
  phoneNumber?: string; dateOfBirth: string; designation: string;
  qualification?: string; specialization?: string; salary: number; departmentId?: number;
}

export interface UpdateFacultyDto {
  phoneNumber?: string; designation?: string; qualification?: string;
  specialization?: string; status?: string; departmentId?: number;
}

export const facultyService = {
  getAll: () => api.get<FacultyDto[]>("/faculty").then(r => r.data),
  getById: (id: number) => api.get<FacultyDto>(`/faculty/${id}`).then(r => r.data),
  create: (data: CreateFacultyDto) => api.post<FacultyDto>("/faculty", data).then(r => r.data),
  update: (id: number, data: UpdateFacultyDto) => api.put<FacultyDto>(`/faculty/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/faculty/${id}`),
};
