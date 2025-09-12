# 🌐 Domain Migration Guide - synergyseasummit.co.id

## Environment Variables untuk Domain Baru

Domain website akan diganti dari `synergy-sea-summit2025.vercel.app` ke `synergyseasummit.co.id`

### 🔗 **URL/Domain Configuration:**
```bash
# URL utama aplikasi (domain website)
NEXT_PUBLIC_PRODUCTION_URL=https://synergyseasummit.co.id
NEXT_PUBLIC_DOMAIN=https://synergyseasummit.co.id
NEXT_PUBLIC_APP_URL=https://synergyseasummit.co.id

# Base URL untuk callback dan redirect
NEXT_PUBLIC_BASE_URL=https://synergyseasummit.co.id
```

### 📧 **Email Configuration (Tetap sama):**
```bash
# Email SMTP tetap menggunakan Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=synergyindonesiasales@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=synergyindonesiasales@gmail.com

# Support emails (bisa tetap atau diganti sesuai kebutuhan)
NEXT_PUBLIC_SUPPORT_EMAIL=support@synergyseasummit.com
SUPPORT_EMAIL=info@synergyseasummit.com
DEFAULT_FROM_EMAIL=noreply@synergyseasummit.com
```

## 📋 **Checklist Migrasi Domain:**

### ✅ **1. Update Environment Variables di Vercel untuk Domain Website:**
- [ ] `NEXT_PUBLIC_PRODUCTION_URL=https://synergyseasummit.co.id`
- [ ] `NEXT_PUBLIC_DOMAIN=https://synergyseasummit.co.id` 
- [ ] `NEXT_PUBLIC_BASE_URL=https://synergyseasummit.co.id`

### ✅ **2. Email Configuration (jika ingin diganti):**
- [ ] `SMTP_USER=synergyindonesiasales@gmail.com`
- [ ] `SMTP_FROM=synergyindonesiasales@gmail.com`
- [ ] `DEFAULT_FROM_EMAIL=synergyindonesiasales@gmail.com` (optional)
- [ ] `NEXT_PUBLIC_SUPPORT_EMAIL=support@synergyseasummit.com` (optional)
- [ ] `SUPPORT_EMAIL=info@synergyseasummit.com` (optional)

### ✅ **2. Redeploy Aplikasi:**
```bash
# Trigger redeploy di Vercel setelah update env vars
```

### ✅ **3. Test Functionality:**
- [ ] Payment callback URLs
- [ ] Email sending
- [ ] Support email links
- [ ] Redirect mechanisms

### ✅ **4. DNS Configuration:**
- [ ] Point domain ke Vercel
- [ ] Setup email DNS records (MX, SPF, DKIM)
- [ ] SSL Certificate validation

## 🔧 **Files yang Sudah Disiapkan untuk Domain Dinamis:**

1. **next.config.ts** - Redirect configuration
2. **src/app/api/payment/callback/route.ts** - Payment callback URLs
3. **src/lib/emailService.ts** - Email sender configuration
4. **src/app/payment/page.tsx** - Support email display
5. **src/app/api/debug/email/route.ts** - Email debug info

## 🚨 **Fallback Values:**

Jika environment variable tidak di-set, aplikasi akan menggunakan fallback:
- **Website Domain**: `https://synergyseasummit.co.id`
- **Email Domain**: `synergyindonesiasales@gmail.com` 
- **SMTP**: `synergyindonesiasales@gmail.com`

## 📝 **Summary:**

- **Website domain**: `synergy-sea-summit2025.vercel.app` → `synergyseasummit.co.id`  
- **Email SMTP**: Tetap menggunakan `synergyindonesiasales@gmail.com`
- **Support email**: Bisa tetap atau ganti ke `synergyindonesiasales@gmail.com`