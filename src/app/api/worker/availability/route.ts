import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hireRequests, ratings, workers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { skillLabel } from "@/lib/constants";
import { maskAadhaar } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return NextResponse.json(
      { ok: false, message: "Session expired. Please login again." },
      { status: 401 },
    );
  }
  const w = session.worker;

  const requests = await db
    .select()
    .from(hireRequests)
    .where(eq(hireRequests.workerId, w.id))
    .orderBy(desc(hireRequests.createdAt))
    .limit(50);

  const workerRatings = await db
    .select()
    .from(ratings)
    .where(eq(ratings.workerId, w.id))
    .orderBy(desc(ratings.createdAt))
    .limit(50);

  return NextResponse.json({
    ok: true,
    worker: {
      id: w.id,
      registrationId: w.registrationId,
      name: w.name,
      phone: w.phone,
      aadhaar: maskAadhaar(w.aadhaar),
      skill: w.skill,
      skillLabel: skillLabel(w.skill),
      experience: w.experience,
      dailyRate: w.dailyRate,
      city: w.city,
      area: w.area,
      landmark: w.landmark,
      languages: w.languages,
      username: w.username,
      available: w.available,
      status: w.status,
      jobsCompleted: w.jobsCompleted,
      ratingAvg: w.ratingAvg,
      ratingCount: w.ratingCount,
      createdAt: w.createdAt,
    },
    hireRequests: requests,
    ratings: workerRatings,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return NextResponse.json(
      { ok: false, message: "Session expired. Please login again." },
      { status: 401 },
    );
  }

  try {
    const body = (await req.json()) as { available?: boolean };
    const available = body.available === true;
    await db
      .update(workers)
      .set({ available })
      .where(eq(workers.id, session.worker.id));

    return NextResponse.json({ ok: true, available, message: "Availability updated" });
  } catch (err) {
    console.error("availability error", err);
    return NextResponse.json({ ok: false, message: "Failed to update." }, { status: 500 });
  }
}
