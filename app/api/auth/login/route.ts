import { NextResponse } from "next/server";
import {
  fetchBackend,
  setAuthCookies,
  type AuthTokens,
} from "../../_lib/backend";

type LoginPayload = {
  email: string;
  password: string;
};

const tryReadTokens = (value: unknown): AuthTokens | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const accessToken =
    typeof record.accessToken === "string"
      ? record.accessToken
      : typeof record.access_token === "string"
        ? record.access_token
        : typeof record.token === "string"
          ? record.token
        : null;
  const refreshToken =
    typeof record.refreshToken === "string"
      ? record.refreshToken
      : typeof record.refresh_token === "string"
        ? record.refresh_token
        : undefined;

  if (!accessToken) {
    return null;
  }

  return { accessToken, refreshToken };
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload;

  const backendResponse = await fetchBackend("/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await backendResponse.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  const directTokens = tryReadTokens(data);
  const nestedTokens =
    tryReadTokens((data as Record<string, unknown>).data) ??
    tryReadTokens((data as Record<string, unknown>).tokens);
  const tokens = directTokens ?? nestedTokens;

  const responsePayload = tokens
    ? {
        ...data,
        accessToken: tokens.accessToken,
        ...(tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {}),
      }
    : data;
  const response = NextResponse.json(responsePayload, {
    status: backendResponse.status,
  });

  if (backendResponse.ok) {
    if (tokens) {
      setAuthCookies(response, tokens);
    }
  }

  return response;
}
