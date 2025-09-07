import { NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const result = await postgresDb.getRegistrations();
    
    if (result.success && result.registrations.length > 0) {
      return NextResponse.json({ 
        success: true,
        registrations: result.registrations,
        count: result.registrations.length,
        source: 'Railway PostgreSQL'
      });
    }

    // Fallback to cached data if database fails or empty
    try {
      const tempDataPath = path.join(process.cwd(), 'temp_data.json');
      if (fs.existsSync(tempDataPath)) {
        const tempData = JSON.parse(fs.readFileSync(tempDataPath, 'utf8'));
        if (tempData.registrations && tempData.registrations.length > 0) {
          return NextResponse.json({
            success: true,
            registrations: tempData.registrations,
            count: tempData.registrations.length,
            source: 'Cached Data (Database Unavailable)'
          });
        }
      }
    } catch (fallbackError) {
      console.error('Fallback data error:', fallbackError);
    }

    return NextResponse.json(
      { error: 'No registration data available', details: result.error || 'Database empty' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    
    // Try fallback to cached data
    try {
      const tempDataPath = path.join(process.cwd(), 'temp_data.json');
      if (fs.existsSync(tempDataPath)) {
        const tempData = JSON.parse(fs.readFileSync(tempDataPath, 'utf8'));
        if (tempData.registrations) {
          return NextResponse.json({
            success: true,
            registrations: tempData.registrations,
            count: tempData.registrations.length,
            source: 'Cached Data (Database Error)',
            warning: 'Using fallback data due to database connection issue'
          });
        }
      }
    } catch (fallbackError) {
      console.error('Fallback data error:', fallbackError);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch registrations', details: error.message },
      { status: 500 }
    );
  }
}
