import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('🔧 Testing Railway PostgreSQL connection...');
    
    // Test basic connection
    const result = await sql`SELECT version() as version, current_database() as database, current_user as user;`;
    
    const connectionInfo = result.rows[0];
    
    // Test table creation (lightweight)
    await sql`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Insert test data
    await sql`INSERT INTO connection_test DEFAULT VALUES;`;
    
    // Count test records
    const countResult = await sql`SELECT COUNT(*) as count FROM connection_test;`;
    
    // Clean up test table
    await sql`DROP TABLE IF EXISTS connection_test;`;
    
    return NextResponse.json({
      success: true,
      message: 'Railway PostgreSQL connection successful! 🚂',
      database: {
        version: connectionInfo.version,
        database: connectionInfo.database,
        user: connectionInfo.user,
        testRecords: countResult.rows[0].count
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Railway PostgreSQL connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Railway PostgreSQL connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
