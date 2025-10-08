import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';
import { PRICING_CONFIG } from '@/config/pricing';
import { pricingService } from '@/lib/pricingService';

// Generate unique order ID for complimentary tickets
function generateComplimentaryOrderId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `COMP-SSS2025-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Admin Generate Complimentary Ticket ===');
    const body = await request.json();
    const { 
      fullName, 
      phone, 
      email, 
      dob, 
      address, 
      country, 
      memberId, 
      ticketQuantity, 
      ticketType,
      isComplimentary 
    } = body;

    console.log('Admin ticket generation request:', { 
      fullName, 
      phone, 
      email, 
      dob, 
      address, 
      country, 
      memberId, 
      ticketQuantity, 
      ticketType,
      isComplimentary 
    });

    // Basic validation
    if (!fullName || !phone || !email || !dob || !address || !memberId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Member ID validation
    const memberIdRegex = /^\d{6,}$/;
    if (!memberIdRegex.test(memberId)) {
      return NextResponse.json(
        { success: false, error: "Member ID must contain at least 6 digits" },
        { status: 400 }
      );
    }

    // Ticket quantity validation
    const quantity = ticketQuantity || 1;
    if (quantity < 1 || quantity > 5) {
      return NextResponse.json(
        { success: false, error: "Ticket quantity must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check ticket availability against event limit (includes complimentary tickets)
    const totalSoldResult = await postgresDb.executeQuery(
      'SELECT COALESCE(SUM(ticket_quantity), 0) as total_sold FROM registrations WHERE status = $1',
      ['paid']
    );
    
    const totalSold = parseInt(totalSoldResult.rows[0]?.total_sold || '0');
    const maxTickets = PRICING_CONFIG.MAX_EVENT_TICKETS;
    const remainingTickets = maxTickets - totalSold;
    
    console.log(`🎫 Admin ticket availability check: ${totalSold}/${maxTickets} sold, ${remainingTickets} remaining`);
    console.log(`🎁 Admin requesting: ${quantity} complimentary tickets`);
    
    if (quantity > remainingTickets) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not enough tickets available',
          details: `Only ${remainingTickets} tickets remaining, but ${quantity} complimentary tickets requested`,
          totalSold,
          maxTickets,
          remainingTickets,
          requestedQuantity: quantity,
          isAdminRequest: true
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateComplimentaryOrderId();

    console.log(`Creating ${quantity} complimentary tickets for order:`, orderId);

    // Generate multiple tickets based on quantity (same as payment system)
    const tickets = [];

    for (let i = 1; i <= quantity; i++) {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const ticketId = `COMP-TICKET-${orderId}-${i.toString().padStart(2, '0')}-${timestamp}-${randomSuffix}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      
      // Create ticket record in database
      const ticketResult = await postgresDb.createTicket({
        ticketId,
        orderId,
        participantName: fullName,
        participantEmail: email,
        participantPhone: phone,
        eventName: "Synergy SEA Summit 2025",
        eventDate: "November 8, 2025",
        eventLocation: "The Stones Hotel, Legian Bali",
        qrCode: qrCodeUrl,
        emailSent: false, // Will be updated after email is sent
        ticketType: 'complimentary',
        isComplimentary: true
      });

      tickets.push({
        ticketId,
        qrCode: qrCodeUrl,
        ticketNumber: i
      });

      console.log(`Complimentary Ticket ${i}/${quantity} created:`, ticketId);
    }

    // Store registration in database
    const registrationData = await postgresDb.createRegistration({
      orderId,
      fullName,
      phone,
      email,
      dob,
      address,
      country,
      memberId,
      ticketQuantity: quantity,
      amount: 0, // Free ticket
      originalAmount: 0,
      discountAmount: 0,
      voucherCode: null,
      status: 'paid', // Mark as paid since it's complimentary
      ticketType: ticketType || 'complimentary',
      isComplimentary: true
    });

    // Store payment record (even though it's free)
    const paymentData = await postgresDb.createPayment({
      order_id: orderId,
      amount: 0,
      status: 'paid',
      payment_method: 'complimentary',
      payment_data: {
        type: 'complimentary_ticket',
        generated_by: 'admin',
        ticket_type: ticketType || 'complimentary'
      }
    });

    console.log('💾 Complimentary registration and payment data stored in database');

    // Send e-ticket with QR code via email (same as payment system)
    console.log(`Sending email with ${quantity} complimentary tickets to:`, email);
    let emailResult;

    if (quantity === 1) {
      // Send single ticket email
      emailResult = await emailService.sendTicketEmail({
        ticketId: tickets[0].ticketId,
        orderId,
        participantName: fullName,
        participantEmail: email,
        participantPhone: phone,
        eventName: "Synergy SEA Summit 2025",
        eventDate: "November 8, 2025",
        eventTime: "10:00 AM - 05:00 PM WITA",
        eventLocation: "The Stones Hotel, Legian Bali",
        amount: 0, // Free
        qrCode: tickets[0].qrCode,
        transactionId: orderId,
        paidAt: new Date().toISOString()
      });
    } else {
      // Send multiple tickets email
      emailResult = await emailService.sendMultipleTicketsEmail({
        orderId,
        participantName: fullName,
        participantEmail: email,
        participantPhone: phone,
        eventName: "Synergy SEA Summit 2025",
        eventDate: "November 8, 2025",
        eventTime: "10:00 AM - 05:00 PM WITA",
        eventLocation: "The Stones Hotel, Legian Bali",
        amount: 0, // Free
        transactionId: orderId,
        paidAt: new Date().toISOString(),
        tickets: tickets
      });
    }

    console.log('📧 Complimentary e-ticket sent to participant');

    // Update ticket status to email_sent for all tickets after successful email sending
    for (const ticket of tickets) {
      try {
        await postgresDb.updateTicketEmailSent(ticket.ticketId);
        console.log(`✅ Email status updated for ticket: ${ticket.ticketId}`);
      } catch (updateError) {
        console.error(`⚠️ Failed to update email status for ticket ${ticket.ticketId}:`, updateError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Complimentary ticket generated and sent successfully',
      order_id: orderId,
      participant_name: fullName,
      participant_email: email,
      ticket_quantity: quantity,
      ticket_type: ticketType || 'complimentary',
      amount: 0,
      tickets: tickets.map(ticket => ({
        ticketId: ticket.ticketId,
        qrCode: ticket.qrCode
      }))
    });

  } catch (error: any) {
    console.error('💥 Admin Generate Ticket Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate complimentary ticket', 
        details: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}