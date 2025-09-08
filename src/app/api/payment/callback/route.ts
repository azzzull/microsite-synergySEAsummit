import { NextRequest, NextResponse } from "next/server";
import { postgresDb } from "@/lib/postgresDatabase";
import { emailService } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    console.log("DOKU Payment Callback received");
    
    const body = await request.json();
    console.log("Callback body:", JSON.stringify(body, null, 2));

    const { order, transaction } = body;
    const orderId = order?.invoice_number;
    const paymentStatus = transaction?.status;
    
    if (paymentStatus === "SUCCESS" && orderId) {
      console.log("Payment successful for order:", orderId);
      
      try {
        const registrationResult = await postgresDb.updateRegistration(orderId, {
          status: "paid"
        });

        await postgresDb.updatePayment(orderId, {
          status: "success",
          transactionId: transaction?.original_request_id,
          paymentMethod: "VIRTUAL_ACCOUNT_BCA",
          paidAt: transaction?.date || new Date().toISOString()
        });

        if (registrationResult.success && registrationResult.registration) {
          const registration = registrationResult.registration as any;

          const ticketId = `TICKET-${orderId}-${Date.now()}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
          
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

          if (emailResult.success) {
            await postgresDb.updateTicket(orderId, {
              emailSent: true,
              emailSentAt: new Date().toISOString()
            });
          }

          return NextResponse.json({ 
            message: "Payment notification processed successfully",
            status: "SUCCESS",
            orderId
          });
        } else {
          return NextResponse.json({ 
            message: "Registration not found",
            status: "ERROR",
            orderId
          });
        }
      } catch (dbError: any) {
        return NextResponse.json({ 
          message: "Database error during payment processing",
          status: "ERROR",
          orderId,
          error: dbError.message
        });
      }
    } else {
      return NextResponse.json({ 
        message: "Payment notification received but not processed",
        status: paymentStatus || "UNKNOWN",
        orderId: orderId || "MISSING"
      });
    }

  } catch (error: any) {
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
