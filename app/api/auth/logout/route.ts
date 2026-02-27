import { NextResponse } from "next/server";
import { clearAuthCookies } from "../../_lib/backend";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
