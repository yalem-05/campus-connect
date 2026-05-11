import api from "./api";

export interface CourseScheduleDto {
  id: number; guid: string; courseId: number; courseName?: string; courseCode?: string;
  facultyId: number; facultyName?: string; classroom?: string;
  dayOfWeek: string; startTime: string; endTime: string;
  startDate: string; endDate: string; scheduleType: string;
  createdDate: string; isActive: boolean;
}

export interface CreateCourseScheduleDto {
  courseId: number; facultyId: number; classroom?: string;
  dayOfWeek: string; startTime: string; endTime: string;
  startDate: string; endDate: string; scheduleType: string;
}

export interface UpdateCourseScheduleDto {
  classroom?: string; startTime?: string; endTime?: string; isActive?: boolean;
}

export const courseScheduleService = {
  getAll: () => api.get<CourseScheduleDto[]>("/courseschedules").then(r => r.data),
  getById: (id: number) => api.get<CourseScheduleDto>(`/courseschedules/${id}`).then(r => r.data),
  create: (data: CreateCourseScheduleDto) => api.post<CourseScheduleDto>("/courseschedules", data).then(r => r.data),
  update: (id: number, data: UpdateCourseScheduleDto) => api.put<CourseScheduleDto>(`/courseschedules/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/courseschedules/${id}`),
};
