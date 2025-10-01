import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import { PRICING_CONFIG } from '@/config/pricing';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Check Ticket Availability ===');
    
    // Get total tickets sold from database
    const totalSoldResult = await postgresDb.executeQuery(
      'SELECT COALESCE(SUM(ticket_quantity), 0) as total_sold FROM registrations WHERE status = $1',
      ['paid']
    );
    
    const totalSold = parseInt(totalSoldResult.rows[0]?.total_sold || '0');
    const maxTickets = PRICING_CONFIG.MAX_EVENT_TICKETS;
    const remainingTickets = maxTickets - totalSold;
    
    console.log(`📊 Ticket Status: ${totalSold}/${maxTickets} sold, ${remainingTickets} remaining`);
    
    return NextResponse.json({
      success: true,
      totalSold,
      maxTickets,
      remainingTickets,
      isAvailable: remainingTickets > 0,
      percentageSold: Math.round((totalSold / maxTickets) * 100)
    });
    
  } catch (error: any) {
    console.error('💥 Ticket availability check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check ticket availability', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestedQuantity } = body;
    
    console.log('=== Check Ticket Availability for Purchase ===');
    console.log('Requested quantity:', requestedQuantity);
    
    if (!requestedQuantity || requestedQuantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid ticket quantity' },
        { status: 400 }
      );
    }
    
    // Get total tickets sold from database
    const totalSoldResult = await postgresDb.executeQuery(
      'SELECT COALESCE(SUM(ticket_quantity), 0) as total_sold FROM registrations WHERE status = $1',
      ['paid']
    );
    
    const totalSold = parseInt(totalSoldResult.rows[0]?.total_sold || '0');
    const maxTickets = PRICING_CONFIG.MAX_EVENT_TICKETS;
    const remainingTickets = maxTickets - totalSold;
    
    console.log(`📊 Current Status: ${totalSold}/${maxTickets} sold, ${remainingTickets} remaining`);
    console.log(`🎫 Requested: ${requestedQuantity} tickets`);
    
    if (requestedQuantity > remainingTickets) {
      return NextResponse.json({
        success: false,
        error: 'Not enough tickets available',
        totalSold,
        maxTickets,
        remainingTickets,
        requestedQuantity
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tickets available for purchase',
      totalSold,
      maxTickets,
      remainingTickets,
      requestedQuantity,
      canPurchase: true
    });
    
  } catch (error: any) {
    console.error('💥 Ticket availability validation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to validate ticket availability', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}