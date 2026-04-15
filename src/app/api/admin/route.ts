import { NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/lib/auth";
import { query } from "@/lib/db";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
  login_count: string;
  logins_30d: string;
}

interface SeriesRow {
  bucket: string;
  users: string;
}

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const me = await query<{ email: string }>(
    "SELECT email FROM users WHERE id = $1",
    [userId]
  );
  if (me.rows.length === 0 || !isAdminEmail(me.rows[0].email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await query<UserRow>(`
    SELECT
      u.id,
      u.email,
      u.created_at,
      u.last_login_at,
      (SELECT COUNT(*) FROM login_events e WHERE e.user_id = u.id) AS login_count,
      (SELECT COUNT(*) FROM login_events e WHERE e.user_id = u.id AND e.created_at > NOW() - INTERVAL '30 days') AS logins_30d
    FROM users u
    ORDER BY u.last_login_at DESC NULLS LAST, u.created_at DESC
  `);

  // DAU for last 30 days
  const dau = await query<SeriesRow>(`
    SELECT
      TO_CHAR(day, 'YYYY-MM-DD') AS bucket,
      COALESCE(COUNT(DISTINCT e.user_id), 0) AS users
    FROM generate_series(
      date_trunc('day', NOW()) - INTERVAL '29 days',
      date_trunc('day', NOW()),
      INTERVAL '1 day'
    ) AS day
    LEFT JOIN login_events e
      ON date_trunc('day', e.created_at) = day
    GROUP BY day
    ORDER BY day ASC
  `);

  // MAU for last 12 months: count of distinct users in a trailing 30-day window ending each month
  const mau = await query<SeriesRow>(`
    SELECT
      TO_CHAR(month, 'YYYY-MM') AS bucket,
      (
        SELECT COUNT(DISTINCT e.user_id)
        FROM login_events e
        WHERE e.created_at >= month - INTERVAL '30 days'
          AND e.created_at < month + INTERVAL '1 day'
      ) AS users
    FROM generate_series(
      date_trunc('month', NOW()) - INTERVAL '11 months',
      date_trunc('month', NOW()),
      INTERVAL '1 month'
    ) AS month
    ORDER BY month ASC
  `);

  const totalUsers = users.rows.length;
  const activeToday = dau.rows[dau.rows.length - 1]?.users ?? "0";
  const active30d = users.rows.filter(
    (u) => Number(u.logins_30d) > 0
  ).length;

  return NextResponse.json({
    summary: {
      totalUsers,
      activeToday: Number(activeToday),
      active30d,
    },
    users: users.rows.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_login_at: u.last_login_at,
      login_count: Number(u.login_count),
      logins_30d: Number(u.logins_30d),
    })),
    dau: dau.rows.map((r) => ({ bucket: r.bucket, users: Number(r.users) })),
    mau: mau.rows.map((r) => ({ bucket: r.bucket, users: Number(r.users) })),
  });
}
