import { NextResponse } from "next/server";
import {
  fetchWithAuthRetry,
  readAuthTokens,
  setAuthCookies,
} from "../../_lib/backend";

export async function PUT(request: Request) {
  const payload = await request.json();
  const tokens = await readAuthTokens();
  const { response: backendResponse, refreshedTokens } =
    await fetchWithAuthRetry(
      "/project/variables",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      tokens,
    );

  let data: unknown = {};
  try {
    data = await backendResponse.json();
  } catch {
    data = {};
  }

  const response = NextResponse.json(data, { status: backendResponse.status });
  if (refreshedTokens) {
    setAuthCookies(response, refreshedTokens);
  }
  return response;
}

