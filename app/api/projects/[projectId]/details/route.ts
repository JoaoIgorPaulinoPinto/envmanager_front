import { NextResponse } from "next/server";
import {
  fetchWithAuthRetry,
  readAuthTokens,
  setAuthCookies,
} from "../../../_lib/backend";

type DetailsPayload = {
  password: string;
};

type Params = {
  params: Promise<{ projectId: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { projectId } = await params;
  const payload = (await request.json()) as DetailsPayload;
  const tokens = await readAuthTokens();
  const { response: backendResponse, refreshedTokens } =
    await fetchWithAuthRetry(
      `/project/${projectId}/details`,
      {
        method: "POST",
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
