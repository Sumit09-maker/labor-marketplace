import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ratings, workers } from "@/db/schema";
import { avg, count, eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const workerId = Number(id);
    const body = (await req.json()) as {
      employerName?: string;
      rating?: number;
      comment?: string;
    };

    const employerName = (body.employerName ?? "").trim();
    const rating = Number(body.rating);
    const comment = (body.comment ?? "").trim();

    if (!employerName || employerName.length < 2) {
      return NextResponse.json(
        { ok: false, message: "Please enter your name." },
        { status: 400 },
      );
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, message: "Please select a rating between 1 and 5." },
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

    await db.insert(ratings).values({
      workerId,
      employerName,
      rating,
      comment: comment || null,
    });

    const [agg] = await db
      .select({ avg: avg(ratings.rating), count: count(ratings.id) })
      .from(ratings)
      .where(eq(ratings.workerId, workerId));

    const ratingAvg = agg?.avg ? Math.round(Number(agg.avg) * 10) / 10 : rating;
    const ratingCount = agg?.count ?? 1;

    await db
      .update(workers)
      .set({ ratingAvg, ratingCount })
      .where(eq(workers.id, workerId));

    return NextResponse.json({ ok: true, ratingAvg, ratingCount });
  } catch (err) {
    console.error("rate error", err);
    return NextResponse.json({ ok: false, message: "Action failed" }, { status: 500 });
  }
}
