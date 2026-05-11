import api from "./api";

export interface DepartmentDto {
  id: number; guid: string; departmentCode: string; departmentName: string;
  description?: string; headOfDepartment?: string; contactEmail?: string;
  contactPhone?: string; studentCount: number; courseCount: number;
  facultyCount: number; createdDate: string; isActive: boolean;
}

export interface CreateDepartmentDto {
  departmentCode: string; departmentName: string; description?: string;
  headOfDepartment?: string; contactEmail?: string; contactPhone?: string;
}

export interface UpdateDepartmentDto {
  description?: string; headOfDepartment?: string; contactEmail?: string;
  contactPhone?: string; isActive?: boolean;
}

export const departmentService = {
  getAll: () => api.get<DepartmentDto[]>("/departments").then(r => r.data),
  getById: (id: number) => api.get<DepartmentDto>(`/departments/${id}`).then(r => r.data),
  create: (data: CreateDepartmentDto) => api.post<DepartmentDto>("/departments", data).then(r => r.data),
  update: (id: number, data: UpdateDepartmentDto) => api.put<DepartmentDto>(`/departments/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};
