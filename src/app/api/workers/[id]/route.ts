import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hireRequests, ratings, workers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { skillLabel } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const workerId = Number(id);
    if (!Number.isFinite(workerId)) {
      return NextResponse.json({ ok: false, message: "Worker not found." }, { status: 404 });
    }

    const [worker] = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    if (!worker || worker.status !== "approved") {
      return NextResponse.json({ ok: false, message: "Worker not found." }, { status: 404 });
    }

    const workerRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.workerId, workerId))
      .orderBy(desc(ratings.createdAt))
      .limit(50);

    const connections = await db
      .select({ id: hireRequests.id })
      .from(hireRequests)
      .where(eq(hireRequests.workerId, workerId));

    const { passwordHash: _ph, aadhaar: _aa, ...safe } = worker;
    return NextResponse.json({
      ok: true,
      worker: { ...safe, skillLabel: skillLabel(worker.skill) },
      ratings: workerRatings,
      connections: connections.length,
    });
  } catch (err) {
    console.error("worker detail error", err);
    return NextResponse.json({ ok: false, message: "Failed to load data" }, { status: 500 });
  }
}
