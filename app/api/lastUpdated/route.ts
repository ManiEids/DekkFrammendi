import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    // Get first non-null timestamp instead of MAX
    const result = await pool.query(
      `SELECT last_modified AS last_update, COUNT(*) AS count 
       FROM tires 
       WHERE last_modified IS NOT NULL 
       ORDER BY id ASC 
       LIMIT 1;`
    );
    
    // If no rows with timestamp found, try getting just the count
    if (!result.rows.length || !result.rows[0].last_update) {
      const countResult = await pool.query(`SELECT COUNT(*) AS count FROM tires;`);
      const count = countResult.rows[0].count;
      
      // If we have tires but no timestamp, use current date as fallback
      if (count > 0) {
        const now = new Date().toISOString();
        console.log(`No timestamp found, but ${count} tires exist. Using current time as fallback.`);
        return NextResponse.json(
          { lastUpdate: now, count },
          { 
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0'
            } 
          }
        );
      } else {
        // No tires found at all
        return NextResponse.json(
          { lastUpdate: null, count: 0 },
          { 
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0'
            } 
          }
        );
      }
    }
    
    // Normal case - we found a timestamp
    const { last_update, count } = result.rows[0];
    console.log(`Found last_update: ${last_update}, count: ${count}`);
    
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
