import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: string[] = [];
  const values: any[] = [];
  let idx = 1;
  
  if (searchParams.get('id')) {
    filters.push(`id = $${idx}`);
    values.push(Number(searchParams.get('id')));
    idx++;
  }
  if (searchParams.get('width')) {
    filters.push(`width = $${idx}`);
    values.push(Number(searchParams.get('width')));
    idx++;
  }
  if (searchParams.get('aspect_ratio')) {
    filters.push(`aspect_ratio = $${idx}`);
    values.push(Number(searchParams.get('aspect_ratio')));
    idx++;
  }
  if (searchParams.get('rim_size')) {
    filters.push(`rim_size = $${idx}`);
    values.push(Number(searchParams.get('rim_size')));
    idx++;
  }
  // ...additional filters as needed...
  
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const queryText = `SELECT * FROM tires ${whereClause};`;
  
  try {
    const result = await pool.query(queryText, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error querying tires:', error);
    return NextResponse.json({ error: "Error querying tires" }, { status: 500 });
  }
}

export {}; // ensures this file is treated as a module
