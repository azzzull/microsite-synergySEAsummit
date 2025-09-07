import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const registrations = await db.getAllRegistrations();
    return NextResponse.json({ 
      success: true,
      registrations,
      count: registrations.length
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations', details: error.message },
      { status: 500 }
    );
  }
}
