import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/database';
import { emailService } from '@/lib/emailService';

const CLIENT_SECRET = process.env.DOKU_CLIENT_SECRET || 'your_sandbox_client_secret';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// DOKU callback endpoint untuk payment notification
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 DOKU Payment Callback received');
    
    const body = await request.json();
    const headers = request.headers;
    
    console.log('📥 Callback headers:', {
      'x-signature': headers.get('x-signature'),
      'x-timestamp': headers.get('x-timestamp'),
      'client-id': headers.get('client-id')
    });
    
    console.log('📥 Callback body:', body);

    // Verify DOKU signature untuk keamanan
    const signature = headers.get('x-signature');
    const timestamp = headers.get('x-timestamp');
    const clientId = headers.get('client-id');
    
    if (!signature || !timestamp || !clientId) {
      console.log('❌ Missing required headers');
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    // Verify signature (implementasi sesuai dokumentasi DOKU)
    if (CLIENT_SECRET && CLIENT_SECRET !== 'your_sandbox_client_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', CLIENT_SECRET)
        .update(JSON.stringify(body) + timestamp)
        .digest('base64');
      
      if (signature !== `HMACSHA256=${expectedSignature}`) {
        console.log('❌ Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Process payment notification
    const { order, payment, customer } = body;
    
    if (payment?.status === 'SUCCESS' || payment?.status === 'COMPLETE') {
      console.log('✅ Payment successful for order:', order?.invoice_number);
      
      // Update registration and payment status in database
      const registration = await db.updateRegistration(order?.invoice_number, {
        status: 'paid'
      });

      const paymentRecord = await db.updatePayment(order?.invoice_number, {
        status: 'success',
        transactionId: payment?.transaction_id,
        paymentMethod: payment?.payment_method,
        paidAt: new Date().toISOString()
      });

      if (!registration) {
        console.log('⚠️ Registration not found for order:', order?.invoice_number);
        return NextResponse.json({ 
          message: 'Registration not found',
          status: 'ERROR'
        });
      }

      // Generate and send e-ticket
      const ticketId = `TICKET-${order?.invoice_number}-${Date.now()}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      
      // Create ticket record
      const ticket = await db.createTicket({
        ticketId: ticketId,
        orderId: order?.invoice_number,
        participantName: registration.fullName,
        participantEmail: registration.email,
        participantPhone: registration.phone,
        eventName: 'Synergy SEA Summit 2025',
        eventDate: 'November 8, 2025',
        eventLocation: 'The Stones Hotel, Legian Bali',
        qrCode: qrCodeUrl,
        emailSent: false
      });

      // Send e-ticket email
      const emailResult = await emailService.sendTicket({
        ticketId: ticketId,
        orderId: order?.invoice_number,
        participantName: registration.fullName,
        participantEmail: registration.email,
        participantPhone: registration.phone,
        eventName: 'Synergy SEA Summit 2025',
        eventDate: 'November 8, 2025',
        eventTime: '09:00 AM - 05:00 PM WITA',
        eventLocation: 'The Stones Hotel, Legian Bali',
        amount: parseInt(order?.amount || '250000'),
        qrCode: qrCodeUrl,
        transactionId: payment?.transaction_id,
        paidAt: new Date().toISOString()
      });

      // Update ticket email status
      if (emailResult.success) {
        await db.updateTicket(order?.invoice_number, {
          emailSent: true,
          emailSentAt: new Date().toISOString()
        });
        console.log('✅ E-ticket sent successfully');
      } else {
        console.log('❌ E-ticket sending failed:', emailResult.error);
      }

      console.log('💾 Payment processed and e-ticket sent for:', order?.invoice_number);

      return NextResponse.json({ 
        message: 'Payment notification processed successfully',
        status: 'SUCCESS'
      });
    } else {
      console.log('⚠️ Payment not successful:', payment?.status);
      return NextResponse.json({ 
        message: 'Payment notification received but status not successful',
        status: payment?.status || 'UNKNOWN'
      });
    }

  } catch (error: any) {
    console.error('❌ Callback processing error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint untuk testing
export async function GET() {
  return NextResponse.json({
    message: 'DOKU Payment Callback Endpoint',
    description: 'This endpoint receives payment notifications from DOKU',
    endpoint: '/api/payment/callback',
    methods: ['POST'],
    setup_instructions: {
      doku_webhook_url: `${BASE_URL}/api/payment/callback`,
      required_headers: {
        'x-signature': 'HMACSHA256=...',
        'x-timestamp': 'timestamp',
        'client-id': 'your-client-id'
      }
    }
  });
}
