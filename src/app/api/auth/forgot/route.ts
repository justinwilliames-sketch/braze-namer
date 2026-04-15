import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verify, hash } from "@/lib/auth";

// Step 1: look up secret question by email
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { step } = body;

  if (step === "question") {
    const { email } = body;
    const result = await query<{ secret_question: string }>(
      "SELECT secret_question FROM users WHERE email = $1",
      [email?.toLowerCase()]
    );
    if (result.rows.length === 0) {
      // Don't leak whether an email exists
      return NextResponse.json({ question: null });
    }
    return NextResponse.json({ question: result.rows[0].secret_question });
  }

  if (step === "reset") {
    const { email, answer, newPassword } = body;
    if (!email || !answer || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    const result = await query<{ id: string; secret_answer_hash: string }>(
      "SELECT id, secret_answer_hash FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Unable to reset password" },
        { status: 400 }
      );
    }
    const user = result.rows[0];
    const ok = await verify(
      answer.toLowerCase().trim(),
      user.secret_answer_hash
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Incorrect answer" },
        { status: 401 }
      );
    }
    const newHash = await hash(newPassword);
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newHash,
      user.id,
    ]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid step" }, { status: 400 });
}
