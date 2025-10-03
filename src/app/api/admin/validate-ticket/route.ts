import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({
        valid: false,
        error: 'Ticket ID is required'
      }, { status: 400 });
    }

    console.log('🔍 Validating ticket:', ticketId);

    // Search for ticket by ticket_code or in QR code data
    const result = await postgresDb.executeQuery(`
      SELECT 
        t.id,
        t.order_id,
        t.ticket_code,
        t.status,
        t.participant_name,
        t.participant_email,
        t.ticket_type,
        t.is_vip,
        t.is_complimentary,
        -- Get registration data for fallback info
        r.full_name,
        r.email as registration_email,
        -- Get payment status to validate ticket
        p.status as payment_status
      FROM tickets t
      LEFT JOIN registrations r ON t.order_id = r.order_id
      LEFT JOIN payments p ON t.order_id = p.order_id
      WHERE 
        t.ticket_code = $1 OR 
        t.ticket_code ILIKE $2 OR
        t.qr_code ILIKE $3
      LIMIT 1;
    `, [
      ticketId,
      `%${ticketId}%`,
      `%${ticketId}%`
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        valid: false,
        error: 'Ticket not found',
        participantName: null,
        participantEmail: null,
        type: null
      });
    }

    const ticketData = result.rows[0];

    // Check if ticket is valid
    const isValidStatus = ['active', 'email_sent', 'pending'].includes(ticketData.status);
    const isValidPayment = ['paid', 'completed', 'success'].includes(ticketData.payment_status) || 
                          ticketData.is_complimentary || 
                          ticketData.is_vip;

    const isValid = isValidStatus && isValidPayment;

    // Determine ticket type
    let ticketType = 'standard';
    if (ticketData.is_vip) {
      ticketType = 'vip';
    } else if (ticketData.is_complimentary) {
      ticketType = 'complimentary';
    } else if (ticketData.ticket_type) {
      ticketType = ticketData.ticket_type;
    }

    // Get participant info (prioritize ticket data, fallback to registration)
    const participantName = ticketData.participant_name || ticketData.full_name || 'Unknown';
    const participantEmail = ticketData.participant_email || ticketData.registration_email || 'Unknown';

    console.log(`${isValid ? '✅' : '❌'} Ticket validation result:`, {
      ticketCode: ticketData.ticket_code,
      valid: isValid,
      participant: participantName,
      type: ticketType,
      status: ticketData.status,
      paymentStatus: ticketData.payment_status
    });

    return NextResponse.json({
      valid: isValid,
      participantName: participantName,
      participantEmail: participantEmail,
      type: ticketType,
      ...(isValid ? {} : { 
        error: `Invalid ticket - Status: ${ticketData.status}, Payment: ${ticketData.payment_status}` 
      })
    });

  } catch (error) {
    console.error('❌ Ticket validation error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Internal server error during validation',
      participantName: null,
      participantEmail: null,
      type: null
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Ticket Validation API',
    usage: 'Send POST request with { "ticketId": "TICKET-CODE" }',
    returns: {
      valid: 'boolean - true if ticket is valid',
      participantName: 'string - participant name',
      participantEmail: 'string - participant email', 
      type: 'string - ticket type (standard/vip/complimentary)',
      error: 'string - error message if validation fails'
    },
    examples: {
      validTicket: {
        valid: true,
        participantName: 'John Doe',
        participantEmail: 'john@example.com',
        type: 'vip'
      },
      invalidTicket: {
        valid: false,
        participantName: null,
        participantEmail: null,
        type: null,
        error: 'Ticket not found'
      }
    }
  });
}