import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hireRequests, workers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const workerId = Number(id);
    const body = (await req.json()) as {
      employerName?: string;
      employerPhone?: string;
      message?: string;
    };

    const employerName = (body.employerName ?? "").trim();
    const employerPhone = (body.employerPhone ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!employerName || employerName.length < 2) {
      return NextResponse.json(
        { ok: false, message: "Please enter your name." },
        { status: 400 },
      );
    }
    if (!/^\d{10}$/.test(employerPhone)) {
      return NextResponse.json(
        { ok: false, message: "Enter a valid 10-digit phone number." },
        { status: 400 },
      );
    }

    const [worker] = await db
      .select({ id: workers.id, status: workers.status })
      .from(workers)
      .where(eq(workers.id, workerId))
      .limit(1);
    if (!worker || worker.status !== "approved") {
      return NextResponse.json({ ok: false, message: "Worker not found." }, { status: 404 });
    }

    await db.insert(hireRequests).values({
      workerId,
      employerName,
      employerPhone,
      message: message || null,
    });
    await db
      .update(workers)
      .set({ jobsCompleted: sql`${workers.jobsCompleted} + 1` })
      .where(eq(workers.id, workerId));

    return NextResponse.json({
      ok: true,
      message: "Request sent! Worker will contact you directly.",
    });
  } catch (err) {
    console.error("hire error", err);
    return NextResponse.json({ ok: false, message: "Action failed" }, { status: 500 });
  }
}
