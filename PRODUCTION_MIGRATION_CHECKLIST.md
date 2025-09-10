# 🚀 Production Migration Checklist - Synergy SEA Summit 2025

## 📋 Overview
Checklist lengkap untuk migrasi dari sandbox/development ke production environment.

---

## 🌐 1. Domain & Hosting Configuration

### ✅ Domain Setup
- [ ] **Custom Domain**: Ubah dari `synergy-sea-summit2025.vercel.app` ke domain custom (misal: `synergyseakummit.com`)
- [ ] **DNS Configuration**: Setup A record atau CNAME ke Vercel
- [ ] **SSL Certificate**: Pastikan HTTPS aktif untuk domain custom
- [ ] **Domain Verification**: Verifikasi ownership domain di Vercel

### ✅ Environment Variables Update
```bash
# Update di Vercel Dashboard -> Settings -> Environment Variables

# Base URLs
NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
NEXT_PUBLIC_PRODUCTION_URL=https://your-custom-domain.com

# Vercel URL (optional, for fallback)
VERCEL_URL=your-custom-domain.com
```

---

## 💳 2. DOKU Payment Gateway Migration

### ✅ DOKU Production Setup
**CRITICAL**: Ganti dari Sandbox ke Production

#### Current Sandbox Config:
```javascript
// Saat ini menggunakan sandbox
const DOKU_BASE_URL = "https://api-sandbox.doku.com"
```

#### Production Config:
```javascript
// Ubah ke production
const DOKU_BASE_URL = "https://api.doku.com"
```

### ✅ DOKU Environment Variables
```bash
# Production credentials dari DOKU
DOKU_CLIENT_ID=your_production_client_id
DOKU_SECRET_KEY=your_production_secret_key
DOKU_SHARED_KEY=your_production_shared_key

# Production Merchant Info
DOKU_MERCHANT_ID=your_production_merchant_id
DOKU_ACQUIRER_ID=your_production_acquirer_id
```

### ✅ DOKU Callback URLs
Update di DOKU Production Dashboard:
- **Success URL**: `https://your-custom-domain.com/register/success`
- **Callback URL**: `https://your-custom-domain.com/api/payment/callback`
- **Return URL**: `https://your-custom-domain.com/api/payment/return`

---

## 📧 3. Email Service Configuration

### ✅ Gmail SMTP (Sudah Production Ready)
Current setup sudah bisa untuk production:
```bash
# Gmail SMTP credentials (already configured)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_digit_app_password

# Backup SMTP (Ethereal - only for testing)
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_pass
```

### ✅ Email Templates
- [ ] **Update Logo URLs**: Pastikan semua asset di email menggunakan production domain
- [ ] **Update Event Links**: Ganti semua link ke production domain
- [ ] **Test Email Delivery**: Test kirim email ke berbagai provider (Gmail, Yahoo, Outlook)

---

## 🗄️ 4. Database Configuration

### ✅ PostgreSQL Production
Jika menggunakan Railway PostgreSQL:

```bash
# Production Database
DATABASE_URL=your_production_postgresql_url
POSTGRES_PRISMA_URL=your_production_postgresql_url
POSTGRES_URL_NON_POOLING=your_production_postgresql_url
```

### ✅ Database Migration Steps
1. **Backup Development Data** (jika ada data penting)
2. **Setup Production Database** di Railway/Neon/Supabase
3. **Run Migration Scripts**:
   ```bash
   # Apply database schema
   cat database-schema-update.sql | psql $DATABASE_URL
   cat railway-setup.sql | psql $DATABASE_URL
   ```
4. **Test Database Connection**

---

## 🔧 5. Application Configuration Updates

### ✅ Next.js Configuration
Update `next.config.ts`:
```typescript
// Pastikan production optimizations aktif
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pg"]
  },
  // Add production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
}
```

### ✅ Environment Files
Create production `.env.production`:
```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
NEXT_PUBLIC_PRODUCTION_URL=https://your-custom-domain.com

# DOKU Production
DOKU_CLIENT_ID=production_client_id
DOKU_SECRET_KEY=production_secret_key
DOKU_BASE_URL=https://api.doku.com

# Database Production
DATABASE_URL=production_postgresql_url

# Email Production (same as current)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

---

## 🔍 6. Code Changes Required

### ✅ Payment API Updates
File: `src/app/api/payment/route.ts`

Update base URL:
```typescript
// FROM (Sandbox):
const dokuBaseUrl = "https://api-sandbox.doku.com";

