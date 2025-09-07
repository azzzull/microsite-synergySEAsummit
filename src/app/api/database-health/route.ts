import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Check connection
    const healthCheck = await sql`SELECT NOW() as current_time, version() as postgres_version;`;
    
    // Check tables exist
    const tablesResult = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = current_schema()
      AND table_name IN ('registrations', 'payments', 'tickets')
      ORDER BY table_name;
    `;
    
    // Count records in each table
    const regCount = await sql`SELECT COUNT(*) as count FROM registrations;`;
    const payCount = await sql`SELECT COUNT(*) as count FROM payments;`;
    const ticketCount = await sql`SELECT COUNT(*) as count FROM tickets;`;
    
    // Get latest registration
    const latestReg = await sql`
      SELECT order_id, full_name, status, created_at 
      FROM registrations 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    return NextResponse.json({
      status: 'healthy',
      connection: 'active',
      timestamp: healthCheck.rows[0].current_time,
      database: {
        version: healthCheck.rows[0].postgres_version,
        provider: 'Railway PostgreSQL',
        schema: 'public'
      },
      tables: {
        found: tablesResult.rows,
        count: tablesResult.rowCount
      },
      data: {
        registrations: parseInt(regCount.rows[0].count),
        payments: parseInt(payCount.rows[0].count),
        tickets: parseInt(ticketCount.rows[0].count)
      },
      latest_activity: latestReg.rows[0] || null,
      message: '✅ Railway PostgreSQL fully operational - ignore Railway UI display issue'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: '❌ Database connection failed'
    }, { status: 500 });
  }
}
