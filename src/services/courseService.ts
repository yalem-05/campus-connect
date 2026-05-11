import api from "./api";

export interface CourseDto {
  id: number; guid: string; courseCode: string; courseName: string;
  description?: string; credits: number; durationInHours: number;
  courseLevel: string; prerequisites?: string; fee: number;
  departmentId: number; departmentName?: string; createdDate: string; isActive: boolean;
}

export interface CreateCourseDto {
  courseCode: string; courseName: string; description?: string; credits: number;
  durationInHours: number; courseLevel: string; prerequisites?: string;
  fee: number; departmentId: number;
}

export interface UpdateCourseDto {
  description?: string; credits?: number; fee?: number;
  courseLevel?: string; prerequisites?: string; isActive?: boolean;
}

export const courseService = {
  getAll: () => api.get<CourseDto[]>("/courses").then(r => r.data),
  getById: (id: number) => api.get<CourseDto>(`/courses/${id}`).then(r => r.data),
  create: (data: CreateCourseDto) => api.post<CourseDto>("/courses", data).then(r => r.data),
  update: (id: number, data: UpdateCourseDto) => api.put<CourseDto>(`/courses/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};
