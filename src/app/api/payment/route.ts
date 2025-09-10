import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';

// Doku API Configuration
const DOKU_BASE_URL = process.env.NEXT_PUBLIC_DOKU_BASE_URL || 'https://api-sandbox.doku.com';
const CLIENT_ID = process.env.DOKU_CLIENT_ID || 'your_sandbox_client_id';
const CLIENT_SECRET = process.env.DOKU_CLIENT_SECRET || 'your_sandbox_client_secret';
const MERCHANT_CODE = process.env.DOKU_MERCHANT_CODE || 'your_merchant_code';

// Generate signature for DOKU Checkout API berdasarkan dokumentasi resmi
function generateSignature(requestId: string, requestTimestamp: string, requestTarget: string, requestBody: string) {
  // 1. Generate Digest (SHA256 base64 hash dari request body)
  const digest = crypto.createHash('sha256').update(requestBody, 'utf8').digest('base64');
  
  // 2. Arrange signature components sesuai dokumentasi DOKU
  // Format: Client-Id:value\nRequest-Id:value\nRequest-Timestamp:value\nRequest-Target:value\nDigest:value
  const signatureComponents = `Client-Id:${CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
  
  // 3. Calculate HMAC-SHA256 base64 dari signature components menggunakan Secret Key
  const signature = crypto.createHmac('sha256', CLIENT_SECRET).update(signatureComponents, 'utf8').digest('base64');
  
  console.log('🔐 DOKU Official Signature Generation:');
  console.log('Request Body:', requestBody);
  console.log('Digest (SHA256 base64):', digest);
  console.log('Signature Components:');
  console.log(signatureComponents.replace(/\\n/g, '\n'));
  console.log('Final Signature:', `HMACSHA256=${signature}`);
  
  return `HMACSHA256=${signature}`;
}

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `SSS2025-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DOKU Checkout API Called ===');
    const body = await request.json();
    const { fullName, phone, email, dob, address, country, memberId, ticketQuantity } = body;

    console.log('Request body:', { fullName, phone, email, dob, address, country, memberId, ticketQuantity });
    console.log('Environment variables check:', {
      DOKU_BASE_URL,
      CLIENT_ID: CLIENT_ID?.substring(0, 15) + '...',
      CLIENT_SECRET: CLIENT_SECRET ? 'Set (length: ' + CLIENT_SECRET.length + ')' : 'Not set',
      MERCHANT_CODE: MERCHANT_CODE ? 'Set (length: ' + MERCHANT_CODE.length + ')' : 'Not set'
    });

    // Basic validation
    if (!fullName || !phone || !email || !dob || !address || !memberId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Member ID validation
    const memberIdRegex = /^\d{6,}$/;
    if (!memberIdRegex.test(memberId)) {
      return NextResponse.json(
        { success: false, error: "Member ID must contain at least 6 digits" },
        { status: 400 }
      );
    }

    // Ticket quantity validation
    const quantity = ticketQuantity || 1;
    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { success: false, error: "Ticket quantity must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Calculate total amount based on quantity
    const basePrice = 250000; // IDR 250,000 per ticket
    const totalAmount = basePrice * quantity;

    // Check if environment variables are properly set
    if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === 'your_sandbox_client_id') {
      console.log('⚠️ Environment variables not properly configured, using simulation');
      // Return simulation data
      const orderId = generateOrderId();
      const simulationData = {
        payment_url: `https://sandbox.doku.com/checkout-link-v2/${orderId}`,
        token_id: `${orderId}${Date.now()}`,
        expired_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/[:.]/g, '').slice(0, 14),
        session_id: crypto.randomUUID().replace(/-/g, ''),
        virtual_accounts: [
          { bank: 'BCA', va_number: '01234830768', amount: totalAmount },
          { bank: 'BNI', va_number: '98765694385', amount: totalAmount },
          { bank: 'MANDIRI', va_number: '56789813796', amount: totalAmount }
        ],
        qr_code: {
          qr_string: `doku.payment.${orderId}.${totalAmount}`,
          qr_image_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=doku.payment.${orderId}.${totalAmount}`
        },
        payment_method_types: ['VIRTUAL_ACCOUNT_BCA', 'VIRTUAL_ACCOUNT_BNI', 'VIRTUAL_ACCOUNT_BANK_MANDIRI', 'QRIS', 'CREDIT_CARD']
      };

      return NextResponse.json({ 
        success: true, 
        order_id: orderId,
        amount: totalAmount,
        payment_url: simulationData.payment_url,
        token_id: simulationData.token_id,
        expired_date: simulationData.expired_date,
        payment_type: 'doku_checkout_simulation',
        simulation_data: simulationData,
        customer_info: { fullName, phone, email, dob, address, country, memberId, ticketQuantity: quantity },
        error: 'Environment not configured - using simulation'
      });
    }

    // Prepare Doku API request for Checkout - menggunakan basic request sesuai dokumentasi
    const orderId = generateOrderId();
    const requestId = crypto.randomUUID();
    
    // Use tunnel URL if available, otherwise fallback to base URL
    const publicUrl = process.env.NEXT_PUBLIC_TUNNEL_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    console.log('🌐 Using public URL for DOKU callbacks:', publicUrl);
    
    // Coba berbagai format timestamp
    const timestamp1 = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); // 2020-08-11T08:45:42Z
    const timestamp2 = new Date().toISOString(); // Full ISO format
    const timestamp3 = new Date().toISOString().replace(/[\-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); // 20200811T084542Z
    
    const requestTarget = '/checkout/v1/payment';

    // Gunakan request body dengan informasi customer sesuai dokumentasi DOKU
    const requestBodyWithCustomer = {
      order: {
        amount: totalAmount,
        invoice_number: orderId,
        currency: 'IDR',
        callback_url: `${publicUrl}/register/success?order_id=${orderId}`,
        callback_url_cancel: `${publicUrl}/register?error=payment_cancelled&order_id=${orderId}`
      },
      payment: {
        payment_due_date: 60,
        notification_url: `${publicUrl}/api/payment/callback`,
        return_url: `${publicUrl}/api/payment/return?order_id=${orderId}`
      },
      customer: {
        name: fullName,
        email: email,
        phone: phone,
        address: address,
        country: country === 'Indonesia' ? 'ID' : 
                country === 'Singapore' ? 'SG' :
                country === 'Malaysia' ? 'MY' :
                country === 'Thailand' ? 'TH' :
                country === 'Philippines' ? 'PH' :
                country === 'Vietnam' ? 'VN' :
                country === 'Brunei' ? 'BN' :
                country === 'Cambodia' ? 'KH' :
                country === 'Laos' ? 'LA' :
                country === 'Myanmar' ? 'MM' : 'ID'
      },
      additional_info: {
          integration: 'Synergy SEA Summit 2025',
          close_redirect: `${publicUrl}/register/success?order_id=${orderId}`,
          customer_details: {
          id: `CUST-${orderId}`,
          full_name: fullName,
          email: email,
          phone: phone,
          address: address,
          country: country,
          date_of_birth: dob
        },
        participant_details: {
          full_name: fullName,
          email: email,
          phone: phone,
          date_of_birth: dob,
          address: address,
          country: country,
          event: 'Synergy SEA Summit 2025',
          event_date: '2025-11-08',
          location: 'The Stones Hotel, Legian Bali'
        },
        billing_details: {
          billing_name: fullName,
          billing_email: email,
          billing_phone: phone,
          billing_address: address,
          billing_country: country
        },
        shipping_details: {
          shipping_name: fullName,
          shipping_email: email,
          shipping_phone: phone,
          shipping_address: address,
          shipping_country: country
        },
        event_info: {
          participant_name: fullName,
          participant_email: email,
          participant_phone: phone,
          participant_address: address,
          participant_country: country,
          participant_dob: dob
        }
      },
      override_configuration: {
        theme: {
          color: {
            primary: '#ffc107',
            primary_dark: '#070d2d',
            secondary: '#f8f9fa'
          }
        },
        success_redirect_url: `${publicUrl}/api/payment/return?order_id=${orderId}&status=success`,
        unfinish_redirect_url: `${publicUrl}/api/payment/return?order_id=${orderId}&status=cancelled`,
        error_redirect_url: `${publicUrl}/api/payment/return?order_id=${orderId}&status=failed`,
        // Additional redirect configurations
        finish_redirect_url: `${publicUrl}/api/payment/return?order_id=${orderId}&status=success`,
        return_url: `${publicUrl}/api/payment/return?order_id=${orderId}`
      }
    };

    console.log('🔧 Testing DOKU Request Format with Customer Information...');
    console.log('Request body with customer data:', requestBodyWithCustomer);
    console.log('Timestamp formats:');
    console.log('- Format 1 (Z):', timestamp1);
    console.log('- Format 2 (Full ISO):', timestamp2);  
    console.log('- Format 3 (Compact):', timestamp3);

    // Test dengan request yang sudah termasuk customer information
    const testRequestBody = JSON.stringify(requestBodyWithCustomer);
    const testTimestamp = timestamp1;
    
    // Generate signature dengan format yang berbeda
    const signatures = generateSignature(requestId, testTimestamp, requestTarget, testRequestBody);

    console.log('🚀 DOKU Checkout API Call with OFFICIAL signature format...');

    // Menggunakan signature resmi DOKU
    try {
      console.log('🔐 Testing OFFICIAL DOKU signature format...');
      
      const headers = {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': testTimestamp,
        'Signature': signatures,
      };

      console.log('📤 Request headers:', headers);
      console.log('📤 Request body:', requestBodyWithCustomer);

      const response = await axios.post(
        `${DOKU_BASE_URL}${requestTarget}`,
        requestBodyWithCustomer,
        { 
          headers,
          timeout: 15000
        }
      );

      console.log('✅ DOKU Checkout Success with OFFICIAL format!', response.data);
      
      // Store registration and payment in database
      const registrationData = await postgresDb.createRegistration({
        orderId,
        fullName,
        phone,
        email,
        dob,
        address,
        country,
        memberId,
        ticketQuantity: quantity,
        amount: totalAmount,
        status: 'pending'
      });

      const paymentData = await postgresDb.createPayment({
        order_id: orderId,
        amount: totalAmount,
        status: 'pending',
        payment_data: response.data
      });

      console.log('💾 Registration and payment data stored in database');

      // Send payment confirmation email
      await emailService.sendPaymentConfirmation({
        orderId,
        participantName: fullName,
        participantEmail: email,
        paymentStatus: 'pending',
        amount: totalAmount
      });

      console.log('📧 Payment confirmation email sent');

      // Return payment URL for redirect
      return NextResponse.json({ 
        success: true, 
        order_id: orderId,
        amount: totalAmount,
        payment_url: response.data.response.payment.url,
        token_id: response.data.response.payment.token_id,
        expired_date: response.data.response.payment.expired_date,
        payment_type: 'doku_checkout'
      });

    } catch (error: any) {
      console.log('❌ OFFICIAL format failed:', error.response?.data || error.message);
      console.log('🔄 Fallback to simulation...');
    }
    
    // Jika OFFICIAL format gagal, gunakan enhanced simulation
    console.log('❌ DOKU Checkout failed: Official signature format failed');
    console.log('🔄 Using enhanced simulation fallback...');
    
    const simulationData = {
      payment_url: `https://sandbox.doku.com/checkout-link-v2/${orderId}`,
      token_id: `${orderId}${Date.now()}`,
      expired_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/[:.]/g, '').slice(0, 14),
      session_id: crypto.randomUUID().replace(/-/g, ''),
      virtual_accounts: [
        { bank: 'BCA', va_number: '01234830768', amount: totalAmount },
        { bank: 'BNI', va_number: '98765694385', amount: totalAmount },
        { bank: 'MANDIRI', va_number: '56789813796', amount: totalAmount }
      ],
      qr_code: {
        qr_string: `doku.payment.${orderId}.${totalAmount}`,
        qr_image_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=doku.payment.${orderId}.${totalAmount}`
      },
      payment_method_types: ['VIRTUAL_ACCOUNT_BCA', 'VIRTUAL_ACCOUNT_BNI', 'VIRTUAL_ACCOUNT_BANK_MANDIRI', 'QRIS', 'CREDIT_CARD']
    };

    // Store registration and payment in database even for simulation
    const simulationRegistration = await postgresDb.createRegistration({
      orderId,
      fullName,
      phone,
      email,
      dob,
      address,
      country,
      memberId,
      ticketQuantity: quantity,
      amount: totalAmount,
      status: 'pending'
    });

    const simulationPayment = await postgresDb.createPayment({
      order_id: orderId,
      amount: totalAmount,
      status: 'pending'
    });

    console.log('💾 Simulation registration and payment data stored in database');

    return NextResponse.json({ 
      success: true, 
      order_id: orderId,
      amount: totalAmount,
      payment_url: simulationData.payment_url,
      token_id: simulationData.token_id,
      expired_date: simulationData.expired_date,
      payment_type: 'doku_checkout_simulation',
      simulation_data: simulationData,
      error: 'DOKU API connection failed - using simulation'
    });

  } catch (error: any) {
    console.error('💥 Payment API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
