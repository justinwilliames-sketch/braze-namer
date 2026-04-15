import { NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/lib/auth";
import { query } from "@/lib/db";
import { DimensionConfig } from "@/lib/defaults";

interface UserRow {
  id: string;
  email: string;
  config: DimensionConfig[];
  theme: string;
  secret_question: string;
}

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await query<UserRow>(
    "SELECT id, email, config, theme, secret_question FROM users WHERE id = $1",
    [userId]
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = result.rows[0];
  return NextResponse.json({
    ...user,
    is_admin: isAdminEmail(user.email),
  });
}
