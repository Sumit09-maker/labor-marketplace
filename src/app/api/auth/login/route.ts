import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword } from "@/lib/auth";

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

    const [worker] = await db.select().from(workers).where(eq(workers.username, username)).limit(1);
    if (!worker) {
      return NextResponse.json(
        { ok: false, message: "Username not found. Please check or register first." },
        { status: 401 },
      );
    }

    if (!verifyPassword(password, worker.passwordHash)) {
      return NextResponse.json(
        { ok: false, message: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    await createSession("worker", worker.id);
    return NextResponse.json({ ok: true, name: worker.name, status: worker.status });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ ok: false, message: "Login failed." }, { status: 500 });
  }
}
