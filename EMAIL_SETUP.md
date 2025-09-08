# Email Service Setup Guide

This guide explains how to configure email service for sending e-tickets and payment confirmations.

## Email Provider Options

### Option 1: Gmail SMTP (Free & Easy)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Add to .env.local**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_app_password_here
   SMTP_FROM=your_gmail@gmail.com
   ```

### Option 2: Outlook/Hotmail SMTP (Free)

1. **Add to .env.local**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@outlook.com
   SMTP_PASS=your_password
   SMTP_FROM=your_email@outlook.com
   ```

### Option 3: SendGrid (Paid, Professional)

1. **Create SendGrid account** at https://sendgrid.com
2. **Generate API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
3. **Add to .env.local**:
   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SMTP_FROM=noreply@yourdomain.com
   ```

### Option 4: Mailtrap (Testing Only)

1. **Create Mailtrap account** at https://mailtrap.io
2. **Get SMTP credentials** from your inbox
3. **Add to .env.local**:
   ```env
   MAILTRAP_USER=your_mailtrap_username
   MAILTRAP_PASS=your_mailtrap_password
   SMTP_FROM=test@yourdomain.com
   ```

## Testing Email Service

### 1. Test Connection
```bash
curl http://localhost:3000/api/admin/test-email
```

### 2. Send Test Confirmation Email
```bash
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "confirmation"}'
```

### 3. Send Test Ticket Email
```bash
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "ticket"}'
```

## Email Templates

The email service includes professionally designed HTML templates:

### Ticket Email Features:
- 🎫 Beautiful ticket design with event details
- 📱 QR code for entrance scanning
- 📋 Important instructions and reminders
- 🎨 Branded design matching your event theme

### Confirmation Email Features:
- ✅ Payment status confirmation
- 💰 Amount and order details
- 📧 Professional styling
- 🔗 Next steps information

## Fallback System

The email service includes automatic fallback:

1. **Primary Provider**: Your main SMTP (Gmail, Outlook, etc.)
2. **Secondary Provider**: SendGrid (if configured)
3. **Testing Provider**: Mailtrap (if configured)
4. **Simulation Mode**: If no providers configured

If one provider fails, it automatically tries the next one.

## Environment Variables Summary

```env
# Primary SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Optional: SendGrid Backup
SENDGRID_API_KEY=your_sendgrid_api_key

# Optional: Mailtrap Testing
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

## Production Recommendations

### For Production Use:
1. **Use SendGrid** or **Amazon SES** for reliability
2. **Set up SPF, DKIM, DMARC** records for your domain
3. **Use dedicated sending domain** (noreply@yourdomain.com)
4. **Monitor email delivery rates** and bounce rates

### For Development/Testing:
1. **Use Gmail** for quick setup
2. **Use Mailtrap** for testing without sending real emails
3. **Test all email templates** before production

## Troubleshooting

### Common Issues:

1. **Gmail "Less secure app access"**:
   - Use App Password instead of regular password
   - Enable 2-Factor Authentication first

2. **Outlook authentication errors**:
   - Make sure account doesn't have 2FA
   - Or use App Password if 2FA enabled

3. **SendGrid delivery issues**:
   - Verify sending domain
   - Check API key permissions
   - Review bounce/spam reports

4. **Email not received**:
   - Check spam folder
   - Verify email address
   - Check server logs for errors

### Debug Tips:

1. **Check logs** in development console
2. **Test connection** using `/api/admin/test-email`
3. **Verify environment variables** are loaded
4. **Use simulation mode** if providers not configured

## Security Notes

- Never commit `.env.local` to version control
- Use App Passwords, not regular passwords
- Rotate API keys regularly
- Monitor email sending patterns for abuse
- Implement rate limiting for production

## Email Deliverability Tips

1. **Use consistent "From" address**
2. **Include unsubscribe link** (for marketing emails)
3. **Avoid spam trigger words**
4. **Keep HTML clean and responsive**
5. **Test across different email clients**
6. **Monitor reputation and delivery rates**
