import api from "./api";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserDto {
  id: number;
  guid: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  lastLoginDate?: string;
  studentId?: number;
  facultyId?: number;
  createdDate: string;
  isActive: boolean;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

export const authService = {
  login: async (data: LoginDto) => {
    const res = await api.post<LoginResponseDto>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterDto) => {
    const res = await api.post<UserDto>("/auth/register", data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get<UserDto>("/auth/profile");
    return res.data;
  },
};
