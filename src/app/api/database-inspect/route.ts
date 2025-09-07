import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('🔍 Inspecting database schema...');
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        success: false,
        error: 'POSTGRES_URL not configured',
        message: 'Please add Railway PostgreSQL connection string to environment variables'
      }, { status: 500 });
    }

    // Check database info
    const dbInfo = await sql`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        current_schema() as current_schema,
        version() as postgres_version;
    `;

    // List all tables in current schema
    const tables = await sql`
      SELECT 
        table_name,
        table_schema,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = current_schema()
      ORDER BY table_name;
    `;

    // Get table row counts
    const tableCounts: Record<string, number | string> = {};
    for (const table of tables.rows) {
      try {
        const countResult = await sql.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        tableCounts[table.table_name] = parseInt(countResult.rows[0].count);
      } catch (error) {
        tableCounts[table.table_name] = 'Error: ' + (error instanceof Error ? error.message : 'Unknown');
      }
    }

    // Check if our expected tables exist
    const expectedTables = ['registrations', 'payments', 'tickets'];
    const existingTables = tables.rows.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));

    return NextResponse.json({
      success: true,
      database: {
        info: dbInfo.rows[0],
        connection_string: process.env.POSTGRES_URL?.split('@')[1] || 'Hidden',
        tables_found: tables.rowCount,
        tables: tables.rows,
        table_counts: tableCounts,
        expected_tables: expectedTables,
        missing_tables: missingTables,
        status: missingTables.length === 0 ? 'All tables exist' : `Missing ${missingTables.length} tables`
      },
      railway_console_note: 'Railway console might show different view. This endpoint shows actual application database state.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database inspection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to inspect database',
      troubleshooting: [
        '1. Check POSTGRES_URL in Vercel environment variables',
        '2. Verify Railway PostgreSQL is running',
        '3. Test connection from Railway console',
        '4. Try running /api/setup/database endpoint'
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
