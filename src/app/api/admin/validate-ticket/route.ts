import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({
        valid: false,
        error: 'Ticket ID is required',
        participantName: null,
        participantEmail: null,
        type: null
      });
    }

    const result = await postgresDb.executeQuery(`
      SELECT 
        t.ticket_code,
        t.status,
        t.participant_name,
        t.participant_email,
        t.ticket_type,
        t.is_complimentary,
        p.status as payment_status
      FROM tickets t
      LEFT JOIN payments p ON t.order_id = p.order_id
      WHERE t.ticket_code = $1 OR t.qr_code ILIKE $2
      LIMIT 1;
    `, [ticketId, `%${ticketId}%`]);

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
    const isValidStatus = ['active', 'email_sent', 'pending'].includes(ticketData.status);
    const isValidPayment = ['paid', 'completed', 'success'].includes(ticketData.payment_status) || ticketData.is_complimentary;
    const isValid = isValidStatus && isValidPayment;

    return NextResponse.json({
      valid: isValid,
      participantName: ticketData.participant_name || 'Unknown',
      participantEmail: ticketData.participant_email || 'Unknown',
      type: ticketData.is_complimentary ? 'complimentary' : 'standard'
    });

  } catch (error) {
    console.error('Error validating ticket:', error);
    return NextResponse.json({
      valid: false,
      error: 'Server error',
      participantName: null,
      participantEmail: null,
      type: null
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin Ticket Validation API',
    method: 'POST'
  });
}
