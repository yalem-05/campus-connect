import api from "./api";

export interface PaymentDto {
  id: number; guid: string; paymentId: string; studentId: number; studentName?: string;
  amount: number; paymentDate: string; paymentMethod?: string; paymentType: string;
  referenceNumber?: string; status: string; semester?: string; academicYear?: number;
  description?: string; createdDate: string; isActive: boolean;
}

export interface CreatePaymentDto {
  studentId: number; amount: number; paymentMethod?: string; paymentType: string;
  referenceNumber?: string; semester?: string; academicYear?: number; description?: string;
}

export interface UpdatePaymentDto {
  status?: string; paymentMethod?: string;
}

export interface PaymentSummaryDto {
  totalPaid: number; totalPending: number; completedCount: number;
  pendingCount: number; overdueCount: number;
}

export const paymentService = {
  getAll: () => api.get<PaymentDto[]>("/payments").then(r => r.data),
  getById: (id: number) => api.get<PaymentDto>(`/payments/${id}`).then(r => r.data),
  create: (data: CreatePaymentDto) => api.post<PaymentDto>("/payments", data).then(r => r.data),
  update: (id: number, data: UpdatePaymentDto) => api.put<PaymentDto>(`/payments/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/payments/${id}`),
  getByStudent: (studentId: number) => api.get<PaymentDto[]>(`/payments/student/${studentId}`).then(r => r.data),
  getSummary: (studentId: number) => api.get<PaymentSummaryDto>(`/payments/student/${studentId}/summary`).then(r => r.data),
};