// TO (Production):
const dokuBaseUrl = process.env.DOKU_BASE_URL || "https://api.doku.com";
```

### ✅ Callback URL Updates
File: `src/app/api/payment/callback/route.ts`

Update redirect URLs sudah menggunakan environment variables ✅ (Sudah benar):
```typescript
let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
if (process.env.NODE_ENV === 'production' || process.env.VERCEL_URL) {
  baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://synergy-sea-summit2025.vercel.app';
}
```

### ✅ Email Service Updates
File: `src/lib/emailService.ts`

Update logo URLs di email templates:
```typescript
// Update semua URL logo dari relative ke absolute
const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/synergyseasummitlogo.png`;
```

---

## 🧪 7. Testing Checklist

### ✅ Payment Testing
- [ ] **DOKU Production Test**: Test dengan amount kecil (Rp 1.000)
- [ ] **All Payment Methods**: Test VA BCA, Mandiri, BNI, BRI, BSI, Alfamart, Credit Card
- [ ] **Callback URLs**: Pastikan callback dari DOKU berfungsi
- [ ] **Email Delivery**: Test email e-ticket terkirim

### ✅ Functionality Testing
- [ ] **Registration Flow**: End-to-end registration
- [ ] **Admin Panel**: Test semua fitur admin
- [ ] **Database Operations**: CRUD operations
- [ ] **Error Handling**: Test error scenarios

### ✅ Performance Testing
- [ ] **Page Load Speed**: Test loading time
- [ ] **Database Performance**: Test query performance
- [ ] **Email Delivery Speed**: Test email sending speed

---

## 🚨 8. Security Checklist

### ✅ Environment Security
- [ ] **Remove Debug Logs**: Hapus semua console.log yang sensitive
- [ ] **Secure Headers**: Setup security headers di Vercel
- [ ] **Rate Limiting**: Setup rate limiting untuk API endpoints
- [ ] **CORS Configuration**: Pastikan CORS setup benar

### ✅ Database Security
- [ ] **Connection Pooling**: Setup connection pooling
- [ ] **SQL Injection Protection**: Pastikan menggunakan parameterized queries
- [ ] **Access Control**: Setup proper database access control

---

## 📝 9. Pre-Launch Final Steps

### ✅ 24 Hours Before Launch
- [ ] **DOKU Production Account**: Pastikan akun production DOKU sudah aktif
- [ ] **Payment Method Testing**: Test final semua payment methods
- [ ] **Email Templates**: Final review email templates
- [ ] **Domain DNS**: Pastikan DNS sudah propagate

### ✅ Launch Day
- [ ] **Deploy to Production**: Deploy dengan environment production
- [ ] **Smoke Test**: Test critical paths
- [ ] **Monitor Logs**: Monitor error logs
- [ ] **Backup Plan**: Siapkan rollback plan

---

## 🔧 10. File-by-file Changes Summary

### ✅ Environment Variables (Vercel Dashboard)
```bash
# Domain
NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
NEXT_PUBLIC_PRODUCTION_URL=https://your-custom-domain.com

# DOKU Production
DOKU_CLIENT_ID=production_client_id
DOKU_SECRET_KEY=production_secret_key  
DOKU_SHARED_KEY=production_shared_key
DOKU_BASE_URL=https://api.doku.com

# Database Production  
DATABASE_URL=production_postgresql_url
```

### ✅ Code Changes Required
1. **`src/app/api/payment/route.ts`**:
   - Update `dokuBaseUrl` to use environment variable
   
2. **`src/lib/emailService.ts`**:
   - Update logo URLs to use production domain
   
3. **DOKU Dashboard Configuration**:
   - Update callback URLs ke production domain

### ✅ Files Already Production Ready ✅
- `src/app/api/payment/callback/route.ts` (sudah menggunakan env variables)
- `src/lib/postgresDatabase.ts` (sudah menggunakan env variables)
- Most other files (sudah generic)

---

## 📞 Support Contacts

### ✅ DOKU Support
- **Email**: support@doku.com
- **Phone**: 021-2934-5678
- **Dashboard**: https://dashboard.doku.com

### ✅ Railway Support (Database)
- **Dashboard**: https://railway.app
- **Docs**: https://docs.railway.app

### ✅ Vercel Support (Hosting)
- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs

---

## ✅ Quick Migration Steps

1. **Setup DOKU Production Account** & get production credentials
2. **Setup Production Database** (Railway/Neon/Supabase)
3. **Configure Custom Domain** di Vercel
4. **Update Environment Variables** di Vercel dashboard
5. **Update DOKU callback URLs** di DOKU production dashboard
6. **Deploy & Test** payment flow end-to-end

---

**🎯 Priority**: DOKU Production Setup adalah yang paling critical karena semua payment tergantung ini!

**📅 Timeline**: Estimasi 1-2 hari untuk full migration & testing.

**🛡️ Risk**: Backup semua data development sebelum migration.
