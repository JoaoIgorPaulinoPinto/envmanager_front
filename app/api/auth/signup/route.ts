import { NextResponse } from "next/server";
import { fetchBackend } from "../../_lib/backend";

type SignupPayload = {
  user_name: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SignupPayload;

  const backendResponse = await fetchBackend("/user", {
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

  return NextResponse.json(data, { status: backendResponse.status });
}
