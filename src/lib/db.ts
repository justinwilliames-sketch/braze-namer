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
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
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
