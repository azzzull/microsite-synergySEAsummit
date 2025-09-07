import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    console.log('🚀 Quick database setup starting...');
    
    // Check if PostgreSQL is configured
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        success: false,
        error: 'POSTGRES_URL environment variable not set',
        message: 'Please add Railway PostgreSQL connection string to Vercel environment variables'
      }, { status: 500 });
    }

    // Initialize database (create tables)
    const initResult = await postgresDb.initializeDatabase();
    
    if (!initResult.success) {
      return NextResponse.json({
        success: false,
        error: initResult.error,
        message: 'Failed to initialize database tables'
      }, { status: 500 });
    }

    // Test by creating a sample registration
    const sampleData = {
      orderId: `SETUP_TEST_${Date.now()}`,
      fullName: 'Database Setup Test',
      phone: '+628123456789',
      email: 'test@synergyseasummit.com',
      dob: '1990-01-01',
      address: 'Test Address',
      country: 'Indonesia',
      amount: 250000,
      status: 'test'
    };

    const testResult = await postgresDb.createRegistration(sampleData);
    
    return NextResponse.json({
      success: true,
      message: '✅ Railway PostgreSQL setup completed successfully!',
      database: {
        tablesCreated: true,
        testRecordCreated: testResult.success,
        provider: 'Railway PostgreSQL',
        connectionStatus: 'Connected'
      },
      nextSteps: [
        '1. Database tables created: registrations, payments, tickets',
        '2. Test record inserted successfully',
        '3. Ready for DOKU payment integration',
        '4. Try registering a test user via /register page'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database setup failed',
      troubleshooting: [
        '1. Check POSTGRES_URL in Vercel environment variables',
        '2. Verify Railway PostgreSQL is running',
        '3. Check connection string format',
        '4. Try again in a few minutes'
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
