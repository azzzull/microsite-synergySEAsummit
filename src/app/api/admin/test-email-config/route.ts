import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Test email address is required'
      }, { status: 400 });
    }

    // Test email configuration
    console.log('🔍 Testing email configuration...');
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: 'Email service connection failed',
        details: 'Check your SMTP configuration in environment variables'
      }, { status: 500 });
    }

    // Send test email
    const testResult = await emailService.sendPaymentConfirmation({
      orderId: 'TEST-' + Date.now(),
      participantName: 'Test User',
      participantEmail: testEmail,
      paymentStatus: 'success',
      amount: 250000
    });

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: testResult.messageId,
        provider: testResult.provider || 'Unknown'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: testResult.error
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}