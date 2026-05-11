import api from "./api";

export interface AnnouncementDto {
  id: number; guid: string; title: string; content: string;
  announcementType: string; publishDate: string; expiryDate?: string;
  targetAudience: string; departmentId?: number; departmentName?: string;
  author: string; createdDate: string; isActive: boolean;
}

export interface CreateAnnouncementDto {
  title: string; content: string; announcementType: string;
  publishDate?: string; expiryDate?: string; targetAudience: string;
  departmentId?: number; author: string;
}

export interface UpdateAnnouncementDto {
  title?: string; content?: string; announcementType?: string;
  expiryDate?: string; isActive?: boolean;
}

export const announcementService = {
  getAll: () => api.get<AnnouncementDto[]>("/announcements").then(r => r.data),
  getById: (id: number) => api.get<AnnouncementDto>(`/announcements/${id}`).then(r => r.data),
  create: (data: CreateAnnouncementDto) => api.post<AnnouncementDto>("/announcements", data).then(r => r.data),
  update: (id: number, data: UpdateAnnouncementDto) => api.put<AnnouncementDto>(`/announcements/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/announcements/${id}`),
};
