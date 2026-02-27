import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:5115";

const cookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
};

export async function readAuthTokens(): Promise<AuthTokens | null> {
  const store = await cookies();
  const accessToken = store.get("env_access")?.value ?? "";
  const refreshToken = store.get("env_refresh")?.value ?? "";

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken: refreshToken || undefined,
  };
}

export function setAuthCookies(response: NextResponse, tokens: AuthTokens) {
  response.cookies.set("env_access", tokens.accessToken, cookieOptions);
  if (tokens.refreshToken) {
    response.cookies.set("env_refresh", tokens.refreshToken, cookieOptions);
  } else {
    response.cookies.set("env_refresh", "", { ...cookieOptions, maxAge: 0 });
  }
  response.cookies.set("env_auth", "1", cookieOptions);
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("env_access", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("env_refresh", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("env_auth", "", { ...cookieOptions, maxAge: 0 });
}

export async function refreshAuthTokens(
  refreshToken: string,
): Promise<AuthTokens | null> {
  const response = await fetchBackend("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refreshToken),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Record<string, unknown>;
  if (
    typeof data.accessToken !== "string" ||
    typeof data.refreshToken !== "string"
  ) {
    return null;
  }

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function fetchBackend(path: string, init: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
  });
}

export async function fetchWithAuth(
  path: string,
  init: RequestInit,
  tokens: AuthTokens | null,
) {
  const headers = new Headers(init.headers ?? {});
  if (tokens?.accessToken) {
    headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }

  return fetchBackend(path, { ...init, headers });
}

export async function fetchWithAuthRetry(
  path: string,
  init: RequestInit,
  tokens: AuthTokens | null,
) {
  const firstResponse = await fetchWithAuth(path, init, tokens);

  if (firstResponse.status !== 401 || !tokens?.refreshToken) {
    return { response: firstResponse, refreshedTokens: null };
  }

  const refreshedTokens = await refreshAuthTokens(tokens.refreshToken);
  if (!refreshedTokens) {
    return { response: firstResponse, refreshedTokens: null };
  }

  const retryResponse = await fetchWithAuth(path, init, refreshedTokens);
  return { response: retryResponse, refreshedTokens };
}
