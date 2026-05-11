import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, LoginDto, RegisterDto, UserDto } from "@/services/authService";

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  updateUser: (user: UserDto) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (authToken: string) => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    } else if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password } as LoginDto);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (registerData: RegisterDto) => {
    await authService.register(registerData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: UserDto) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
