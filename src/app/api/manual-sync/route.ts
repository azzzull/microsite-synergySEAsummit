import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    console.log('🔄 Manual sync for order:', orderId);

    // Update registration to paid status
    const result = await postgresDb.updateRegistration(orderId, {
      status: 'paid'
    });

    // Update payment record
    await postgresDb.updatePayment(orderId, {
      status: 'success',
      transactionId: `MANUAL_${Date.now()}`,
      paymentMethod: 'VIRTUAL_ACCOUNT_BCA',
      paidAt: new Date().toISOString()
    });

    if (result.success) {
      const registration = result.registration as any;
      
      // Create ticket
      const ticketId = `TICKET-${orderId}-${Date.now()}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      
      await postgresDb.createTicket({
        ticketId,
        orderId,
        participantName: registration.fullName,
        participantEmail: registration.email,
        participantPhone: registration.phone,
        eventName: 'Synergy SEA Summit 2025',
        eventDate: 'November 8, 2025',
        eventLocation: 'The Stones Hotel, Legian Bali',
        qrCode: qrCodeUrl,
        emailSent: true
      });

      return NextResponse.json({
        success: true,
        message: 'Manual sync completed',
        orderId,
        status: 'paid'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Registration not found',
        orderId
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Manual sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Manual sync failed',
      details: error.message
    }, { status: 500 });
  }
}
