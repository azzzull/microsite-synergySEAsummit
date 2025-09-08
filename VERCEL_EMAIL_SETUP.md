# Vercel Environment Variables Setup

## Production Environment Variables for Vercel

### 1. Go to Vercel Dashboard
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Select your project: `microsite-synergySEAsummit`
- Go to Settings → Environment Variables

### 2. Add These Variables

```
Variable Name: SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development

Variable Name: SMTP_PORT  
Value: 587
Environment: Production, Preview, Development

Variable Name: SMTP_SECURE
Value: false
Environment: Production, Preview, Development

Variable Name: SMTP_USER
Value: your_gmail@gmail.com
Environment: Production, Preview, Development

Variable Name: SMTP_PASS
Value: your_app_password_here
Environment: Production, Preview, Development

Variable Name: SMTP_FROM
Value: your_gmail@gmail.com
Environment: Production, Preview, Development
```

### 3. Existing Variables (Keep These)
```
DATABASE_URL=your_railway_postgres_url
POSTGRES_URL=your_railway_postgres_url
POSTGRES_URL_NON_POOLING=your_railway_postgres_url
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_ENVIRONMENT=sandbox
```

### 4. Redeploy Application
After adding environment variables:
- Go to Deployments tab
- Click "Redeploy" on latest deployment
- Or push new commit to trigger auto-deployment

### 5. Test Production Email
1. Go to your live site: `https://synergy-sea-summit2025.vercel.app/admin`
2. Test email service connection
3. Send test emails to verify everything works

## Important Notes

### Security Best Practices
- ✅ Never commit `.env.local` to git
- ✅ Use App Passwords, not regular passwords
- ✅ Different environments can use different SMTP settings
- ✅ Monitor email usage to avoid hitting limits

### Gmail SMTP Limits
- **Daily Limit**: 500 emails per day
- **Rate Limit**: ~100 emails per hour
- **From Address**: Must be your Gmail address
- **Authentication**: Requires App Password with 2FA enabled

### Professional Upgrade Path
When ready for custom domain emails:
1. **Domain**: Buy domain (e.g., synergyseasummit.com)
2. **Email Service**: Resend/SendGrid/SES
3. **DNS Setup**: Add MX, SPF, DKIM records
4. **Update Variables**: Change SMTP settings in Vercel

## Monitoring Email Delivery

### Check Logs in Vercel
1. Go to Functions tab in Vercel dashboard
2. Click on API routes to see logs
3. Monitor email sending success/failure

### Gmail Sent Items
- Check Gmail "Sent" folder to verify emails sent
- Monitor for bounced emails in Gmail

### User Feedback
- Add email delivery status in admin panel
- Track email open rates if using professional service

## Cost Comparison

| Service | Free Tier | Paid Plans | Custom Domain |
|---------|-----------|------------|---------------|
| Gmail SMTP | 500/day | N/A | ❌ |
| Resend | 3000/month | $20/month | ✅ |
| SendGrid | 100/day | $15/month | ✅ |
| Amazon SES | 200/day | $0.10/1000 | ✅ |

**Recommendation**: Start with Gmail, upgrade to Resend when needed.
