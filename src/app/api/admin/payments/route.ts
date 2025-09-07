import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const payments = await db.getAllPayments();
    return NextResponse.json({ 
      success: true,
      payments,
      count: payments.length
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments', details: error.message },
      { status: 500 }
    );
  }
}
