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
        t.validated_at,
        t.used_count,
        t.validation_status,
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
    
    // Check if ticket is already used
    if (ticketData.validation_status === 'used') {
      return NextResponse.json({
        valid: false,
        error: 'Ticket sudah digunakan',
        participantName: ticketData.participant_name || 'Unknown',
        participantEmail: ticketData.participant_email || 'Unknown',
        type: ticketData.is_complimentary ? 'complimentary' : 'standard',
        validatedAt: ticketData.validated_at,
        usedCount: ticketData.used_count || 0,
        status: 'used'
      });
    }
    
    const isValid = isValidStatus && isValidPayment;

    // If ticket is valid, mark it as used
    if (isValid) {
      try {
        await postgresDb.executeQuery(`
          UPDATE tickets 
          SET validation_status = 'used',
              validated_at = CURRENT_TIMESTAMP,
              used_count = COALESCE(used_count, 0) + 1
          WHERE ticket_code = $1
        `, [ticketData.ticket_code]);
        
        console.log(`✅ Ticket ${ticketData.ticket_code} marked as used`);
      } catch (updateError) {
        console.error('❌ Error updating ticket status:', updateError);
        // Continue with validation even if update fails
      }
    }

    return NextResponse.json({
      valid: isValid,
      participantName: ticketData.participant_name || 'Unknown',
      participantEmail: ticketData.participant_email || 'Unknown',
      type: ticketData.is_complimentary ? 'complimentary' : 'standard',
      validatedAt: isValid ? new Date().toISOString() : null,
      usedCount: (ticketData.used_count || 0) + (isValid ? 1 : 0),
      status: isValid ? 'used' : 'unused'
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
