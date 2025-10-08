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
    // Note: testConnection method not available, proceeding with test email
    
    // Send test email
    const testResult = await emailService.sendConfirmationEmail({
      orderId: 'TEST-' + Date.now(),
      participantName: 'Test User',
      participantEmail: testEmail,
      paymentStatus: 'success',
      amount: 250000
    });

    if (testResult) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        provider: 'EmailService'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: 'Email service returned false'
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