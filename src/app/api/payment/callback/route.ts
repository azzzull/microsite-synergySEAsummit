import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { postgresDb } from '@/lib/postgresDatabase';
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

    // Verify DOKU signature untuk keamanan (skip untuk sandbox)
    const signature = headers.get('x-signature');
    const timestamp = headers.get('x-timestamp');
    const clientId = headers.get('client-id');
    
    // For sandbox mode, headers might be missing - log but continue processing
    if (!signature || !timestamp) {
      console.log('⚠️ Missing signature headers (sandbox mode) - continuing...');
    } else {
      console.log('✅ Headers present, verifying signature...');
      
      // Verify signature only if we have proper headers and production secret
      if (CLIENT_SECRET && CLIENT_SECRET !== 'your_sandbox_client_secret') {
        const expectedSignature = crypto
          .createHmac('sha256', CLIENT_SECRET)
          .update(JSON.stringify(body) + timestamp)
          .digest('base64');
        
        if (signature !== `HMACSHA256=${expectedSignature}`) {
          console.log('❌ Invalid signature');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        console.log('✅ Signature verified');
      }
    }

    // Process payment notification - handle DOKU Jokul format
    const { order, transaction, virtual_account_payment, additional_info } = body;
    const orderId = order?.invoice_number;
    const paymentStatus = transaction?.status;
    
    console.log('📊 Processing payment notification:', {
      orderId,
      status: paymentStatus,
      amount: order?.amount
    });
    
    if (paymentStatus === 'SUCCESS') {
      console.log('✅ Payment successful for order:', orderId);
      
      // Update registration and payment status in database
      const registrationResult = await postgresDb.updateRegistration(orderId, {
        status: 'paid'
      });

      const paymentRecord = await postgresDb.updatePayment(orderId, {
        status: 'success',
        transactionId: transaction?.original_request_id || virtual_account_payment?.reference_number,
        paymentMethod: 'VIRTUAL_ACCOUNT_BCA',
        paidAt: transaction?.date || new Date().toISOString(),
        paymentData: JSON.stringify(body)
      });

      if (!registrationResult.success || !registrationResult.registration) {
        console.log('⚠️ Registration not found for order:', orderId);
        return NextResponse.json({ 
          message: 'Registration not found',
          status: 'ERROR'
        });
      }

      const registration = registrationResult.registration as any;

      // Generate and send e-ticket
      const ticketId = `TICKET-${orderId}-${Date.now()}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      
      // Create ticket record
      const ticket = await postgresDb.createTicket({
        ticketId: ticketId,
        orderId: orderId,
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
        orderId: orderId,
        participantName: registration.fullName,
        participantEmail: registration.email,
        participantPhone: registration.phone,
        eventName: 'Synergy SEA Summit 2025',
        eventDate: 'November 8, 2025',
        eventTime: '09:00 AM - 05:00 PM WITA',
        eventLocation: 'The Stones Hotel, Legian Bali',
        amount: parseInt(order?.amount || '250000'),
        qrCode: qrCodeUrl,
        transactionId: transaction?.original_request_id || virtual_account_payment?.reference_number,
        paidAt: transaction?.date || new Date().toISOString()
      });

      // Update ticket email status
      if (emailResult.success) {
        await postgresDb.updateTicket(orderId, {
          emailSent: true,
          emailSentAt: new Date().toISOString()
        });
        console.log('✅ E-ticket sent successfully');
      } else {
        console.log('❌ E-ticket sending failed:', emailResult.error);
      }

      console.log('💾 Payment processed and e-ticket sent for:', orderId);

      return NextResponse.json({ 
        message: 'Payment notification processed successfully',
        status: 'SUCCESS'
      });
    } else {
      console.log('⚠️ Payment not successful:', paymentStatus);
      return NextResponse.json({ 
        message: 'Payment notification received but status not successful',
        status: paymentStatus || 'UNKNOWN'
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
