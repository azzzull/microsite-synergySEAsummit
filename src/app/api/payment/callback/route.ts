import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    console.log("DOKU Payment Callback received");
    
    const body = await request.json();
    console.log("Callback body:", JSON.stringify(body, null, 2));

    const { order, transaction } = body;
    const orderId = order?.invoice_number;
    const paymentStatus = transaction?.status;
    
    console.log("Processing payment:", {
      orderId,
      status: paymentStatus,
      amount: order?.amount
    });
    
    if (paymentStatus === "SUCCESS" && orderId) {
      console.log("Payment successful for order:", orderId);
      
      try {
        // Update registration status
        const registrationResult = await postgresDb.updateRegistration(orderId, {
          status: "paid"
        });

        // Update payment record
        await postgresDb.updatePayment(orderId, {
          status: "success",
          transactionId: transaction?.original_request_id,
          paymentMethod: "VIRTUAL_ACCOUNT_BCA",
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

          // Update ticket email status
          if (emailResult.success) {
            await postgresDb.updateTicket(orderId, {
              emailSent: true,
              emailSentAt: new Date().toISOString()
            });
            console.log("E-ticket sent successfully");
          }

          console.log("Payment processed successfully for:", orderId);
          
          return NextResponse.json({ 
            message: "Payment notification processed successfully",
            status: "SUCCESS",
            orderId,
            redirect_url: `https://synergy-sea-summit2025.vercel.app/register/success?order_id=${orderId}`
          });
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
