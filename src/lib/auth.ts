import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, workers, type Worker } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export const SESSION_COOKIE = "lc_session";
const SESSION_DAYS = 7;

/* ---------------- Password hashing (scrypt) ---------------- */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/* ---------------- Sessions ---------------- */

export async function createSession(role: "worker" | "admin", workerId?: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ token, role, workerId: workerId ?? null, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  jar.delete(SESSION_COOKIE);
}

export type SessionInfo =
  | { role: "admin"; worker: null }
  | { role: "worker"; worker: Worker }
  | null;

export async function getSession(): Promise<SessionInfo> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!session) return null;

  if (session.role === "admin") return { role: "admin", worker: null };
  if (!session.workerId) return null;

  const [worker] = await db.select().from(workers).where(eq(workers.id, session.workerId)).limit(1);
  if (!worker) return null;
  return { role: "worker", worker };
}

/* ---------------- Admin credentials ---------------- */

export function adminCredentials() {
  return {
    username: (process.env.ADMIN_USERNAME ?? "admin").toLowerCase(),
    // Default demo credential; override via env in production.
    password: process.env.ADMIN_PASSWORD ?? "chowk@admin",
  };
}
