import { NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts, hireRequests, ratings, workers } from "@/db/schema";
import { avg, count, eq, sql, sum } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [memberAgg] = await db
      .select({ members: count(workers.id), jobs: sum(workers.jobsCompleted) })
      .from(workers)
      .where(eq(workers.status, "approved"));

    const [cityAgg] = await db
      .select({ cities: sql<number>`count(distinct lower(${workers.city}))` })
      .from(workers)
      .where(eq(workers.status, "approved"));

    const [ratingAgg] = await db.select({ avg: avg(ratings.rating) }).from(ratings);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [connectionAgg] = await db
      .select({ connections: count(hireRequests.id) })
      .from(hireRequests);

    const [postAgg] = await db
      .select({ posts: count(communityPosts.id) })
      .from(communityPosts);

    return NextResponse.json({
      ok: true,
      stats: {
        members: memberAgg?.members ?? 0,
        jobs: Number(memberAgg?.jobs ?? 0),
        cities: Number(cityAgg?.cities ?? 0),
        avgRating: ratingAgg?.avg ? Math.round(Number(ratingAgg.avg) * 10) / 10 : 0,
        connections: connectionAgg?.connections ?? 0,
        posts: postAgg?.posts ?? 0,
      },
    });
  } catch (err) {
    console.error("stats error", err);
    return NextResponse.json({ ok: false, message: "Failed to load data" }, { status: 500 });
  }
}
