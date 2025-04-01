import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    // Updated query using last_modified instead of updated_at
    const result = await pool.query(
      `SELECT MAX(last_modified) AS last_update, COUNT(*) AS count FROM tires;`
    );
    const { last_update, count } = result.rows[0];
    return NextResponse.json({ lastUpdate: last_update, count });
  } catch (error) {
    console.error('Error querying last updated:', error);
    return NextResponse.json({ lastUpdate: null, count: 0 }, { status: 500 });
  }
}

export {}; // ensures this file is treated as a module
