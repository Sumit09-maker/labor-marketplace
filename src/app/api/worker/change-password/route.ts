import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return NextResponse.json(
      { ok: false, message: "Session expired. Please login again." },
      { status: 401 },
    );
  }

  try {
    const body = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    const current = body.currentPassword ?? "";
    const next = body.newPassword ?? "";
    const confirm = body.confirmPassword ?? "";

    if (!current) {
      return NextResponse.json(
        { ok: false, message: "Enter current password." },
        { status: 400 },
      );
    }
    if (!verifyPassword(current, session.worker.passwordHash)) {
      return NextResponse.json(
        { ok: false, message: "Current password is incorrect." },
        { status: 400 },
      );
    }
    if (next.length < 6) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 6 characters." },
        { status: 400 },
      );
    }
    if (next !== confirm) {
      return NextResponse.json(
        { ok: false, message: "Passwords do not match." },
        { status: 400 },
      );
    }

    await db
      .update(workers)
      .set({ passwordHash: hashPassword(next) })
      .where(eq(workers.id, session.worker.id));

    return NextResponse.json({ ok: true, message: "Password changed successfully!" });
  } catch (err) {
    console.error("change password error", err);
    return NextResponse.json(
      { ok: false, message: "Failed to change password." },
      { status: 500 },
    );
  }
}
