import Cookies from "js-cookie";
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
  | { token?: string; accessToken?: string; refreshToken?: string; refresh_token?: string };

const readToken = (payload: unknown, keys: string[]): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  for (const key of keys) {
    if (typeof data[key] === "string" && data[key].trim().length > 0) {
      return data[key] as string;
    }
  }
  return null;
};

export default class AuthService {
  async register(req: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/user", req);
      const token = readToken(response.data, ["session_token", "accessToken", "token"]);
      const refreshToken = readToken(response.data, [
        "refresh_token",
        "refreshToken",
      ]);
      if (token) {
        Cookies.set("auth_token", token);
      }
      if (refreshToken) {
        Cookies.set("refresh_token", refreshToken);
      }
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth", req);
      const token = readToken(response.data, ["token", "accessToken", "auth_token"]);
      const refreshToken = readToken(response.data, [
        "refresh_token",
        "refreshToken",
      ]);
      if (token) {
        Cookies.set("auth_token", token);
      }
      if (refreshToken) {
        Cookies.set("refresh_token", refreshToken);
      }
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      return response.data as AuthResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(refreshToken?: string): Promise<{ ok: boolean }> {
    try {
      const payload = refreshToken ? { refreshToken } : {};
      const response = await api.post("/auth/logout", payload);
      return response.data as { ok: boolean };
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}
