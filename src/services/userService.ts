import api from "./api";
import { UserDto } from "./authService";

export const userService = {
  getAll: () => api.get<UserDto[]>("/users").then(r => r.data),
  getById: (id: number) => api.get<UserDto>(`/users/${id}`).then(r => r.data),
  delete: (id: number) => api.delete(`/users/${id}`),
};
