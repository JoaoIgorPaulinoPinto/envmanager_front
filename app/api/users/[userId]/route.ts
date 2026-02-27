import { NextResponse } from "next/server";
import {
  fetchWithAuthRetry,
  readAuthTokens,
  setAuthCookies,
} from "../../_lib/backend";

type Params = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { userId } = await params;
  const tokens = await readAuthTokens();
  const { response: backendResponse, refreshedTokens } =
    await fetchWithAuthRetry(`/user/${userId}`, { method: "GET" }, tokens);

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
