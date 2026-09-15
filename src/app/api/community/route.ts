import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { skillLabel } from "@/lib/constants";

export async function GET() {
  try {
    const posts = await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt))
      .limit(100);
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    console.error("community list error", err);
    return NextResponse.json({ ok: false, message: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      skill?: string;
      city?: string;
      content?: string;
    };

    const session = await getSession();
    const loggedWorker = session?.role === "worker" ? session.worker : null;

    const name = loggedWorker?.name ?? (body.name ?? "").trim();
    const skill = loggedWorker ? skillLabel(loggedWorker.skill) : (body.skill ?? "").trim();
    const city = loggedWorker?.city ?? (body.city ?? "").trim();
    const content = (body.content ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, message: "Please enter your name." },
        { status: 400 },
      );
    }
    if (!content || content.length < 4) {
      return NextResponse.json(
        { ok: false, message: "Post likhna zaroori hai." },
        { status: 400 },
      );
    }
    if (content.length > 500) {
      return NextResponse.json(
        { ok: false, message: "Post 500 characters se lamba nahi ho sakta." },
        { status: 400 },
      );
    }

    const [post] = await db
      .insert(communityPosts)
      .values({ name, skill: skill || null, city: city || null, content })
      .returning();

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("community post error", err);
    return NextResponse.json({ ok: false, message: "Action failed" }, { status: 500 });
  }
}
