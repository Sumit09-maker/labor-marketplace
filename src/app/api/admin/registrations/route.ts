import { NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { skillLabel } from "@/lib/constants";
import { maskAadhaar } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(workers)
    .orderBy(asc(workers.status), desc(workers.createdAt))
    .limit(500);

  const list = rows.map((w) => {
    const { passwordHash: _ph, ...rest } = w;
    return { ...rest, aadhaar: maskAadhaar(w.aadhaar), skillLabel: skillLabel(w.skill) };
  });

  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    total: rows.length,
  };

  return NextResponse.json({ ok: true, registrations: list, counts });
}
