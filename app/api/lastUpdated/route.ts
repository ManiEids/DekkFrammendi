import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    // Assumes an "updated_at" column exists in "tires" table
    const result = await pool.query(`SELECT MAX(updated_at) AS last_update FROM tires;`);
    const lastUpdate = result.rows[0].last_update; // ISO string expected
    return NextResponse.json({ lastUpdate });
  } catch (error) {
    console.error('Error querying last updated:', error);
    return NextResponse.json({ lastUpdate: null }, { status: 500 });
  }
}

export {}; // ensures this file is treated as a module
