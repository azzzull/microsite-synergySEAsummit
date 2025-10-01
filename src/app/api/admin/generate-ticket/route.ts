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
    console.log('=== Admin Generate VIP Ticket ===');
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

    console.log('Admin VIP ticket generation request:', { 
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

    console.log('🔗 Testing database connection...');
    
    // Test database connection
    try {
      const testQuery = await postgresDb.executeQuery('SELECT 1 as test');
      console.log('✅ Database connection OK:', testQuery.rows[0]);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }

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
    console.log(`� Admin requesting: ${quantity} VIP tickets`);
    
    if (quantity > remainingTickets) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not enough tickets available',
          details: `Only ${remainingTickets} tickets remaining, but ${quantity} VIP tickets requested`,
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

    console.log(`Creating ${quantity} VIP tickets for order:`, orderId);

    // Generate multiple tickets based on quantity (all VIP tickets)
    const tickets = [];

    // All generated tickets are VIP
    const isVip = true;

    for (let i = 1; i <= quantity; i++) {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const ticketId = `VIP-SSS2025-${timestamp}-${randomSuffix}-${i.toString().padStart(2, '0')}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      
      console.log(`🔄 Creating ticket ${i}/${quantity} with ID: ${ticketId}`);
      
      // Create ticket record in database with VIP flag
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
        ticketType: 'vip',
        isComplimentary: true,
        isVip: true
      });

      console.log(`📝 Ticket creation result:`, ticketResult);

      if (!ticketResult.success) {
        console.error(`❌ Failed to create ticket ${i}: ${ticketResult.error}`);
        throw new Error(`Failed to create ticket: ${ticketResult.error}`);
      }

      tickets.push({
        ticketId,
        ticketCode: ticketResult.ticket.ticketCode, // Store the actual ticket code for updating
        qrCode: qrCodeUrl,
        ticketNumber: i,
        isVip: true
      });

      console.log(`VIP Ticket ${i}/${quantity} created:`, ticketId, 'DB Code:', ticketResult.ticket.ticketCode);
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
      ticketType: 'vip',
      isComplimentary: true
    });

    // Store payment record (even though it's free)
    const paymentData = await postgresDb.createPayment({
      order_id: orderId,
      amount: 0,
      status: 'paid',
      payment_method: 'vip_access',
      payment_data: {
        type: 'vip_ticket',
        generated_by: 'admin',
        ticket_type: 'vip'
      }
    });

    console.log('💾 VIP registration and payment data stored in database');

    // Send e-ticket with QR code via email (same as payment system)
    console.log(`Sending email with ${quantity} VIP tickets to:`, email);
    let emailResult;

    if (quantity === 1) {
      // Send single ticket email
      emailResult = await emailService.sendTicket({
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
        paidAt: new Date().toISOString(),
        isVip: true
      });
    } else {
      // Send multiple tickets email
      emailResult = await emailService.sendMultipleTickets({
        orderId,
        participantName: fullName,
        participantEmail: email,
        participantPhone: phone,
        eventName: "Synergy SEA Summit 2025",
        eventDate: "November 8, 2025",
        eventTime: "10:00 AM - 05:00 PM WITA",
        eventLocation: "The Stones Hotel, Legian Bali",
        totalAmount: 0, // Free
        transactionId: orderId,
        paidAt: new Date().toISOString(),
        tickets: tickets,
        isVip: true
      });
    }

    console.log('📧 VIP e-ticket sent to participant');

    // Update ticket status to email_sent for all tickets after successful email sending
    for (const ticket of tickets) {
      try {
        await postgresDb.updateTicketEmailSent(ticket.ticketCode);
        console.log(`✅ Email status updated for ticket: ${ticket.ticketCode} (ID: ${ticket.ticketId})`);
      } catch (updateError) {
        console.error(`⚠️ Failed to update email status for ticket ${ticket.ticketCode}:`, updateError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'VIP ticket generated and sent successfully',
      order_id: orderId,
      participant_name: fullName,
      participant_email: email,
      ticket_quantity: quantity,
      ticket_type: 'vip',
      amount: 0,
      tickets: tickets.map(ticket => ({
        ticketId: ticket.ticketId,
        qrCode: ticket.qrCode
      }))
    });

  } catch (error: any) {
    console.error('💥 Admin Generate Ticket Error:', error);
    console.error('💥 Error Stack:', error.stack);
    console.error('💥 Error Details:', {
      name: error.name,
      message: error.message,
      cause: error.cause
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate VIP ticket', 
        details: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}