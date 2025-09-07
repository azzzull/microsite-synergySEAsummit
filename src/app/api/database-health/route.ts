import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    console.log('🏥 Starting database health check...');
    
    // Test basic connection
    const connectionTest = await postgresDb.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        status: 'error',
        connection: 'failed',
        error: connectionTest.error,
        details: connectionTest.details,
        message: '❌ Database connection test failed'
      }, { status: 500 });
    }

    // Get data counts
    const registrationsResult = await postgresDb.getRegistrations();
    const paymentsResult = await postgresDb.getPayments();
    const ticketsResult = await postgresDb.getTickets();

    return NextResponse.json({
      status: 'healthy',
      connection: 'active',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'Railway PostgreSQL via pg library',
        library: 'node-postgres (pg)',
        schema: 'public'
      },
      data: {
        registrations: registrationsResult.success ? registrationsResult.registrations.length : 0,
        payments: paymentsResult.success ? paymentsResult.payments.length : 0,
        tickets: ticketsResult.success ? ticketsResult.tickets.length : 0
      },
      latest_activity: registrationsResult.success && registrationsResult.registrations.length > 0 
        ? registrationsResult.registrations[0] 
        : null,
      message: '✅ Railway PostgreSQL connection successful via pg library'
    });

  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: '❌ Database health check failed'
    }, { status: 500 });
  }
}
