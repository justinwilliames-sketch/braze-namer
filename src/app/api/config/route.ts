import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { config } = await req.json();
  if (!Array.isArray(config)) {
    return NextResponse.json({ error: "Invalid config" }, { status: 400 });
  }

  await query("UPDATE users SET config = $1 WHERE id = $2", [
    JSON.stringify(config),
    userId,
  ]);

  return NextResponse.json({ ok: true });
}
