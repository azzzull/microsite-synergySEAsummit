// Email service with multiple providers and backup options
import * as nodemailer from 'nodemailer';

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
  amount: number;
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

export interface EmailComplimentaryTicketData {
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
  ticketId: string;
  ticketNumber?: number;
  totalTickets?: number;
}

interface EmailProvider {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  replyTo?: string;
}

export class EmailService {
  private providers: EmailProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    console.log('🔧 Initializing email providers...');
    
    // Primary provider: Gmail (support both new and legacy variable names)
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    
    console.log('📧 Checking Gmail configuration:');
    console.log(`   - User: ${gmailUser ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - Pass: ${gmailPass ? '✅ Set' : '❌ Missing'}`);
    
    if (gmailUser && gmailPass) {
      this.providers.push({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPass
        },
        from: `"Synergy SEA Summit 2025" <${gmailUser}>`,
        replyTo: process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'
      });
      console.log('✅ Gmail SMTP provider configured successfully');
    } else {
      console.log('❌ Gmail SMTP provider not configured (missing credentials)');
    }

    // Backup provider: SMTP2GO
    if (process.env.SMTP2GO_USERNAME && process.env.SMTP2GO_PASSWORD) {
      this.providers.push({
        host: 'mail.smtp2go.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP2GO_USERNAME,
          pass: process.env.SMTP2GO_PASSWORD
        },
        from: `"Synergy SEA Summit 2025" <${process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'}>`,
        replyTo: process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'
      });
      console.log('✅ SMTP2GO provider configured');
    }

    // Backup provider: Outlook/Hotmail
    if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
      this.providers.push({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASSWORD
        },
        from: `"Synergy SEA Summit 2025" <${process.env.OUTLOOK_USER}>`,
        replyTo: process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'
      });
      console.log('✅ Outlook SMTP provider configured');
    }

    if (this.providers.length === 0) {
      console.warn('⚠️  No email providers configured. Email functionality will not work.');
      console.warn('📧 Required environment variables:');
      console.warn('   - Gmail: GMAIL_USER, GMAIL_APP_PASSWORD');
      console.warn('   - SMTP2GO: SMTP2GO_USERNAME, SMTP2GO_PASSWORD');
      console.warn('   - Outlook: OUTLOOK_USER, OUTLOOK_PASSWORD');
    } else {
      console.log(`✅ Initialized ${this.providers.length} email provider(s)`);
    }
  }

  private async createTransporter(provider: EmailProvider) {
    console.log(`🔧 Creating transporter for ${provider.host}...`);
    console.log(`   User: ${provider.auth.user}`);
    
    const transporterConfig: any = {
      host: provider.host,
      port: provider.port,
      secure: provider.secure || false,
      auth: provider.auth,
      tls: {
        rejectUnauthorized: false
      }
    };

    // Gmail specific settings
    if (provider.host === 'smtp.gmail.com') {
      transporterConfig.service = 'gmail';
      console.log('   Using Gmail service configuration');
    }

    const transporter = nodemailer.createTransport(transporterConfig);
    console.log(`✅ Transporter created for ${provider.host}`);
    return transporter;
  }

  private async sendEmailWithProvider(providerIndex: number, mailOptions: any): Promise<boolean> {
    try {
      const provider = this.providers[providerIndex];
      console.log(`📤 Attempting to send email via ${provider.host} (${provider.auth.user})`);
      
      const transporter = await this.createTransporter(provider);
      
      const enrichedMailOptions = {
        ...mailOptions,
        from: provider.from,
        replyTo: provider.replyTo
      };

      console.log(`📧 Sending email to: ${enrichedMailOptions.to}`);
      console.log(`📧 Subject: ${enrichedMailOptions.subject}`);
      
      const info = await transporter.sendMail(enrichedMailOptions);
      console.log(`✅ Email sent successfully via ${provider.host}:`, info.messageId);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email via provider ${providerIndex} (${this.providers[providerIndex]?.host}):`, error);
      return false;
    }
  }

  private async sendWithFallback(mailOptions: any): Promise<boolean> {
    if (this.providers.length === 0) {
      console.error('❌ No email providers configured. Cannot send email.');
      console.error('📧 Would have sent email to:', mailOptions.to);
      console.error('📧 Subject:', mailOptions.subject);
      return false;
    }

    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.currentProviderIndex + i) % this.providers.length;
      const success = await this.sendEmailWithProvider(providerIndex, mailOptions);
      
      if (success) {
        this.currentProviderIndex = providerIndex;
        return true;
      }
    }
    
    console.error('All email providers failed');
    return false;
  }

  async sendTicketEmail(data: EmailTicketData): Promise<boolean> {
    try {
      const html = this.generateTicketHTML(data);
      
      const mailOptions = {
        to: data.participantEmail,
        subject: `🎫 Your Synergy SEA Summit 2025 Ticket - ${data.ticketId}`,
        html,
        attachments: []
      };

      return await this.sendWithFallback(mailOptions);
    } catch (error) {
      console.error('Error sending ticket email:', error);
      return false;
    }
  }

  async sendMultipleTicketsEmail(data: EmailMultipleTicketsData): Promise<boolean> {
    try {
      const html = this.generateMultipleTicketsHTML(data);
      
      const mailOptions = {
        to: data.participantEmail,
        subject: `🎫 Your ${data.tickets.length} Synergy SEA Summit 2025 Tickets - Order ${data.orderId}`,
        html,
        attachments: []
      };

      return await this.sendWithFallback(mailOptions);
    } catch (error) {
      console.error('Error sending multiple tickets email:', error);
      return false;
    }
  }

  async sendConfirmationEmail(data: EmailConfirmationData): Promise<boolean> {
    try {
      const html = this.generateConfirmationHTML(data);
      
      const mailOptions = {
        to: data.participantEmail,
        subject: `Payment Confirmation - Synergy SEA Summit 2025 - Order ${data.orderId}`,
        html
      };

      return await this.sendWithFallback(mailOptions);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  async sendComplimentaryTicketEmail(data: EmailComplimentaryTicketData): Promise<boolean> {
    try {
      const ticketData: EmailTicketData = {
        ticketId: data.ticketId,
        orderId: data.orderId,
        participantName: data.participantName,
        participantEmail: data.participantEmail,
        participantPhone: data.participantPhone,
        eventName: data.eventName,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        eventLocation: data.eventLocation,
        amount: data.amount,
        qrCode: data.qrCode,
        paidAt: new Date().toISOString(),
        ticketNumber: data.ticketNumber,
        totalTickets: data.totalTickets
      };

      const html = this.generateComplimentaryTicketHTML(ticketData);
      
      const mailOptions = {
        to: data.participantEmail,
        subject: `🎫 Your Complimentary Synergy SEA Summit 2025 Ticket - ${data.ticketId}`,
        html
      };

      return await this.sendWithFallback(mailOptions);
    } catch (error) {
      console.error('Error sending complimentary ticket email:', error);
      return false;
    }
  }

  private generateTicketHTML(data: EmailTicketData): string {
    const ticketInfo = data.totalTickets && data.totalTickets > 1 
      ? `Ticket ${data.ticketNumber} of ${data.totalTickets}` 
      : 'Your Ticket';
    
    const headerStyle = 'background: linear-gradient(135deg, #04091c, #070d2d);';
    const ticketStyle = 'border: 2px dashed #070d2d; background: #eef4ff;';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Synergy SEA Summit 2025 Ticket</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { ${headerStyle} color: #eef4ff; padding: 30px 20px; text-align: center; border-radius: 10px; }
            .ticket { ${ticketStyle} margin: 20px 0; padding: 20px; border-radius: 10px; }
            .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
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
                        <li>For inquiries, contact us at ${process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'}</li>
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
    const headerStyle = 'background: linear-gradient(135deg, #04091c, #070d2d);';
    const ticketStyle = 'border: 2px dashed #070d2d; background: #eef4ff;';

    const ticketsHTML = data.tickets.map(ticket => `
      <div class="ticket" style="${ticketStyle}">
        <h3 style="color: #070d2d; margin-top: 0;">TICKET ${ticket.ticketNumber} OF ${data.tickets.length}</h3>
        <div class="info-row">
          <span class="label">Ticket ID:</span>
          <span class="value">${ticket.ticketId}</span>
        </div>
        <div class="qr-section" style="margin: 15px 0; text-align: center; padding: 15px; background: white; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h4 style="color: #070d2d; margin: 0 0 10px 0;">QR Code ${ticket.ticketNumber}</h4>
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
            .header { ${headerStyle} color: #eef4ff; padding: 30px 20px; text-align: center; border-radius: 10px; }
            .ticket { ${ticketStyle} margin: 20px 0; padding: 20px; border-radius: 10px; }
            .qr-section { text-align: center; margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #070d2d; }
            .summary-box { 
              background: #e8f5e8; border: 2px solid #4caf50;
              padding: 20px; border-radius: 8px; margin: 20px 0; 
            }
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
                        <span class="value">${data.tickets.length}</span>
                    </div>
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
                        <span class="label">Total Amount:</span>
                        <span class="value">Rp ${data.amount.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                ${ticketsHTML}

                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1976d2;">Important Instructions:</h4>
                    <ul>
                        <li>Show each individual QR code for each participant at the entrance</li>
                        <li>Arrive 30 minutes before the event starts</li>
                        <li>Each participant must bring valid ID for verification</li>
                        <li>Save this email or screenshot the QR codes</li>
                        <li>No refunds or transfers allowed</li>
                        <li>For inquiries, contact us at ${process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'}</li>
                    </ul>
                </div>

                <p>We look forward to seeing all participants at the event!</p>
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

  private generateComplimentaryTicketHTML(data: EmailTicketData): string {
    const ticketInfo = data.totalTickets && data.totalTickets > 1 
      ? `Complimentary Ticket ${data.ticketNumber} of ${data.totalTickets}` 
      : 'Your Complimentary Ticket';
    
    const headerStyle = 'background: linear-gradient(135deg, #04091c, #070d2d);';
    const ticketStyle = 'border: 2px dashed #070d2d; background: #eef4ff;';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Complimentary Synergy SEA Summit 2025 Ticket</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { ${headerStyle} color: #eef4ff; padding: 30px 20px; text-align: center; border-radius: 10px; }
            .ticket { ${ticketStyle} margin: 20px 0; padding: 20px; border-radius: 10px; }
            .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #070d2d; }
            .complimentary-badge { 
              background: linear-gradient(135deg, #4CAF50, #45a049); 
              color: white; 
              padding: 8px 16px; 
              border-radius: 20px; 
              font-weight: bold; 
              margin: 10px 0; 
              display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="complimentary-badge">✨ COMPLIMENTARY TICKET ✨</div>
                <h1>🎫 ${ticketInfo}</h1>
                <h2>Synergy SEA Summit 2025</h2>
                <p style="color: #4CAF50; font-weight: bold; margin: 10px 0;">Courtesy of Synergy Indonesia</p>
            </div>
            
            <div style="padding: 20px;">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                <p>We are pleased to offer you a complimentary ticket to Synergy SEA Summit 2025!</p>
                
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
                    <div class="info-row">
                        <span class="label">Ticket Type:</span>
                        <span class="value" style="color: #4CAF50; font-weight: bold;">COMPLIMENTARY</span>
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
                </div>

                <div class="qr-section">
                    <h3 style="color: #070d2d;">QR CODE FOR ENTRANCE</h3>
                    <img src="${data.qrCode}" alt="QR Code" style="max-width: 200px;">
                    <p><strong>Important:</strong> Please show this QR code at the event entrance for check-in.</p>
                </div>

                <div style="background: #e8f5e8; border: 2px solid #4CAF50; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #2e7d32;">Important Instructions:</h4>
                    <ul>
                        <li>Arrive 30 minutes before the event starts</li>
                        <li>Bring a valid ID that matches your registration</li>
                        <li>Save this email or screenshot the QR code</li>
                        <li>This complimentary ticket is non-transferable</li>
                        <li>For inquiries, contact us at ${process.env.SUPPORT_EMAIL || 'synergyindonesiasales@gmail.com'}</li>
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
            .header { background: linear-gradient(135deg, #04091c, #070d2d); color: #eef4ff; padding: 30px 20px; text-align: center; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #070d2d; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💳 Payment Confirmation</h1>
                <h2>Synergy SEA Summit 2025</h2>
            </div>
            
            <div class="content">
                <p>Dear <strong>${data.participantName}</strong>,</p>
                <p>This is to confirm that we have received your payment for Synergy SEA Summit 2025.</p>
                
                <div class="info-row">
                    <span class="label">Order ID:</span>
                    <span class="value">${data.orderId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Payment Status:</span>
                    <span class="value">${data.paymentStatus}</span>
                </div>
                <div class="info-row">
                    <span class="label">Amount:</span>
                    <span class="value">Rp ${data.amount.toLocaleString('id-ID')}</span>
                </div>
                
                <p>Your ticket(s) will be processed and sent to you shortly via email.</p>
                <p>Thank you for your registration!</p>
                
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
}

// Export singleton instance
export const emailService = new EmailService();