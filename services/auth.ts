import api from "@/api/axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
}

export const login = (data: LoginInput) => {
  return api.post<AuthResponse>("/auth/login", data);
};

export const register = (data: RegisterInput) => {
  return api.post<AuthResponse>("/auth/register", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const getCurrentUser = () => {
  return api.get<AuthResponse["user"]>("/auth/me");
};

export const refreshToken = () => {
  return api.post<{ accessToken: string }>("/auth/refresh");
};

export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token: string, password: string) => {
  return api.post("/auth/reset-password", { token, password });
};

export const verifyEmail = (token: string) => {
  return api.post("/auth/verify-email", { token });
};

export const resendVerificationEmail = (email: string) => {
  return api.post("/auth/resend-verification", { email });
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return api.post("/auth/change-password", data);
};
