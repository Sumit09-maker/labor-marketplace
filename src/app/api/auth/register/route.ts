import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AREA_COORDS, EXPERIENCE_OPTIONS, SKILLS } from "@/lib/constants";
import { createSession, hashPassword } from "@/lib/auth";
import { generateRegistrationId } from "@/lib/utils";

type FieldErrors = Record<string, string>;

function validate(body: Record<string, unknown>): { errors: FieldErrors; valid: boolean } {
  const errors: FieldErrors = {};

  const name = String(body.name ?? "").trim();
  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters";

  const phone = String(body.phone ?? "").trim();
  if (!phone) errors.phone = "Phone is required";
  else if (!/^\d{10}$/.test(phone)) errors.phone = "Enter a valid 10-digit phone number";

  const aadhaar = String(body.aadhaar ?? "").trim();
  if (!aadhaar) errors.aadhaar = "Aadhaar is required";
  else if (!/^\d{12}$/.test(aadhaar)) errors.aadhaar = "Aadhaar must be 12 digits";

  const skill = String(body.skill ?? "");
  if (!skill) errors.skill = "Please select a skill";
  else if (!SKILLS.some((s) => s.value === skill)) errors.skill = "Please select a valid skill";

  const experience = String(body.experience ?? "");
  if (!experience) errors.experience = "Please select experience";
  else if (!EXPERIENCE_OPTIONS.includes(experience as never))
    errors.experience = "Please select experience";

  const dailyRate = Number(body.dailyRate);
  if (!body.dailyRate && body.dailyRate !== 0) errors.dailyRate = "Daily rate is required";
  else if (!Number.isFinite(dailyRate) || dailyRate < 100 || dailyRate > 10000)
    errors.dailyRate = "Enter a valid daily rate";

  const city = String(body.city ?? "").trim();
  if (!city) errors.city = "City is required";
  else if (city.length < 2) errors.city = "City must be at least 2 characters";

  const area = String(body.area ?? "").trim();
  if (!area) errors.area = "Area is required";

  const username = String(body.username ?? "").trim();
  if (!username) errors.username = "Username is required";
  else if (username.length < 4) errors.username = "Username must be at least 4 characters";
  else if (!/^[a-zA-Z0-9_]+$/.test(username))
    errors.username = "Only letters, numbers & underscore allowed";

  const password = String(body.password ?? "");
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";

  if (body.confirmPassword !== undefined && body.confirmPassword !== body.password)
    errors.confirmPassword = "Passwords do not match";

  if (body.agree !== true) errors.agree = "Please accept the terms to continue";

  return { errors, valid: Object.keys(errors).length === 0 };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { errors, valid } = validate(body);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Please fix the errors in the form.", errors },
        { status: 400 },
      );
    }

    const username = String(body.username).trim().toLowerCase();
    const phone = String(body.phone).trim();

    const [existingUsername] = await db
      .select({ id: workers.id })
      .from(workers)
      .where(eq(workers.username, username))
      .limit(1);
    if (existingUsername) {
      return NextResponse.json(
        {
          ok: false,
          message: "This username is already taken. Please choose a different one.",
          errors: { username: "This username is already taken" },
        },
        { status: 409 },
      );
    }

    const [existingPhone] = await db
      .select({ id: workers.id })
      .from(workers)
      .where(eq(workers.phone, phone))
      .limit(1);
    if (existingPhone) {
      return NextResponse.json(
        {
          ok: false,
          message: "This phone number is already registered. Please login instead.",
          errors: { phone: "Phone number already registered" },
        },
        { status: 409 },
      );
    }

    // Resolve coordinates from a known area, else fall back to Delhi centre with jitter.
    const area = String(body.area).trim();
    const known = AREA_COORDS[area];
    const jitter = () => (Math.random() - 0.5) * 0.02;
    const lat = known ? known.lat + jitter() : 28.6139 + (Math.random() - 0.5) * 0.3;
    const lng = known ? known.lng + jitter() : 77.209 + (Math.random() - 0.5) * 0.3;

    let registrationId = generateRegistrationId();
    for (let i = 0; i < 5; i++) {
      const [dup] = await db
        .select({ id: workers.id })
        .from(workers)
        .where(eq(workers.registrationId, registrationId))
        .limit(1);
      if (!dup) break;
      registrationId = generateRegistrationId();
    }

    const [worker] = await db
      .insert(workers)
      .values({
        registrationId,
        name: String(body.name).trim(),
        phone,
        aadhaar: String(body.aadhaar).trim(),
        skill: String(body.skill),
        experience: String(body.experience),
        dailyRate: Number(body.dailyRate),
        city: String(body.city).trim(),
        area,
        landmark: String(body.landmark ?? "").trim() || null,
        languages: String(body.languages ?? "").trim() || null,
        username,
        passwordHash: hashPassword(String(body.password)),
        status: "pending",
        lat,
        lng,
      })
      .returning();

    await createSession("worker", worker.id);

    return NextResponse.json({
      ok: true,
      registrationId: worker.registrationId,
      status: worker.status,
      message: "Registration Successful!",
    });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json(
      { ok: false, message: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
