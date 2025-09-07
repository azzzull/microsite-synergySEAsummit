import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Read data files directly
    const registrationsPath = path.join(process.cwd(), 'data', 'registrations.json');
    const paymentsPath = path.join(process.cwd(), 'data', 'payments.json');
    const ticketsPath = path.join(process.cwd(), 'data', 'tickets.json');
    
    let registrations = [];
    let payments = [];
    let tickets = [];
    
    try {
      if (fs.existsSync(registrationsPath)) {
        registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
      }
    } catch (e) {
      console.log('No registrations file');
    }
    
    try {
      if (fs.existsSync(paymentsPath)) {
        payments = JSON.parse(fs.readFileSync(paymentsPath, 'utf8'));
      }
    } catch (e) {
      console.log('No payments file');
    }
    
    try {
      if (fs.existsSync(ticketsPath)) {
        tickets = JSON.parse(fs.readFileSync(ticketsPath, 'utf8'));
      }
    } catch (e) {
      console.log('No tickets file');
    }
    
    // Find specific order
    const registration = registrations.find((r: any) => r.orderId === orderId);
    const payment = payments.find((p: any) => p.orderId === orderId);
    const ticket = tickets.find((t: any) => t.orderId === orderId);

    return NextResponse.json({
      success: true,
      orderId,
      found: !!registration,
      registration,
      payment,
      ticket,
      debug: {
        totalRegistrations: registrations.length,
        totalPayments: payments.length,
        totalTickets: tickets.length,
        searchedOrderId: orderId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
