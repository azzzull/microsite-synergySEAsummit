import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const testQuery = await postgresDb.executeQuery('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Basic query result:', testQuery.rows[0]);
    
    // Test tickets table
    const ticketsQuery = await postgresDb.executeQuery('SELECT COUNT(*) as ticket_count FROM tickets');
    console.log('✅ Tickets count:', ticketsQuery.rows[0]);
    
    // Test registrations table
    const registrationsQuery = await postgresDb.executeQuery('SELECT COUNT(*) as registration_count FROM registrations');
    console.log('✅ Registrations count:', registrationsQuery.rows[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      results: {
        connection: testQuery.rows[0],
        tickets: ticketsQuery.rows[0],
        registrations: registrationsQuery.rows[0]
      }
    });
    
  } catch (error: any) {
    console.error('💥 Database test error:', error);
    console.error('💥 Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}