import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DOKU Return URL Called ===');
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id') || searchParams.get('invoice_number');
    const status = searchParams.get('status');
    
    console.log('Return URL params:', {
      orderId,
      status,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Log untuk debugging
    console.log(`[${new Date().toISOString()}] RETURN URL - Order: ${orderId}, Status: ${status}`);

    // Determine redirect URL based on status
    let redirectUrl;
    if (status === 'success' || status === 'SUCCESS') {
      redirectUrl = `/register/success?order_id=${orderId}&payment_status=success`;
    } else if (status === 'failed' || status === 'FAILED') {
      redirectUrl = `/register?error=payment_failed&order_id=${orderId}`;
    } else if (status === 'cancelled' || status === 'CANCELLED') {
      redirectUrl = `/register?error=payment_cancelled&order_id=${orderId}`;
    } else {
      // Default to success page with auto-detection
      redirectUrl = `/register/success?order_id=${orderId}`;
    }

    console.log('Redirecting to:', redirectUrl);
    
    return NextResponse.redirect(new URL(redirectUrl, request.url), { status: 302 });

  } catch (error: any) {
    console.error('Return URL error:', error);
    return NextResponse.redirect(new URL('/register?error=return_error', request.url), { status: 302 });
  }
}

// Also handle POST method in case DOKU sends POST
export async function POST(request: NextRequest) {
  return GET(request);
}
