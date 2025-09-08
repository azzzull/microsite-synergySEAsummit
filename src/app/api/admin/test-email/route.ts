import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';

export async function GET() {
  try {
    console.log('🧪 Testing email service connection...');
    
    const isConnected = await emailService.testConnection();
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      message: isConnected 
        ? 'Email service is working properly' 
        : 'Email service not configured or connection failed',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Email test failed:', error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'test' } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Sending test email to:', email);

    if (type === 'ticket') {
      // Send test ticket email
      const testTicketData = {
        ticketId: 'TEST-TICKET-' + Date.now(),
        orderId: 'TEST-ORDER-' + Date.now(),
        participantName: 'Test Participant',
        participantEmail: email,
        participantPhone: '+62812345678',
        eventName: 'Synergy SEA Summit 2025',
        eventDate: 'November 8, 2025',
        eventTime: '09:00 AM - 05:00 PM WITA',
        eventLocation: 'The Stones Hotel, Legian Bali',
        amount: 250000,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TEST-TICKET',
        transactionId: 'TEST-TRANSACTION-' + Date.now(),
        paidAt: new Date().toISOString()
      };

      const result = await emailService.sendTicket(testTicketData);
      
      return NextResponse.json({
        success: result.success,
        type: 'ticket',
        email,
        messageId: result.messageId,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    } else {
      // Send test confirmation email
      const testConfirmationData = {
        orderId: 'TEST-ORDER-' + Date.now(),
        participantName: 'Test Participant',
        participantEmail: email,
        paymentStatus: 'success',
        amount: 250000
      };

      const result = await emailService.sendPaymentConfirmation(testConfirmationData);
      
      return NextResponse.json({
        success: result.success,
        type: 'confirmation',
        email,
        messageId: result.messageId,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
