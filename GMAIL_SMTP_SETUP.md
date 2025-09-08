# Quick Gmail SMTP Setup Guide (5 Minutes)

## Step 1: Prepare Gmail Account
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" → "2-Step Verification" 
3. Enable 2-Step Verification if not already enabled

## Step 2: Generate App Password
1. Still in Security section
2. Click "2-Step Verification" → "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Name it "Synergy Event App"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

## Step 3: Update Environment Variables
Create or update `.env.local` file:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=your_gmail@gmail.com
```

⚠️ **Important**: 
- Use the App Password, NOT your regular Gmail password
- Remove spaces from App Password if copying with spaces

## Step 4: Test Email Service
1. Start your application: `npm run dev`
2. Go to `http://localhost:3001/admin`
3. Scroll to "Email Service Testing"
4. Click "Test Connection" → Should see ✅
5. Enter your email and click "Send Test Email"

## Step 5: Production Deployment
1. Add same environment variables to Vercel dashboard
2. Go to Vercel project → Settings → Environment Variables
3. Add each variable (SMTP_HOST, SMTP_PORT, etc.)
4. Redeploy your application

## Email Limits with Gmail SMTP
- **500 emails per day** (more than enough for most events)
- **From address**: Will be your Gmail address
- **Reply-to**: Can be customized

## Example Email Flow
1. User completes payment
2. Callback triggers email sending
3. Email sent from: `your_gmail@gmail.com`
4. User receives professional e-ticket
5. QR code included for event entrance

## Troubleshooting
- ❌ "Invalid login": Use App Password, not regular password
- ❌ "Less secure app": Enable 2-Step Verification first
- ❌ "Authentication failed": Check email/password spelling
- ❌ "SMTP timeout": Check internet connection

## Alternative: Professional Email Service
If you want custom domain emails (e.g., `noreply@yourdomain.com`):
1. **Resend**: Modern, $0/month for 3000 emails
2. **SendGrid**: Enterprise, $14.95/month
3. **Amazon SES**: Very cheap, $0.10 per 1000 emails

Choose Gmail SMTP for quick start, upgrade later if needed! 🚀
