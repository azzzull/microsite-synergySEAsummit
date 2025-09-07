import { NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    const result = await postgresDb.getTickets();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch tickets from PostgreSQL', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      tickets: result.tickets,
      count: result.tickets.length,
      source: 'Railway PostgreSQL'
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets', details: error.message },
      { status: 500 }
    );
  }
}
