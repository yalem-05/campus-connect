import api from "./api";

export interface StudentDocumentDto {
  id: number; guid: string; studentId: number; studentName?: string;
  documentType?: string; documentName: string; filePath: string;
  fileType?: string; fileSize: number; uploadDate: string;
  remarks?: string; createdDate: string; isActive: boolean;
}

export interface CreateStudentDocumentDto {
  studentId: number; documentType?: string; documentName: string;
  filePath: string; fileType?: string; fileSize: number; remarks?: string;
}

export interface UpdateStudentDocumentDto {
  documentName?: string; remarks?: string; isActive?: boolean;
}

export const studentDocumentService = {
  getAll: () => api.get<StudentDocumentDto[]>("/studentdocuments").then(r => r.data),
  getById: (id: number) => api.get<StudentDocumentDto>(`/studentdocuments/${id}`).then(r => r.data),
  create: (data: CreateStudentDocumentDto) => api.post<StudentDocumentDto>("/studentdocuments", data).then(r => r.data),
  update: (id: number, data: UpdateStudentDocumentDto) => api.put<StudentDocumentDto>(`/studentdocuments/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/studentdocuments/${id}`),
  getByStudent: (studentId: number) => api.get<StudentDocumentDto[]>(`/studentdocuments/student/${studentId}`).then(r => r.data),
};
