import { NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    const result = await postgresDb.getRegistrations();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch registrations from PostgreSQL', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      registrations: result.registrations,
      count: result.registrations.length,
      source: 'Railway PostgreSQL'
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations', details: error.message },
      { status: 500 }
    );
  }
}
