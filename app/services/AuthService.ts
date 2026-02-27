import api, { getApiErrorMessage } from "./api";

export interface RegisterRequest {
  user_name: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  password: string;
  email: string;
}

export type AuthResponse =
  | { message: string }
  | { auth_token: string; refresh_token: string };

export default class AuthService {
  async register(req: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/signup", req);
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", req);
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/refresh", refreshToken, {
        headers: { "Content-Type": "text/plain" },
      });
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(): Promise<{ ok: boolean }> {
    try {
      const response = await api.post("/auth/logout");
      return response.data as { ok: boolean };
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}
