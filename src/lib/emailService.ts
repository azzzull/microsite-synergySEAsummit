// Email service with multiple providers and backup options
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
  ticketNumber?: number; // For multiple tickets (Ticket 1 of 3, etc.)
  totalTickets?: number; // Total number of tickets ordered
}

export interface EmailMultipleTicketsData {
  orderId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  totalAmount: number;
  transactionId?: string;
  paidAt: string;
  tickets: Array<{
    ticketId: string;
    qrCode: string;
    ticketNumber: number;
  }>;
}

export interface EmailConfirmationData {
  orderId: string;
  participantName: string;
  participantEmail: string;
  paymentStatus: string;
  amount: number;
}

interface EmailProvider {
  name: string;
  transporter: any;
  isConfigured: boolean;
}

class EmailService {
  private providers: EmailProvider[] = [];
  private currentProviderIndex: number = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Provider 1: Primary SMTP - Only initialize if all required env vars are present
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.addProvider('Primary SMTP', {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      console.log('⚠️ Primary SMTP not configured - missing required environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS)');
    }

    // Provider 2: SendGrid (if configured)
    if (process.env.SENDGRID_API_KEY) {
      this.addProvider('SendGrid', {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    }

    // Provider 3: Mailtrap (for testing)
    if (process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS) {
      this.addProvider('Mailtrap', {
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      });
    }

    console.log(`✅ Email service initialized with ${this.providers.length} provider(s)`);
    this.providers.forEach((provider, index) => {
      console.log(`   ${index + 1}. ${provider.name}: ${provider.isConfigured ? '✅ Configured' : '❌ Not configured'}`);
    });
  }

  private addProvider(name: string, config: any) {
    try {
      // Validate all required config fields
      if (config.host && config.auth && config.auth.user && config.auth.pass) {
        const transporter = nodemailer.createTransport(config);
        this.providers.push({
          name,
          transporter,
          isConfigured: true
        });
        console.log(`✅ ${name} configured successfully with host: ${config.host}`);
      } else {
        const missing = [];
        if (!config.host) missing.push('SMTP_HOST');
        if (!config.auth?.user) missing.push('SMTP_USER');
        if (!config.auth?.pass) missing.push('SMTP_PASS');
        console.log(`⚠️ ${name} not configured - missing: ${missing.join(', ')}`);
      }
    } catch (error) {
      console.error(`❌ ${name} initialization failed:`, error);
    }
  }

  private async sendEmailWithFallback(emailContent: any): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> {
    // If no providers configured, use simulation mode
    if (this.providers.length === 0) {
      console.log('📧 EMAIL SIMULATION - No providers configured');
      console.log('📧 To:', emailContent.to);
      console.log('📧 Subject:', emailContent.subject);
      console.log('✅ Email simulation completed');
      return { success: true, messageId: `sim_${Date.now()}`, provider: 'Simulation' };
    }

    // Try each provider in order
    for (let attempt = 0; attempt < this.providers.length; attempt++) {
      const providerIndex = (this.currentProviderIndex + attempt) % this.providers.length;
      const provider = this.providers[providerIndex];

      try {
        console.log(`📧 Attempting to send email via ${provider.name}...`);
        const result = await provider.transporter.sendMail(emailContent);
        console.log(`✅ Email sent successfully via ${provider.name}:`, result.messageId);
        
        // Update current provider to successful one
        this.currentProviderIndex = providerIndex;
        return { 
          success: true, 
          messageId: result.messageId, 
          provider: provider.name 
        };
      } catch (error: any) {
        console.error(`❌ ${provider.name} failed:`, error.message);
        
        // If this was the last provider, return error
        if (attempt === this.providers.length - 1) {
          return { 
            success: false, 
            error: `All email providers failed. Last error: ${error.message}`,
            provider: 'None'
          };
        }
      }
    }

    return { 
      success: false, 
      error: 'No email providers available',
      provider: 'None'
    };
  }

  private generateTicketHTML(data: EmailTicketData): string {
    const ticketInfo = data.totalTickets && data.totalTickets > 1 
      ? `Ticket ${data.ticketNumber} of ${data.totalTickets}` 
      : 'Your Ticket';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Synergy SEA Summit 2025 Ticket</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #04091c, #070d2d); color: white; padding: 30px 20px; text-align: center; }
            .ticket { border: 2px dashed #070d2d; margin: 20px 0; padding: 20px; background: #eef4ff; }
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
                <h1>🎫 ${ticketInfo}</h1>
                <h2>Synergy SEA Summit 2025</h2>
            </div>
            
            <div style="padding: 20px;">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                <p>Thank you for registering for Synergy SEA Summit 2025! Your payment has been confirmed and your ticket is ready.</p>
                
                <div class="ticket">
                    <h3 style="color: #070d2d; margin-top: 0;">TICKET DETAILS</h3>
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
                    ${data.totalTickets && data.totalTickets > 1 ? `
                    <div class="info-row">
                        <span class="label">Ticket Number:</span>
                        <span class="value">${data.ticketNumber} of ${data.totalTickets}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="ticket">
                    <h3 style="color: #070d2d; margin-top: 0;">EVENT DETAILS</h3>
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
                    <h3 style="color: #070d2d;">QR CODE FOR ENTRANCE</h3>
                    <img src="${data.qrCode}" alt="QR Code" style="max-width: 200px;">
                    <p><strong>Important:</strong> Please show this QR code at the event entrance for check-in.</p>
                </div>

                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1976d2;">Important Instructions:</h4>
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

  private generateMultipleTicketsHTML(data: EmailMultipleTicketsData): string {
    const ticketsHTML = data.tickets.map(ticket => `
      <div class="ticket">
        <h3 style="color: #070d2d; margin-top: 0;">TICKET ${ticket.ticketNumber} OF ${data.tickets.length}</h3>
        <div class="info-row">
          <span class="label">Ticket ID:</span>
          <span class="value">${ticket.ticketId}</span>
        </div>
        <div class="qr-section" style="margin: 15px 0;">
          <img src="${ticket.qrCode}" alt="QR Code ${ticket.ticketNumber}" style="max-width: 150px;">
        </div>
      </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Synergy SEA Summit 2025 Tickets</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #04091c, #070d2d); color: white; padding: 30px 20px; text-align: center; }
            .ticket { border: 2px dashed #070d2d; margin: 20px 0; padding: 20px; background: #eef4ff; }
            .qr-section { text-align: center; margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #070d2d; }
            .summary-box { background: #e8f5e8; border: 2px solid #4caf50; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎫 Your ${data.tickets.length} Tickets</h1>
                <h2>Synergy SEA Summit 2025</h2>
            </div>
            
            <div style="padding: 20px;">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                <p>Thank you for registering for Synergy SEA Summit 2025! Your payment has been confirmed and your ${data.tickets.length} tickets are ready.</p>
                
                <div class="summary-box">
                    <h3 style="color: #2e7d32; margin-top: 0;">ORDER SUMMARY</h3>
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
                    <div class="info-row">
                        <span class="label">Total Tickets:</span>
                        <span class="value">${data.tickets.length} tickets</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Total Amount:</span>
                        <span class="value">Rp ${data.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div class="ticket" style="background: #f5f5f5;">
                    <h3 style="color: #070d2d; margin-top: 0;">EVENT DETAILS</h3>
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
                </div>

                <h2 style="color: #070d2d; text-align: center; margin: 30px 0;">YOUR TICKETS</h2>
                ${ticketsHTML}

                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1976d2;">Important Instructions:</h4>
                    <ul>
                        <li>Each ticket has a unique QR code - bring all ${data.tickets.length} tickets to the event</li>
                        <li>Arrive 30 minutes before the event starts</li>
                        <li>Bring a valid ID that matches your registration</li>
                        <li>Save this email or screenshot all QR codes</li>
                        <li>Each ticket allows entry for one person</li>
                        <li>No refunds or transfers allowed</li>
                        <li>For inquiries, contact us at info@synergyseasummit.com</li>
                    </ul>
                </div>

                <p>We look forward to seeing you and your companions at the event!</p>
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

  async sendMultipleTickets(data: EmailMultipleTicketsData): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> {
    try {
      // Prepare attachments for all QR codes
      const attachments = data.tickets.map((ticket, index) => ({
        filename: `ticket-${ticket.ticketNumber}-${ticket.ticketId}.png`,
        path: ticket.qrCode,
        cid: `qrcode-${index + 1}`
      }));

      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@synergyseasummit.com',
        to: data.participantEmail,
        subject: `🎫 Your ${data.tickets.length} Synergy SEA Summit 2025 Tickets - Order ${data.orderId}`,
        html: this.generateMultipleTicketsHTML(data),
        attachments
      };

      console.log(`📧 Sending ${data.tickets.length} tickets email to:`, data.participantEmail);
      const result = await this.sendEmailWithFallback(emailContent);
      
      if (result.success) {
        console.log(`✅ Multiple tickets email sent via ${result.provider}:`, result.messageId);
      } else {
        console.error('❌ Multiple tickets email failed:', result.error);
      }
      
      return result;
    } catch (error: any) {
      console.error('❌ Multiple tickets email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTicket(data: EmailTicketData): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> {
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

      console.log('📧 Sending ticket email to:', data.participantEmail);
      const result = await this.sendEmailWithFallback(emailContent);
      
      if (result.success) {
        console.log(`✅ Ticket email sent via ${result.provider}:`, result.messageId);
      } else {
        console.error('❌ Ticket email failed:', result.error);
      }
      
      return result;
    } catch (error: any) {
      console.error('❌ Ticket email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPaymentConfirmation(data: EmailConfirmationData): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> {
    try {
      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@synergyseasummit.com',
        to: data.participantEmail,
        subject: `Payment ${data.paymentStatus === 'success' ? 'Confirmed' : 'Update'} - Synergy SEA Summit 2025`,
        html: this.generateConfirmationHTML(data)
      };

      console.log('📧 Sending payment confirmation to:', data.participantEmail);
      const result = await this.sendEmailWithFallback(emailContent);
      
      if (result.success) {
        console.log(`✅ Confirmation email sent via ${result.provider}:`, result.messageId);
      } else {
        console.error('❌ Confirmation email failed:', result.error);
      }
      
      return result;
    } catch (error: any) {
      console.error('❌ Confirmation email error:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection(): Promise<boolean> {
    if (this.providers.length === 0) {
      console.log('⚠️ Email service in simulation mode - no providers configured');
      return true;
    }

    try {
      const provider = this.providers[this.currentProviderIndex];
      await provider.transporter.verify();
      console.log(`✅ Email connection verified via ${provider.name}`);
      return true;
    } catch (error) {
      console.error(`❌ Email connection failed via ${this.providers[this.currentProviderIndex]?.name}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
