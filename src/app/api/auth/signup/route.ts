import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hash, setSession } from "@/lib/auth";
import { DEFAULT_DIMENSIONS } from "@/lib/defaults";

export async function POST(req: NextRequest) {
  const { email, password, secretQuestion, secretAnswer } = await req.json();

  if (!email || !password || !secretQuestion || !secretAnswer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = await query<{ id: string }>(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const [passwordHash, answerHash] = await Promise.all([
    hash(password),
    hash(secretAnswer.toLowerCase().trim()),
  ]);

  const result = await query<{ id: string }>(
    `INSERT INTO users (email, password_hash, secret_question, secret_answer_hash, config)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      email.toLowerCase(),
      passwordHash,
      secretQuestion,
      answerHash,
      JSON.stringify(DEFAULT_DIMENSIONS),
    ]
  );

  await setSession(result.rows[0].id);

  return NextResponse.json({ ok: true });
}
