import api from "./api";

export interface StaffDto {
  id: number; guid: string; staffId: string; firstName: string; lastName: string;
  email: string; phoneNumber?: string; dateOfBirth: string; hireDate: string;
  position: string; employmentType: string; salary: number; status: string;
  supervisor?: string; officeLocation?: string; qualifications?: string;
  emergencyContactName?: string; emergencyContactNumber?: string;
  address?: string; city?: string; state?: string; zipCode?: string;
  departmentId?: number; departmentName?: string;
  createdDate: string; isActive: boolean;
}

export interface CreateStaffDto {
  staffId: string; phoneNumber?: string; dateOfBirth: string;
  position: string; employmentType: string; salary: number;
  supervisor?: string; officeLocation?: string; qualifications?: string;
  emergencyContactName?: string; emergencyContactNumber?: string;
  address?: string; city?: string; state?: string; zipCode?: string;
  departmentId?: number;
}

export interface UpdateStaffDto {
  phoneNumber?: string; position?: string; employmentType?: string;
  salary?: number; status?: string; supervisor?: string;
  officeLocation?: string; qualifications?: string;
  emergencyContactName?: string; emergencyContactNumber?: string;
  address?: string; city?: string; state?: string; zipCode?: string;
  departmentId?: number;
}

export const staffService = {
  getAll: () => api.get<StaffDto[]>("/staff").then(r => r.data),
  getById: (id: number) => api.get<StaffDto>(`/staff/${id}`).then(r => r.data),
  create: (data: CreateStaffDto) => api.post<StaffDto>("/staff", data).then(r => r.data),
  update: (id: number, data: UpdateStaffDto) => api.put<StaffDto>(`/staff/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};
