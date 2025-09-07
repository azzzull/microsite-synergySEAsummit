# Deploy to Vercel - Quick Guide

## 1. Prepare Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin master
```

## 2. Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your repository: `microsite-synergy`
5. Vercel auto-detects Next.js config
6. Click "Deploy"

## 3. Environment Variables
After deployment, add these in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_DOKU_BASE_URL=https://api-sandbox.doku.com
DOKU_CLIENT_ID=BRN-0210-1756278654327
DOKU_CLIENT_SECRET=SK-EtK47WijI2zI51CkmX0K
DOKU_MERCHANT_CODE=BRN-0210-1756278654327
DOKU_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArs7Th1CZo7ox4TSqOgU/rJHnOeeAuwHVnRJgNRQNwZHPvqFDenDP9IPIVJE9J4mUNtLhYqc8CYxW8ttNSEltjgZ+WJDPhg+4KgcTr6gWVC2bCSzPaOk0l/Aq73haMQrkkXabG17HIntb6DKtC+Cdwb9sAqlzASrJIMftGvvIjgynZlIv90INa8iyjuEYJVIShXMyeRiu4h1N4RkNIdvnKXFVAhXPrZw6esBWfgz9dc2xrT5tUfXcK2nDmVmk4KsYsHvZcEGyJ0FL0raXpmJrkrDc1fedNgNHk2xX78W9v5v4PyUHLIfFdz6rGCmr3JBlvEbyVb0Wm8u0HvGrAT/kFQIDAQAB
NEXT_PUBLIC_EVENT_PRICE=250000
NEXT_PUBLIC_EVENT_NAME=Synergy SEA Summit 2025
NEXT_PUBLIC_EVENT_CURRENCY=IDR
```

Note: `NEXT_PUBLIC_BASE_URL` will be automatically set by Vercel.

## 4. Update DOKU Back Office
After getting your Vercel URL (e.g., https://microsite-synergy.vercel.app):

1. Login to DOKU Back Office: https://bo-sandbox.doku.com
2. Update Webhook URL: `https://your-app.vercel.app/api/payment/callback`
3. Update Success Redirect: `https://your-app.vercel.app/register/success`
4. Update Failed Redirect: `https://your-app.vercel.app/payment`

## 5. Test Deployment
1. Visit your Vercel URL
2. Test registration flow
3. Test payment with DOKU
4. Verify webhook callbacks work
5. Check admin panel functionality

## Troubleshooting
- If build fails: Check Next.js version compatibility
- If API routes don't work: Verify environment variables
- If DOKU integration fails: Check webhook URLs in Back Office
- If emails don't send: Verify Nodemailer configuration

## Production Setup
For production deployment:
1. Change `NEXT_PUBLIC_DOKU_BASE_URL` to `https://api.doku.com`
2. Get production DOKU credentials
3. Add custom domain in Vercel
4. Update DOKU Back Office with production URLs
