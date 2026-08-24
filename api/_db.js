import { neon } from '@neondatabase/serverless'

// HTTP-based driver: no persistent connection to manage between requests,
// which is what makes it safe to use from serverless functions.
const sql = neon(process.env.DATABASE_URL)

// Serverless functions are stateless between cold starts, but a warm
// function instance can reuse this flag and skip the CREATE TABLE round
// trip on every request.
let initialized = false

export async function ensureTables() {
  if (initialized) return
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  initialized = true
}

export { sql }
