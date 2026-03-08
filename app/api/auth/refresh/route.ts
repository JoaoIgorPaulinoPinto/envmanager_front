import { NextResponse } from "next/server";
import { refreshAuthTokens, setAuthCookies } from "../../_lib/backend";

export async function POST(request: Request) {
  const payload = (await request.json()) as { refreshToken?: string };
  const refreshToken = (payload.refreshToken ?? "").trim();

  if (!refreshToken) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const tokens = await refreshAuthTokens(refreshToken);

  if (!tokens) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json(tokens, { status: 200 });
  setAuthCookies(response, tokens);
  return response;
}
