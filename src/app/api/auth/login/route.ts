import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verify, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await query<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const user = result.rows[0];
  const ok = await verify(password, user.password_hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
  await query("INSERT INTO login_events (user_id) VALUES ($1)", [user.id]);
  await setSession(user.id);
  return NextResponse.json({ ok: true });
}
