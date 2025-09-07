# Synergy SEA Summit 2025 - Microsite

A Next.js-based registration and payment microsite for Synergy SEA S### 🔗 API Endpoints

**Core Payment System:**
- `POST /api/payment` - DOKU Checkout API integration
- `POST /api/payment/callback` - DOKU webhook handler

**Admin Dashboard:**
- `GET /api/admin/registrations` - View all registrations
- `GET /api/admin/payments` - View all payments
- `GET /api/admin/tickets` - View all tickets

**Development Testing:**
- `POST /api/test/realistic-payment` - Realistic DOKU payment simulation featuring DOKU payment integration.

## 🚀 Features

- **Event Registration** - Complete participant registration form
- **DOKU Payment Integration** - Secure payment processing with multiple methods (VA, Credit Card, QRIS)
- **E-ticket Generation** - Automated QR code tickets via email
- **Admin Dashboard** - Registration and payment management
- **Auto-sync Payment Status** - Real-time payment verification
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Payment**: DOKU Checkout API (Non-SNAP)
- **Email**: Nodemailer with HTML templates
- **Database**: JSON file-based simulation
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- DOKU Sandbox Account

## ⚙️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd microsite-synergy
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# DOKU Configuration
DOKU_CLIENT_ID=your_client_id
DOKU_CLIENT_SECRET=your_client_secret
DOKU_MERCHANT_CODE=your_merchant_code

# Base URL (for localhost development)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Tunnel URL (for DOKU webhooks - see Development section)
NEXT_PUBLIC_TUNNEL_URL=
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development with DOKU Webhooks

Since DOKU webhooks cannot reach localhost, you need to setup a public tunnel:

### Option 1: ssh.localhost.run (Recommended)
```bash
# In a new terminal
ssh -R 80:localhost:3000 ssh.localhost.run

# Copy the provided URL (e.g., https://abc123.lhr.life)
# Update .env.local:
NEXT_PUBLIC_TUNNEL_URL=https://abc123.lhr.life

# Restart your dev server
npm run dev
```

### Option 2: ngrok
```bash
# Install ngrok and authenticate
ngrok http 3000

# Copy the https URL
# Update .env.local with the ngrok URL
```

### Option 3: localtunnel
```bash
npx localtunnel --port 3000

# Copy the provided URL
# Update .env.local with the tunnel URL
```

**After setting up tunnel:**
1. Update `.env.local` with your tunnel URL
2. Restart the development server
3. Configure DOKU Back Office:
   - Webhook URL: `https://your-tunnel-url.here/api/payment/callback`
   - Redirect URL: `https://your-tunnel-url.here/register/success`

## 📱 API Endpoints

### Registration & Payment
- `POST /api/payment` - Create DOKU payment session
- `POST /api/payment/callback` - DOKU webhook handler
- `POST /api/test/realistic-payment` - Payment simulation

### Admin
- `GET /api/admin/registrations` - Get all registrations
- `GET /api/admin/payments` - Get all payments  
- `GET /api/admin/tickets` - Get all tickets

## 🎯 Pages

- `/` - Homepage
- `/register` - Registration form
- `/register/success` - Payment success page with auto-sync
- `/admin` - Admin dashboard
- `/hall-of-fame` - Participants showcase
- `/location` - Event location details

## 🔄 Payment Flow

1. **Customer Registration** → Fill form at `/register`
2. **DOKU Payment** → Redirect to DOKU checkout page
3. **Payment Success** → Customer completes payment at DOKU
4. **Webhook Notification** → DOKU sends notification to `/api/payment/callback`
5. **Status Update** → Database updated, e-ticket generated and sent
6. **Customer Redirect** → Customer redirected to `/register/success`
7. **Auto-sync** → Success page auto-detects payment status
8. **Confirmation** → Customer sees payment confirmation and e-ticket info

## 🛡️ Security Features

- HMAC signature verification for DOKU webhooks
- Environment-based configuration
- Input validation and sanitization
- Secure payment processing through DOKU

## 📧 Email System

- Payment confirmation emails
- E-ticket delivery with QR codes
- HTML email templates
- Simulation mode for development

## 🔍 Testing

### Test Payment Flow
1. Go to `/register`
2. Fill in participant details
3. Click "Register & Pay"
4. Use DOKU test credentials for payment
5. Verify status at `/register/success`

### Webhook Testing
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/payment/callback \
  -H "Content-Type: application/json" \
  -H "x-signature: HMACSHA256=test" \
  -d '{"order":{"invoice_number":"TEST123"},"payment":{"status":"SUCCESS"}}'
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

#### 2. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

#### 3. Configure Environment Variables
In your Vercel project dashboard, go to "Settings" → "Environment Variables" and add:

```bash
# DOKU Configuration
NEXT_PUBLIC_DOKU_BASE_URL=https://api-sandbox.doku.com
DOKU_CLIENT_ID=your_doku_client_id
DOKU_CLIENT_SECRET=your_doku_client_secret
DOKU_MERCHANT_CODE=your_doku_merchant_code
DOKU_PUBLIC_KEY=your_doku_public_key

# Base URL (automatically set by Vercel)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# Event Configuration
NEXT_PUBLIC_EVENT_PRICE=250000
NEXT_PUBLIC_EVENT_NAME=Synergy SEA Summit 2025
NEXT_PUBLIC_EVENT_CURRENCY=IDR
```

#### 4. Update DOKU Back Office
After deployment, update your DOKU Back Office settings:
- Webhook URL: `https://your-app.vercel.app/api/payment/callback`
- Success Redirect: `https://your-app.vercel.app/register/success`
- Failed Redirect: `https://your-app.vercel.app/payment`

#### 5. Alternative: Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Set environment variables
vercel env add DOKU_CLIENT_ID
vercel env add DOKU_CLIENT_SECRET
# ... add other variables
```

### For Production
When ready for production:
1. Change `NEXT_PUBLIC_DOKU_BASE_URL` to `https://api.doku.com`
2. Use production DOKU credentials
3. Configure custom domain in Vercel
4. Update DOKU Back Office with production URLs

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [DOKU API Documentation](https://developers.doku.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Synergy SEA Summit 2025** - Connecting Southeast Asian Tech Communities
# Trigger redeploy Sun, Sep  7, 2025  9:06:29 PM
