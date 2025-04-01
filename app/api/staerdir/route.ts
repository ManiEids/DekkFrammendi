import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../../../app/constants';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  try {
    const result = await pool.query(`SELECT DISTINCT width, aspect_ratio, rim_size FROM tires;`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error querying sizes:', error);
    const staerdir: { width: number; aspect_ratio: number; rim_size: number }[] = [];
    WIDTHS.forEach(width => {
      HEIGHTS.forEach(aspect_ratio => {
        RIM_SIZES.forEach(rim_size => {
          staerdir.push({ width, aspect_ratio, rim_size });
        });
      });
    });
    return NextResponse.json(staerdir);
  }
}
