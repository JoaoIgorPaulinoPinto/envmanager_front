import { NextResponse } from "next/server";
import { refreshAuthTokens, setAuthCookies } from "../../_lib/backend";

export async function POST(request: Request) {
  const refreshToken = (await request.text()).replace(/"/g, "").trim();
  const tokens = await refreshAuthTokens(refreshToken);

  if (!tokens) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json(tokens, { status: 200 });
  setAuthCookies(response, tokens);
  return response;
}
