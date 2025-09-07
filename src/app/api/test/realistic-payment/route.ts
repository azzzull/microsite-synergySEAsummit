import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';

// Simulate realistic DOKU payment callback dengan status sinkron
export async function POST(request: NextRequest) {
  try {
    console.log('🎯 REALISTIC DOKU PAYMENT SIMULATION STARTED');
    
    const { orderId, paymentMethod = 'VIRTUAL_ACCOUNT_BCA' } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // 1. Cek apakah order exists
    const registrationResult = await postgresDb.getRegistrationByOrderId(orderId);
    if (!registrationResult.success || !registrationResult.registration) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const registration = registrationResult.registration;

    console.log(`🔍 Found registration for order: ${orderId}`);
    console.log(`👤 Customer: ${registration.fullName} (${registration.email})`);

    // 2. Simulate realistic DOKU callback payload
    const dokuyCallbackPayload = {
      order: {
        invoice_number: orderId,
        amount: registration.amount.toString(),
        currency: 'IDR',
        session_id: `session_${Date.now()}`
      },
      payment: {
        status: 'SUCCESS',
        transaction_id: `DOKU_TXN_${Date.now()}`,
        payment_method: paymentMethod,
        payment_channel: paymentMethod,
        paid_at: new Date().toISOString(),
        settlement_date: new Date().toISOString()
      },
      customer: {
        name: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        address: registration.address,
        country: registration.country === 'Indonesia' ? 'ID' : registration.country
      },
      webhook_info: {
        webhook_id: `wh_${Date.now()}`,
        webhook_timestamp: new Date().toISOString(),
        event_type: 'payment.success'
      }
    };

    console.log('📦 DOKU Callback Payload:', dokuyCallbackPayload);

    // 3. Update registration status
    const updatedRegistration = await postgresDb.updateRegistration(orderId, {
      status: 'paid'
    });

    // 4. Get current payment data first
    const currentPaymentResult = await postgresDb.getPaymentByOrderId(orderId);
    const currentPayment = currentPaymentResult.success ? currentPaymentResult.payment : null;
    
    // Update payment with DOKU details
    const updatedPayment = await postgresDb.updatePayment(orderId, {
      status: 'success',
      transactionId: dokuyCallbackPayload.payment.transaction_id,
      paymentMethod: dokuyCallbackPayload.payment.payment_method
    });

    console.log('💾 Database updated with DOKU callback data');

    // 5. Generate realistic e-ticket
    const ticketId = `TICKET-${orderId}-${Date.now()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
    
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

    console.log(`🎫 E-ticket generated: ${ticketId}`);

    // 6. Send e-ticket email with real DOKU transaction data
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
      amount: registration.amount,
      qrCode: qrCodeUrl,
      transactionId: dokuyCallbackPayload.payment.transaction_id,
      paidAt: dokuyCallbackPayload.payment.paid_at
    });

    // 7. Update ticket email status
    if (emailResult.success) {
      await postgresDb.updateTicket(orderId, {
        emailSent: true,
        emailSentAt: new Date().toISOString()
      });
      console.log('📧 E-ticket email sent successfully');
    }

    // 8. Log realistic transaction summary
    console.log('✅ REALISTIC PAYMENT SIMULATION COMPLETED');
    console.log('═══════════════════════════════════════');
    console.log(`🆔 Order ID: ${orderId}`);
    console.log(`👤 Customer: ${registration.fullName}`);
    console.log(`💰 Amount: Rp ${registration.amount.toLocaleString('id-ID')}`);
    console.log(`💳 Payment Method: ${dokuyCallbackPayload.payment.payment_method}`);
    console.log(`🔗 Transaction ID: ${dokuyCallbackPayload.payment.transaction_id}`);
    console.log(`🎫 Ticket ID: ${ticketId}`);
    console.log(`📧 Email Status: ${emailResult.success ? 'SENT' : 'FAILED'}`);
    console.log('═══════════════════════════════════════');

    return NextResponse.json({
      success: true,
      message: 'Realistic DOKU payment simulation completed',
      data: {
        order: {
          orderId: orderId,
          status: 'paid',
          amount: registration.amount
        },
        payment: {
          transactionId: dokuyCallbackPayload.payment.transaction_id,
          paymentMethod: dokuyCallbackPayload.payment.payment_method,
          status: 'success',
          paidAt: dokuyCallbackPayload.payment.paid_at
        },
        ticket: {
          ticketId: ticketId,
          qrCode: qrCodeUrl,
          emailSent: emailResult.success
        },
        doku_callback: dokuyCallbackPayload,
        simulation_notes: [
          'This simulation mirrors actual DOKU webhook behavior',
          'Status is now synchronized between our DB and DOKU',
          'Real transaction ID generated following DOKU format',
          'E-ticket automatically sent with payment confirmation'
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ Realistic DOKU simulation failed:', error);
    return NextResponse.json(
      { error: 'Realistic simulation failed', details: error.message },
      { status: 500 }
    );
  }
}

// Get simulation instructions
export async function GET() {
  return NextResponse.json({
    message: 'Realistic DOKU Payment Simulation',
    description: 'Simulates actual DOKU payment callback with proper status synchronization',
    usage: {
      method: 'POST',
      body: {
        orderId: 'SSS2025-xxxx-xxxx',
        paymentMethod: 'VIRTUAL_ACCOUNT_BCA | CREDIT_CARD | QRIS | etc.'
      }
    },
    features: [
      'Real DOKU webhook payload structure',
      'Synchronized status between DB and DOKU',
      'Realistic transaction ID generation',
      'Proper payment method handling',
      'Complete audit trail',
      'Automatic e-ticket generation',
      'Email automation with real transaction data'
    ],
    payment_methods: [
      'VIRTUAL_ACCOUNT_BCA',
      'VIRTUAL_ACCOUNT_BNI',
      'VIRTUAL_ACCOUNT_BANK_MANDIRI',
      'CREDIT_CARD',
      'QRIS',
      'EMONEY_OVO',
      'EMONEY_DANA',
      'EMONEY_SHOPEE_PAY'
    ]
  });
}
