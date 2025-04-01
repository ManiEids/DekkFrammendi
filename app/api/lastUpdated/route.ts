import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    // First try to get any non-null last_modified value
    const result = await pool.query(
      `SELECT last_modified AS last_update, COUNT(*) AS count 
       FROM tires 
       GROUP BY last_modified
       HAVING last_modified IS NOT NULL 
       ORDER BY last_modified DESC
       LIMIT 1;`
    );
    
    if (result.rows.length > 0 && result.rows[0].last_update) {
      console.log(`Found last_update: ${result.rows[0].last_update}`);
      const countResult = await pool.query(`SELECT COUNT(*) AS count FROM tires;`);
      const count = countResult.rows[0].count;
      
      return NextResponse.json(
        { lastUpdate: result.rows[0].last_update, count },
        { 
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        }
      );
    } else {
      // If we couldn't find a timestamp, but we have tires, use current time as fallback
      const countResult = await pool.query(`SELECT COUNT(*) AS count FROM tires;`);
      const count = countResult.rows[0].count;
      
      if (parseInt(count) > 0) {
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
      }
      
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
  } catch (error) {
    console.error('Error querying last updated:', error);
    
    // As a last resort, see if we can at least get a count of tires
    try {
      const countResult = await pool.query(`SELECT COUNT(*) AS count FROM tires;`);
      const count = countResult.rows[0].count;
      if (parseInt(count) > 0) {
        return NextResponse.json(
          { lastUpdate: new Date().toISOString(), count, note: "Fallback timestamp" },
          { 
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0'
            } 
          }
        );
      }
    } catch (countError) {
      console.error('Error getting count:', countError);
    }
    
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

export {};
