import Cookies from "js-cookie";
import { getApiBaseUrl } from "./api-base-url";

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

export async function getAccessToken(): Promise<string | null> {
  const token = Cookies.get("auth_token");
  return token ?? null;
}

export async function refreshSession(): Promise<string | null> {
  const refreshToken = Cookies.get("refresh_token") ?? "";
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "text/plain" },
    body: refreshToken,
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as unknown;
  const accessToken = readToken(data, ["accessToken", "token", "auth_token"]);
  const nextRefreshToken = readToken(data, ["refreshToken", "refresh_token"]);

  if (accessToken) {
    Cookies.set("auth_token", accessToken);
  }
  if (nextRefreshToken) {
    Cookies.set("refresh_token", nextRefreshToken);
  }

  return accessToken;
}
