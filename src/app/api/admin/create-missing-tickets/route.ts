import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Manual Ticket Creation ===');
    
    // Get all paid registrations
    const registrationsResult = await postgresDb.getRegistrations();
    if (!registrationsResult.success) {
      return NextResponse.json({ error: 'Failed to get registrations' }, { status: 500 });
    }

    const paidRegistrations = registrationsResult.registrations.filter((reg: any) => reg.status === 'paid');
    
    // Get existing tickets
    const ticketsResult = await postgresDb.getTickets();
    if (!ticketsResult.success) {
      return NextResponse.json({ error: 'Failed to get tickets' }, { status: 500 });
    }

    const existingTicketOrderIds = new Set(ticketsResult.tickets.map((ticket: any) => ticket.orderId));
    
    // Find registrations without tickets
    const registrationsWithoutTickets = paidRegistrations.filter((reg: any) => 
      !existingTicketOrderIds.has(reg.orderId)
    );

    console.log(`Found ${registrationsWithoutTickets.length} paid registrations without tickets`);

    const createdTickets = [];
    
    // Create tickets for missing registrations
    for (const registration of registrationsWithoutTickets) {
      try {
        console.log(`Creating ticket for order: ${registration.orderId}`);
        
        const ticketId = `TICKET-${registration.orderId}-${Date.now()}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
        
        // Create ticket record
        const ticketResult = await postgresDb.createTicket({
          ticketId,
          orderId: registration.orderId,
          qrCode: qrCodeUrl,
          status: 'active'
        });

        if (ticketResult.success) {
          createdTickets.push({
            orderId: registration.orderId,
            participantName: registration.fullName,
            participantEmail: registration.email,
            ticketId: ticketResult.ticket.ticketCode
          });

          // Send e-ticket email
          console.log(`Sending e-ticket email to: ${registration.email}`);
          const emailResult = await emailService.sendTicket({
            ticketId,
            orderId: registration.orderId,
            participantName: registration.fullName,
            participantEmail: registration.email,
            participantPhone: registration.phone,
            eventName: "Synergy SEA Summit 2025",
            eventDate: "November 8, 2025",
            eventTime: "09:00 AM - 05:00 PM WITA",
            eventLocation: "The Stones Hotel, Legian Bali",
            amount: registration.amount,
            qrCode: qrCodeUrl,
            transactionId: `MANUAL-${registration.orderId}`,
            paidAt: registration.updatedAt || new Date().toISOString()
          });

          console.log(`Email result for ${registration.email}:`, emailResult.success ? 'SUCCESS' : 'FAILED');
          
          // Update ticket status based on email result
          if (emailResult.success) {
            await postgresDb.updateTicket(registration.orderId, {
              status: 'email_sent'
            });
          } else {
            await postgresDb.updateTicket(registration.orderId, {
              status: 'email_failed'
            });
          }
        }
      } catch (error) {
        console.error(`Error creating ticket for ${registration.orderId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdTickets.length} tickets`,
      createdTickets,
      totalPaidRegistrations: paidRegistrations.length,
      existingTickets: existingTicketOrderIds.size,
      newTickets: createdTickets.length
    });

  } catch (error: any) {
    console.error('Manual ticket creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create tickets', details: error.message },
      { status: 500 }
    );
  }
}
