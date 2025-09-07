// Email service with multiple providers simulation
import nodemailer from 'nodemailer';

export interface EmailTicketData {
  ticketId: string;
  orderId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  amount: number;
  qrCode: string;
  transactionId?: string;
  paidAt: string;
}

export interface EmailConfirmationData {
  orderId: string;
  participantName: string;
  participantEmail: string;
  paymentStatus: string;
  amount: number;
}

class EmailService {
  private transporter: any;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Check if we have email configuration
      const emailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      };

      if (emailConfig.auth.user && emailConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;
        console.log('✅ Email service configured with SMTP');
      } else {
        console.log('⚠️ Email service not configured - using simulation mode');
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      this.isConfigured = false;
    }
  }

  private generateTicketHTML(data: EmailTicketData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Synergy SEA Summit 2025 Ticket</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #070d2d, #ffc107); color: white; padding: 30px 20px; text-align: center; }
            .ticket { border: 2px dashed #ffc107; margin: 20px 0; padding: 20px; background: #f8f9fa; }
            .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: white; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #070d2d; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎫 Your Event Ticket</h1>
                <h2>Synergy SEA Summit 2025</h2>
            </div>
            
            <div style="padding: 20px;">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                <p>Thank you for registering for Synergy SEA Summit 2025! Your payment has been confirmed and your ticket is ready.</p>
                
                <div class="ticket">
                    <h3 style="color: #070d2d; margin-top: 0;">🎟️ TICKET DETAILS</h3>
                    <div class="info-row">
                        <span class="label">Ticket ID:</span>
                        <span class="value">${data.ticketId}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Order ID:</span>
                        <span class="value">${data.orderId}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Participant:</span>
                        <span class="value">${data.participantName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email:</span>
                        <span class="value">${data.participantEmail}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Phone:</span>
                        <span class="value">${data.participantPhone}</span>
                    </div>
                </div>

                <div class="ticket">
                    <h3 style="color: #070d2d; margin-top: 0;">📅 EVENT DETAILS</h3>
                    <div class="info-row">
                        <span class="label">Event:</span>
                        <span class="value">${data.eventName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Date:</span>
                        <span class="value">${data.eventDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Time:</span>
                        <span class="value">${data.eventTime}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Location:</span>
                        <span class="value">${data.eventLocation}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Amount Paid:</span>
                        <span class="value">Rp ${data.amount.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div class="qr-section">
                    <h3 style="color: #070d2d;">📱 QR CODE FOR ENTRANCE</h3>
                    <img src="${data.qrCode}" alt="QR Code" style="max-width: 200px;">
                    <p><strong>Important:</strong> Please show this QR code at the event entrance for check-in.</p>
                </div>

                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1976d2;">📋 Important Instructions:</h4>
                    <ul>
                        <li>Arrive 30 minutes before the event starts</li>
                        <li>Bring a valid ID that matches your registration</li>
                        <li>Save this email or screenshot the QR code</li>
                        <li>No refunds or transfers allowed</li>
                        <li>For inquiries, contact us at info@synergyseasummit.com</li>
                    </ul>
                </div>

                <p>We look forward to seeing you at the event!</p>
                <p>Best regards,<br>Synergy SEA Summit 2025 Team</p>
            </div>

            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>© 2025 Synergy SEA Summit. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateConfirmationHTML(data: EmailConfirmationData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Confirmation - Synergy SEA Summit 2025</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #070d2d, #ffc107); color: white; padding: 30px 20px; text-align: center; }
            .status-success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .status-pending { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .status-failed { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Payment ${data.paymentStatus === 'success' ? 'Confirmed' : 'Update'}</h1>
                <h2>Synergy SEA Summit 2025</h2>
            </div>
            
            <div style="padding: 20px;">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                
                ${data.paymentStatus === 'success' ? `
                <div class="status-success">
                    <h3>✅ Payment Successful!</h3>
                    <p>Your payment of <strong>Rp ${data.amount.toLocaleString('id-ID')}</strong> has been successfully processed.</p>
                    <p>Order ID: <strong>${data.orderId}</strong></p>
                </div>
                <p>Your e-ticket will be sent in a separate email shortly.</p>
                ` : `
                <div class="status-pending">
                    <h3>⏳ Payment Status: ${data.paymentStatus.toUpperCase()}</h3>
                    <p>Order ID: <strong>${data.orderId}</strong></p>
                    <p>Amount: <strong>Rp ${data.amount.toLocaleString('id-ID')}</strong></p>
                </div>
                `}
                
                <p>Thank you for registering for Synergy SEA Summit 2025!</p>
                <p>Best regards,<br>Synergy SEA Summit 2025 Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendTicket(data: EmailTicketData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@synergyseasummit.com',
        to: data.participantEmail,
        subject: `🎫 Your Synergy SEA Summit 2025 Ticket - ${data.ticketId}`,
        html: this.generateTicketHTML(data),
        attachments: [
          {
            filename: `ticket-${data.ticketId}.png`,
            path: data.qrCode,
            cid: 'qrcode'
          }
        ]
      };

      if (this.isConfigured) {
        console.log('📧 Sending actual email to:', data.participantEmail);
        const result = await this.transporter.sendMail(emailContent);
        console.log('✅ Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else {
        // Simulation mode
        console.log('📧 EMAIL SIMULATION - Ticket email would be sent to:', data.participantEmail);
        console.log('🎫 Subject:', emailContent.subject);
        console.log('📝 Ticket ID:', data.ticketId);
        console.log('💰 Amount:', `Rp ${data.amount.toLocaleString('id-ID')}`);
        console.log('📅 Event Date:', data.eventDate);
        console.log('📍 Location:', data.eventLocation);
        console.log('✅ Email simulation completed');
        
        return { success: true, messageId: `sim_${Date.now()}` };
      }
    } catch (error: any) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPaymentConfirmation(data: EmailConfirmationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@synergyseasummit.com',
        to: data.participantEmail,
        subject: `Payment ${data.paymentStatus === 'success' ? 'Confirmed' : 'Update'} - Synergy SEA Summit 2025`,
        html: this.generateConfirmationHTML(data)
      };

      if (this.isConfigured) {
        console.log('📧 Sending payment confirmation to:', data.participantEmail);
        const result = await this.transporter.sendMail(emailContent);
        console.log('✅ Confirmation email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else {
        // Simulation mode
        console.log('📧 EMAIL SIMULATION - Payment confirmation would be sent to:', data.participantEmail);
        console.log('💳 Status:', data.paymentStatus);
        console.log('🆔 Order ID:', data.orderId);
        console.log('💰 Amount:', `Rp ${data.amount.toLocaleString('id-ID')}`);
        console.log('✅ Confirmation simulation completed');
        
        return { success: true, messageId: `sim_conf_${Date.now()}` };
      }
    } catch (error: any) {
      console.error('❌ Confirmation email failed:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('⚠️ Email service in simulation mode');
      return true;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
