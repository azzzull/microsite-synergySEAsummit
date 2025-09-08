import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Manual Email Status Update ===');
    
    // Get all tickets with 'active' status (meaning email was sent during manual creation)
    const ticketsResult = await postgresDb.getTickets();
    if (!ticketsResult.success) {
      return NextResponse.json({ error: 'Failed to get tickets' }, { status: 500 });
    }

    const activeTickets = ticketsResult.tickets.filter((ticket: any) => ticket.status === 'active');
    
    console.log(`Found ${activeTickets.length} tickets with 'active' status to update`);

    const updatedTickets = [];
    
    // Update status to 'email_sent' for all active tickets
    for (const ticket of activeTickets) {
      try {
        console.log(`Updating ticket status for order: ${ticket.orderId}`);
        
        const updateResult = await postgresDb.updateTicket(ticket.orderId, {
          status: 'email_sent'
        });

        if (updateResult.success) {
          updatedTickets.push({
            orderId: ticket.orderId,
            ticketId: ticket.ticketId,
            oldStatus: 'active',
            newStatus: 'email_sent'
          });
        }
      } catch (error) {
        console.error(`Error updating ticket status for ${ticket.orderId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedTickets.length} ticket statuses`,
      updatedTickets,
      totalTickets: ticketsResult.tickets.length,
      activeTickets: activeTickets.length,
      updatedCount: updatedTickets.length
    });

  } catch (error: any) {
    console.error('Manual email status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update email status', details: error.message },
      { status: 500 }
    );
  }
}
