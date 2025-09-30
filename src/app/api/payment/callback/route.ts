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
    'card': 'CREDIT_CARD',
    'visa': 'CREDIT_CARD_VISA',
    'mastercard': 'CREDIT_CARD_MASTERCARD',
    'master': 'CREDIT_CARD_MASTERCARD',
    'jcb': 'CREDIT_CARD_JCB',
    'amex': 'CREDIT_CARD_AMEX',
    'american_express': 'CREDIT_CARD_AMEX',
    
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
    'alfa': 'ALFAMART',
    'online_to_offline_alfa': 'ALFAMART',
    'indomaret': 'INDOMARET',
    'indo': 'INDOMARET',
    'online_to_offline_indomaret': 'INDOMARET',
    
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
  
  // Convenience store patterns - try different variations
  if (lowerChannel.includes('alfamart') || lowerChannel.includes('alfa') || lowerChannel.includes('online_to_offline_alfa')) return 'ALFAMART';
  if (lowerChannel.includes('indomaret') || lowerChannel.includes('indo') || lowerChannel.includes('online_to_offline_indomaret')) return 'INDOMARET';
  
  // Credit card patterns - try different variations  
  if (lowerChannel.includes('visa')) return 'CREDIT_CARD_VISA';
  if (lowerChannel.includes('mastercard') || lowerChannel.includes('master')) return 'CREDIT_CARD_MASTERCARD';
  if (lowerChannel.includes('jcb')) return 'CREDIT_CARD_JCB';
  if (lowerChannel.includes('amex') || lowerChannel.includes('american')) return 'CREDIT_CARD_AMEX';
  if (lowerChannel.includes('credit') || lowerChannel.includes('card')) return 'CREDIT_CARD';
  
  // QRIS patterns
  if (lowerChannel.includes('qris') || lowerChannel.includes('qr')) return 'QRIS';
  
  // E-wallet patterns
  if (lowerChannel.includes('ovo')) return 'OVO';
  if (lowerChannel.includes('dana')) return 'DANA';
  if (lowerChannel.includes('linkaja') || lowerChannel.includes('link')) return 'LINKAJA';
  if (lowerChannel.includes('shopee')) return 'SHOPEEPAY';
  if (lowerChannel.includes('gopay') || lowerChannel.includes('gojek')) return 'GOPAY';
  if (lowerChannel.includes('jenius')) return 'JENIUS';
  if (lowerChannel.includes('sakuku')) return 'SAKUKU';
  if (lowerChannel.includes('tcash')) return 'TCASH';
  if (lowerChannel.includes('isaku')) return 'ISAKU';
  
  // Default fallback
  return `VIRTUAL_ACCOUNT_${channel.toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log("DOKU Payment Callback received");
    
    const body = await request.json();
    console.log("Callback body:", JSON.stringify(body, null, 2));

    const { order, transaction, acquirer, channel, online_to_offline_payment } = body;
    const orderId = order?.invoice_number;
    const paymentStatus = transaction?.status;
    
    // Try multiple possible fields for payment channel
    const paymentChannel = transaction?.payment_channel || 
                          transaction?.channel || 
                          transaction?.payment_method ||
                          transaction?.method ||
                          transaction?.bank_code ||
                          transaction?.acquirer_id ||
                          transaction?.payment_code ||
                          order?.payment_channel ||
                          order?.channel ||
                          order?.payment_method ||
                          channel?.id ||
                          acquirer?.id ||
                          online_to_offline_payment?.identifier?.find((i: any) => i.name === 'AGENT_ID')?.value ||
                          'UNKNOWN';
    
    console.log("Processing payment:", {
      orderId,
      status: paymentStatus,
      amount: order?.amount,
      paymentChannel: paymentChannel,
      acquirerId: acquirer?.id,
      channelId: channel?.id,
      agentId: online_to_offline_payment?.identifier?.find((i: any) => i.name === 'AGENT_ID')?.value,
      fullTransactionData: transaction,
      fullOrderData: order
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
          const ticketQuantity = registration.ticket_quantity || 1;
          // Get dynamic price from database instead of hardcoded value
          const totalAmount = parseInt(order?.amount || "0");

          console.log(`Creating ${ticketQuantity} tickets for order:`, orderId);

          // Generate multiple tickets based on quantity
          const tickets = [];
          const emailTickets = [];

          for (let i = 1; i <= ticketQuantity; i++) {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const ticketId = `TICKET-${orderId}-${i.toString().padStart(2, '0')}-${timestamp}-${randomSuffix}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
            
            // Create ticket record in database
            const ticketResult = await postgresDb.createTicket({
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

            tickets.push({
              ticketId,
              qrCode: qrCodeUrl,
              ticketNumber: i
            });

            console.log(`Ticket ${i}/${ticketQuantity} created:`, ticketId);
          }

          // Send email with all tickets
          console.log(`Sending email with ${ticketQuantity} tickets to:`, registration.email);
          console.log("Email send timestamp:", new Date().toISOString());

          let emailResult;

          if (ticketQuantity === 1) {
            // Send single ticket email
            emailResult = await emailService.sendTicket({
              ticketId: tickets[0].ticketId,
              orderId,
              participantName: registration.fullName,
              participantEmail: registration.email,
              participantPhone: registration.phone,
              eventName: "Synergy SEA Summit 2025",
              eventDate: "November 8, 2025",
              eventTime: "10:00 AM - 05:00 PM WITA",
              eventLocation: "The Stones Hotel, Legian Bali",
              amount: totalAmount,
              qrCode: tickets[0].qrCode,
              transactionId: transaction?.original_request_id,
              paidAt: transaction?.date || new Date().toISOString()
            });
          } else {
            // Send multiple tickets email
            emailResult = await emailService.sendMultipleTickets({
              orderId,
              participantName: registration.fullName,
              participantEmail: registration.email,
              participantPhone: registration.phone,
              eventName: "Synergy SEA Summit 2025",
              eventDate: "November 8, 2025",
              eventTime: "10:00 AM - 05:00 PM WITA",
              eventLocation: "The Stones Hotel, Legian Bali",
              totalAmount: totalAmount,
              transactionId: transaction?.original_request_id,
              paidAt: transaction?.date || new Date().toISOString(),
              tickets: tickets
            });
          }

          console.log("Email send result:", emailResult);

          // Update all tickets status based on email success
          const emailStatus = emailResult.success ? 'email_sent' : 'email_failed';
          for (const ticket of tickets) {
            await postgresDb.updateTicket(orderId, {
              status: emailStatus
            });
          }

          if (emailResult.success) {
            console.log(`E-tickets (${ticketQuantity}) sent successfully to:`, registration.email);
          } else {
            console.error("Failed to send e-tickets email:", emailResult.error);
          }

          console.log("Payment processed successfully for:", orderId);
          
          // Auto redirect to success page after payment completion
          // Determine the correct base URL based on environment
          let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://synergyseasummit.co.id';
          
          // Use production URL if we're in production or if explicitly set
          if (process.env.NODE_ENV === 'production' || process.env.VERCEL_URL) {
            baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL || process.env.NEXT_PUBLIC_DOMAIN || 'https://synergyseasummit.co.id';
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
