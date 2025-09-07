import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const tickets = await db.getAllTickets();
    return NextResponse.json({ 
      success: true,
      tickets,
      count: tickets.length
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets', details: error.message },
      { status: 500 }
    );
  }
}
