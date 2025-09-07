import { NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    const result = await postgresDb.getPayments();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch payments from PostgreSQL', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      payments: result.payments,
      count: result.payments.length,
      source: 'Railway PostgreSQL'
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments', details: error.message },
      { status: 500 }
    );
  }
}
