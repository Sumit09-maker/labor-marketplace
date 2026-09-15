import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { skillLabel } from "@/lib/constants";
import { maskAadhaar } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ role: null });

  if (session.role === "admin") {
    return NextResponse.json({ role: "admin" });
  }

  const w = session.worker;
  return NextResponse.json({
    role: "worker",
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
  });
}
