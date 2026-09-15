import { db } from "@/db";
import { hireRequests, ratings, workers } from "@/db/schema";
import { avg, count, eq, sql, sum } from "drizzle-orm";
import HomeClient, { type HomeStats } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

async function getStats(): Promise<HomeStats> {
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
    const [connectionAgg] = await db
      .select({ connections: count(hireRequests.id) })
      .from(hireRequests);
    return {
      members: memberAgg?.members ?? 0,
      jobs: Number(memberAgg?.jobs ?? 0),
      cities: Number(cityAgg?.cities ?? 0),
      avgRating: ratingAgg?.avg ? Math.round(Number(ratingAgg.avg) * 10) / 10 : 0,
      connections: connectionAgg?.connections ?? 0,
    };
  } catch {
    return { members: 0, jobs: 0, cities: 0, avgRating: 0, connections: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return <HomeClient stats={stats} />;
}
