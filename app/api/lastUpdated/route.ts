import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    // Query to get maximum last_modified and tire count
    const result = await pool.query(
      `SELECT MAX(last_modified) AS last_update, COUNT(*) AS count FROM tires;`
    );
    const { last_update, count } = result.rows[0];
    
    // Add cache control headers to prevent caching
    return NextResponse.json(
      { lastUpdate: last_update, count },
      { 
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      }
    );
  } catch (error) {
    console.error('Error querying last updated:', error);
    return NextResponse.json(
      { lastUpdate: null, count: 0 },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}

export {}; // ensures this file is treated as a module
