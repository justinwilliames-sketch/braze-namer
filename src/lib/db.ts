import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_URL?.includes("railway.internal") ||
      process.env.NODE_ENV !== "production"
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") global._pgPool = pool;

let initialised = false;

export async function initDb() {
  if (initialised) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      secret_question TEXT NOT NULL,
      secret_answer_hash TEXT NOT NULL,
      config JSONB DEFAULT '[]'::jsonb,
      theme TEXT DEFAULT 'auto',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    );
  `);
  // Backfill column for older databases
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_events (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS login_events_user_id_idx ON login_events(user_id);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS login_events_created_at_idx ON login_events(created_at);
  `);
  initialised = true;
}

export { pool };

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[] }> {
  await initDb();
  const result = await pool.query(text, params);
  return { rows: result.rows as T[] };
}
