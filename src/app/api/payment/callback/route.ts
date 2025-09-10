import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';

// Helper function to map payment channel to readable payment method
function getPaymentMethodFromChannel(channel: string): string {
  const channelMappings: { [key: string]: string } = {
    // Virtual Account - Major Banks
    'virtual_account_bca': 'VIRTUAL_ACCOUNT_BCA',
    'virtual_account_mandiri': 'VIRTUAL_ACCOUNT_MANDIRI', 
    'virtual_account_bni': 'VIRTUAL_ACCOUNT_BNI',
    'virtual_account_bri': 'VIRTUAL_ACCOUNT_BRI',
    'virtual_account_bsi': 'VIRTUAL_ACCOUNT_BSI',
    'virtual_account_syariah': 'VIRTUAL_ACCOUNT_BSI',
    
    // Virtual Account - Other Banks
    'virtual_account_permata': 'VIRTUAL_ACCOUNT_PERMATA',
    'virtual_account_cimb': 'VIRTUAL_ACCOUNT_CIMB',
    'virtual_account_danamon': 'VIRTUAL_ACCOUNT_DANAMON',
    'virtual_account_maybank': 'VIRTUAL_ACCOUNT_MAYBANK',
    'virtual_account_btn': 'VIRTUAL_ACCOUNT_BTN',
    'virtual_account_btpn': 'VIRTUAL_ACCOUNT_BTPN',
    'virtual_account_mega': 'VIRTUAL_ACCOUNT_MEGA',
    'virtual_account_panin': 'VIRTUAL_ACCOUNT_PANIN',
    'virtual_account_ocbc': 'VIRTUAL_ACCOUNT_OCBC',
    'virtual_account_uob': 'VIRTUAL_ACCOUNT_UOB',
    'virtual_account_hsbc': 'VIRTUAL_ACCOUNT_HSBC',
    'virtual_account_sinarmas': 'VIRTUAL_ACCOUNT_SINARMAS',
    'virtual_account_bjb': 'VIRTUAL_ACCOUNT_BJB',
    'virtual_account_dki': 'VIRTUAL_ACCOUNT_DKI',
    'virtual_account_jateng': 'VIRTUAL_ACCOUNT_JATENG',
    'virtual_account_jatim': 'VIRTUAL_ACCOUNT_JATIM',
    'virtual_account_jabar': 'VIRTUAL_ACCOUNT_JABAR',
    'virtual_account_sumut': 'VIRTUAL_ACCOUNT_SUMUT',
    'virtual_account_sumsel': 'VIRTUAL_ACCOUNT_SUMSEL',
    'virtual_account_riau': 'VIRTUAL_ACCOUNT_RIAU',
    'virtual_account_kalbar': 'VIRTUAL_ACCOUNT_KALBAR',
    'virtual_account_kaltim': 'VIRTUAL_ACCOUNT_KALTIM',
    'virtual_account_sulsel': 'VIRTUAL_ACCOUNT_SULSEL',
    'virtual_account_bali': 'VIRTUAL_ACCOUNT_BALI',
    'virtual_account_ntt': 'VIRTUAL_ACCOUNT_NTT',
    'virtual_account_ntb': 'VIRTUAL_ACCOUNT_NTB',
    'virtual_account_maluku': 'VIRTUAL_ACCOUNT_MALUKU',
    'virtual_account_papua': 'VIRTUAL_ACCOUNT_PAPUA',
    
    // QRIS
    'qris': 'QRIS',
    
    // Credit Card
    'credit_card': 'CREDIT_CARD',
    'visa': 'CREDIT_CARD_VISA',
    'mastercard': 'CREDIT_CARD_MASTERCARD',
    'jcb': 'CREDIT_CARD_JCB',
    'amex': 'CREDIT_CARD_AMEX',
    
    // E-Wallets
    'ovo': 'OVO',
    'dana': 'DANA',
    'linkaja': 'LINKAJA',
    'shopeepay': 'SHOPEEPAY',
    'gopay': 'GOPAY',
    'jenius': 'JENIUS',
    'sakuku': 'SAKUKU',
    'tcash': 'TCASH',
    'isaku': 'ISAKU',
    
    // Convenience Store
    'alfamart': 'ALFAMART',
    'indomaret': 'INDOMARET',
    
    // ATM Bersama
    'atm_bersama': 'ATM_BERSAMA',
    'alto': 'ALTO',
    'prima': 'PRIMA'
  };

  // Try to find exact match first
  const lowerChannel = channel.toLowerCase();
  if (channelMappings[lowerChannel]) {
    return channelMappings[lowerChannel];
  }

  // Try to match partial patterns for VA
  if (lowerChannel.includes('mandiri')) return 'VIRTUAL_ACCOUNT_MANDIRI';
  if (lowerChannel.includes('bca')) return 'VIRTUAL_ACCOUNT_BCA';
  if (lowerChannel.includes('bni')) return 'VIRTUAL_ACCOUNT_BNI';
  if (lowerChannel.includes('bri')) return 'VIRTUAL_ACCOUNT_BRI';
  if (lowerChannel.includes('bsi') || lowerChannel.includes('syariah')) return 'VIRTUAL_ACCOUNT_BSI';
  if (lowerChannel.includes('permata')) return 'VIRTUAL_ACCOUNT_PERMATA';
  if (lowerChannel.includes('cimb')) return 'VIRTUAL_ACCOUNT_CIMB';
  if (lowerChannel.includes('danamon')) return 'VIRTUAL_ACCOUNT_DANAMON';
  if (lowerChannel.includes('maybank')) return 'VIRTUAL_ACCOUNT_MAYBANK';
  if (lowerChannel.includes('btn')) return 'VIRTUAL_ACCOUNT_BTN';
  if (lowerChannel.includes('btpn')) return 'VIRTUAL_ACCOUNT_BTPN';
  if (lowerChannel.includes('mega')) return 'VIRTUAL_ACCOUNT_MEGA';
  if (lowerChannel.includes('panin')) return 'VIRTUAL_ACCOUNT_PANIN';
  if (lowerChannel.includes('ocbc')) return 'VIRTUAL_ACCOUNT_OCBC';
  if (lowerChannel.includes('uob')) return 'VIRTUAL_ACCOUNT_UOB';
  if (lowerChannel.includes('hsbc')) return 'VIRTUAL_ACCOUNT_HSBC';
  if (lowerChannel.includes('sinarmas')) return 'VIRTUAL_ACCOUNT_SINARMAS';
  if (lowerChannel.includes('bjb')) return 'VIRTUAL_ACCOUNT_BJB';
  if (lowerChannel.includes('dki')) return 'VIRTUAL_ACCOUNT_DKI';
  if (lowerChannel.includes('jateng')) return 'VIRTUAL_ACCOUNT_JATENG';
  if (lowerChannel.includes('jatim')) return 'VIRTUAL_ACCOUNT_JATIM';
  if (lowerChannel.includes('jabar')) return 'VIRTUAL_ACCOUNT_JABAR';
  if (lowerChannel.includes('sumut')) return 'VIRTUAL_ACCOUNT_SUMUT';
  if (lowerChannel.includes('sumsel')) return 'VIRTUAL_ACCOUNT_SUMSEL';
  if (lowerChannel.includes('riau')) return 'VIRTUAL_ACCOUNT_RIAU';
  if (lowerChannel.includes('kalbar')) return 'VIRTUAL_ACCOUNT_KALBAR';
  if (lowerChannel.includes('kaltim')) return 'VIRTUAL_ACCOUNT_KALTIM';
  if (lowerChannel.includes('sulsel')) return 'VIRTUAL_ACCOUNT_SULSEL';
  if (lowerChannel.includes('bali')) return 'VIRTUAL_ACCOUNT_BALI';
  if (lowerChannel.includes('qris')) return 'QRIS';
  if (lowerChannel.includes('visa')) return 'CREDIT_CARD_VISA';
  if (lowerChannel.includes('mastercard')) return 'CREDIT_CARD_MASTERCARD';
  if (lowerChannel.includes('jcb')) return 'CREDIT_CARD_JCB';
  if (lowerChannel.includes('amex')) return 'CREDIT_CARD_AMEX';
  if (lowerChannel.includes('credit')) return 'CREDIT_CARD';
  if (lowerChannel.includes('ovo')) return 'OVO';
  if (lowerChannel.includes('dana')) return 'DANA';
  if (lowerChannel.includes('linkaja')) return 'LINKAJA';
  if (lowerChannel.includes('shopee')) return 'SHOPEEPAY';
  if (lowerChannel.includes('gopay')) return 'GOPAY';
  if (lowerChannel.includes('jenius')) return 'JENIUS';
  if (lowerChannel.includes('sakuku')) return 'SAKUKU';
  if (lowerChannel.includes('tcash')) return 'TCASH';
  if (lowerChannel.includes('isaku')) return 'ISAKU';
  if (lowerChannel.includes('alfamart')) return 'ALFAMART';
  if (lowerChannel.includes('indomaret')) return 'INDOMARET';
  
  // Default fallback
  return `VIRTUAL_ACCOUNT_${channel.toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log("DOKU Payment Callback received");
    
    const body = await request.json();
    console.log("Callback body:", JSON.stringify(body, null, 2));

    const { order, transaction } = body;
    const orderId = order?.invoice_number;
    const paymentStatus = transaction?.status;
    const paymentChannel = transaction?.payment_channel || transaction?.channel || 'UNKNOWN';
    
    console.log("Processing payment:", {
      orderId,
      status: paymentStatus,
      amount: order?.amount,
      paymentChannel: paymentChannel,
      fullTransactionData: transaction
    });
    
    if (paymentStatus === "SUCCESS" && orderId) {
      console.log("Payment successful for order:", orderId);
      
      try {
        // Check if ticket already exists to prevent duplicate processing
        const existingTickets = await postgresDb.getTickets();
        const existingTicket = existingTickets.tickets.find((ticket: any) => ticket.orderId === orderId);
        
        if (existingTicket) {
          console.log("Ticket already exists for order:", orderId, "- skipping duplicate processing");
          return NextResponse.json({ 
            message: "Payment already processed",
            status: "ALREADY_PROCESSED",
            orderId,
            existingTicketId: existingTicket.ticketId
          });
        }

        // Update registration status
        const registrationResult = await postgresDb.updateRegistration(orderId, {
          status: "paid"
        });

        // Update payment record
        await postgresDb.updatePayment(orderId, {
          status: "success",
          transactionId: transaction?.original_request_id,
          paymentMethod: getPaymentMethodFromChannel(paymentChannel),
          paidAt: transaction?.date || new Date().toISOString()
        });

        if (registrationResult.success && registrationResult.registration) {
          const registration = registrationResult.registration as any;

          // Generate e-ticket
          const ticketId = `TICKET-${orderId}-${Date.now()}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
          
          // Create ticket record
          await postgresDb.createTicket({
            ticketId,
            orderId,
            participantName: registration.fullName,
            participantEmail: registration.email,
            participantPhone: registration.phone,
            eventName: "Synergy SEA Summit 2025",
            eventDate: "November 8, 2025",
            eventLocation: "The Stones Hotel, Legian Bali",
            qrCode: qrCodeUrl,
            emailSent: false
          });

          // Send e-ticket email
          console.log("Sending e-ticket email to:", registration.email);
          console.log("Email send timestamp:", new Date().toISOString());
          const emailResult = await emailService.sendTicket({
            ticketId,
            orderId,
            participantName: registration.fullName,
            participantEmail: registration.email,
            participantPhone: registration.phone,
            eventName: "Synergy SEA Summit 2025",
            eventDate: "November 8, 2025",
            eventTime: "09:00 AM - 05:00 PM WITA",
            eventLocation: "The Stones Hotel, Legian Bali",
            amount: parseInt(order?.amount || "250000"),
            qrCode: qrCodeUrl,
            transactionId: transaction?.original_request_id,
            paidAt: transaction?.date || new Date().toISOString()
          });

          console.log("Email send result:", emailResult);

          // Note: Email status tracking disabled due to database schema limitations
          // Update ticket status based on email success
          if (emailResult.success) {
            await postgresDb.updateTicket(orderId, {
              status: 'email_sent'
            });
            console.log("E-ticket sent successfully to:", registration.email);
          } else {
            console.error("Failed to send e-ticket email:", emailResult.error);
            await postgresDb.updateTicket(orderId, {
              status: 'email_failed'
            });
          }

          console.log("Payment processed successfully for:", orderId);
          
          // Auto redirect to success page after payment completion
          // Determine the correct base URL based on environment
          let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          
          // Use production URL if we're in production or if explicitly set
          if (process.env.NODE_ENV === 'production' || process.env.VERCEL_URL) {
            baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://synergy-sea-summit2025.vercel.app';
          }
          
          const successUrl = `${baseUrl}/register/success?order_id=${orderId}`;
          
          console.log("Environment:", process.env.NODE_ENV);
          console.log("Base URL used:", baseUrl);
          console.log("Redirecting to:", successUrl);
          
          return NextResponse.redirect(successUrl, { status: 302 });
        } else {
          console.log("Registration not found for order:", orderId);
          return NextResponse.json({ 
            message: "Registration not found",
            status: "ERROR",
            orderId
          });
        }
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        return NextResponse.json({ 
          message: "Database error during payment processing",
          status: "ERROR",
          orderId,
          error: dbError.message
        });
      }
    } else {
      console.log("Payment not successful or missing order ID:", { 
        paymentStatus, 
        orderId 
      });
      return NextResponse.json({ 
        message: "Payment notification received but not processed",
        status: paymentStatus || "UNKNOWN",
        orderId: orderId || "MISSING"
      });
    }

  } catch (error: any) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { 
        error: "Callback processing failed", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "DOKU Payment Callback Endpoint",
    status: "active",
    timestamp: new Date().toISOString()
  });
}
