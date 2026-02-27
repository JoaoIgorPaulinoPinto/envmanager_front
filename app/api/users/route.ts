import { NextResponse } from "next/server";
import {
  fetchWithAuthRetry,
  readAuthTokens,
  setAuthCookies,
} from "../_lib/backend";

export async function GET() {
  const tokens = await readAuthTokens();
  const { response: backendResponse, refreshedTokens } =
    await fetchWithAuthRetry("/user", { method: "GET" }, tokens);

  let data: unknown = [];
  try {
    data = await backendResponse.json();
  } catch {
    data = [];
  }

  const response = NextResponse.json(data, { status: backendResponse.status });
  if (refreshedTokens) {
    setAuthCookies(response, refreshedTokens);
  }
  return response;
}

