import { NextRequest, NextResponse } from "next/server";
import { adminCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { username?: string; password?: string };
    const username = (body.username ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Please enter both username and password." },
        { status: 400 },
      );
    }

    const creds = adminCredentials();
    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json(
        { ok: false, message: "Incorrect admin credentials. Please try again." },
        { status: 401 },
      );
    }

    await createSession("admin");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin login error", err);
    return NextResponse.json({ ok: false, message: "Login failed." }, { status: 500 });
  }
}
