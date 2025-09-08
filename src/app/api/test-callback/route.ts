import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers;
    
    console.log('🔔 TEST Callback received');
    console.log('📥 Headers:', {
      'x-signature': headers.get('x-signature'),
      'x-timestamp': headers.get('x-timestamp'),
      'client-id': headers.get('client-id')
    });
    console.log('📥 Body:', body);

    // For sandbox mode, headers might be missing - log but continue processing
    const signature = headers.get('x-signature');
    const timestamp = headers.get('x-timestamp');
    
    if (!signature || !timestamp) {
      console.log('⚠️ Missing signature headers (sandbox mode) - continuing...');
      
      // Process payment notification - handle DOKU Jokul format
      const { order, transaction } = body;
      const orderId = order?.invoice_number;
      const paymentStatus = transaction?.status;
      
      if (paymentStatus === 'SUCCESS') {
        return NextResponse.json({ 
          message: 'Test callback processed successfully',
          status: 'SUCCESS',
          orderId,
          deploymentTime: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ 
      message: 'Test callback received but not processed',
      status: 'PENDING',
      deploymentTime: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Test callback error:', error);
    return NextResponse.json(
      { error: 'Test callback failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test callback endpoint',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
