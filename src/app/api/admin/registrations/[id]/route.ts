import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const workerId = Number(id);
    const body = (await req.json()) as { status?: string };
    const status = body.status;

    if (status !== "approved" && status !== "rejected" && status !== "pending") {
      return NextResponse.json({ ok: false, message: "Invalid status" }, { status: 400 });
    }

    const [updated] = await db
      .update(workers)
      .set({ status })
      .where(eq(workers.id, workerId))
      .returning({ id: workers.id });

    if (!updated) {
      return NextResponse.json({ ok: false, message: "Worker not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("admin patch error", err);
    return NextResponse.json({ ok: false, message: "Failed to update." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const workerId = Number(id);
    const [deleted] = await db
      .delete(workers)
      .where(eq(workers.id, workerId))
      .returning({ id: workers.id });
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Worker not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin delete error", err);
    return NextResponse.json({ ok: false, message: "Delete failed" }, { status: 500 });
  }
}
