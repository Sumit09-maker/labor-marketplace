import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { skillLabel } from "@/lib/constants";
import { distanceKm } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const skill = (searchParams.get("skill") ?? "").trim();
    const availableOnly = searchParams.get("available") === "1";
    const nearLat = searchParams.get("lat");
    const nearLng = searchParams.get("lng");
    const all = searchParams.get("all") === "1"; // admin usage

    const conditions = [];
    if (!all) conditions.push(eq(workers.status, "approved"));
    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(workers.name, pattern),
          ilike(workers.phone, pattern),
          ilike(workers.registrationId, pattern),
          ilike(workers.city, pattern),
          ilike(workers.area, pattern),
          ilike(workers.skill, pattern),
        ),
      );
    }
    if (skill) conditions.push(eq(workers.skill, skill));
    if (availableOnly) conditions.push(eq(workers.available, true));

    const rows = await db
      .select()
      .from(workers)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(workers.ratingAvg), desc(workers.createdAt))
      .limit(200);

    const origin =
      nearLat && nearLng
        ? { lat: parseFloat(nearLat), lng: parseFloat(nearLng) }
        : null;

    const list = rows.map((w) => {
      const { passwordHash: _ph, aadhaar: _aa, ...safe } = w;
      return {
        ...safe,
        skillLabel: skillLabel(w.skill),
        distanceKm: origin
          ? Math.round(distanceKm(origin, { lat: w.lat, lng: w.lng }) * 10) / 10
          : null,
      };
    });

    if (origin) {
      list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    return NextResponse.json({ ok: true, workers: list });
  } catch (err) {
    console.error("workers list error", err);
    return NextResponse.json({ ok: false, message: "Failed to load data" }, { status: 500 });
  }
}
