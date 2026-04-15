import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { hash, verify } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === "theme") {
    const { theme } = body;
    if (!["auto", "light", "dark"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }
    await query("UPDATE users SET theme = $1 WHERE id = $2", [theme, userId]);
    return NextResponse.json({ ok: true });
  }

  if (action === "password") {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    const result = await query<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId]
    );
    const ok = await verify(currentPassword, result.rows[0].password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }
    const newHash = await hash(newPassword);
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newHash,
      userId,
    ]);
    return NextResponse.json({ ok: true });
  }

  if (action === "secret") {
    const { currentPassword, secretQuestion, secretAnswer } = body;
    if (!currentPassword || !secretQuestion || !secretAnswer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = await query<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId]
    );
    const ok = await verify(currentPassword, result.rows[0].password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }
    const answerHash = await hash(secretAnswer.toLowerCase().trim());
    await query(
      "UPDATE users SET secret_question = $1, secret_answer_hash = $2 WHERE id = $3",
      [secretQuestion, answerHash, userId]
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
