import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET(request: NextRequest) {
  try {
    // Simple test to check database time vs server time
    const serverTime = {
      server_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      server_current_time: new Date().toString(),
      server_utc_time: new Date().toISOString(),
      server_jakarta_time: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    };

    // Get latest registration to see database timestamp
    const registrationsResult = await postgresDb.getRegistrations();
    
    let databaseTimeInfo = null;
    if (registrationsResult.success && registrationsResult.registrations.length > 0) {
      const latest = registrationsResult.registrations[0];
      databaseTimeInfo = {
        latest_registration: latest.fullName,
        database_created_at_utc: latest.createdAt,
        database_created_at_jakarta: new Date(latest.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
        time_difference_hours: (new Date().getTime() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60)
      };
    }

    return NextResponse.json({
      success: true,
      server_info: serverTime,
      database_info: databaseTimeInfo,
      explanation: {
        issue: "If registration was made at night Jakarta time but shows different time",
        possible_causes: [
          "Database server timezone is not Jakarta",
          "Application server timezone different from database",
          "CURRENT_TIMESTAMP in database uses different timezone"
        ],
        solution: "Need to check database server timezone settings"
      }
    });

  } catch (error: any) {
    console.error('Database timezone check error:', error);
    return NextResponse.json(
      { error: 'Failed to check database timezone', details: error.message },
      { status: 500 }
    );
  }
}
