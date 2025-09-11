# 🚀 Vercel Production Environment Setup

## 📋 **ENVIRONMENT VARIABLES YANG WAJIB DI VERCEL**

### 🔐 **1. Admin Authentication (CRITICAL)**
```bash
ADMIN_USER=admin
ADMIN_PASS_HASH=$2b$12$b.sqBFPhUq6oZs6DpSDisOp/kOh7v.2xeQOqLjXLH/KDcP/gkezDC
JWT_SECRET=cvePhtjDTt/8V6CPC3O/odvzTYkXC1/icRc78SUTxJY=
```

### 💳 **2. DOKU Payment (Production)**
```bash
NEXT_PUBLIC_DOKU_BASE_URL=https://api.doku.com
DOKU_CLIENT_ID=your-production-client-id
DOKU_CLIENT_SECRET=your-production-client-secret  
DOKU_MERCHANT_CODE=your-production-merchant-code
DOKU_PUBLIC_KEY=your-production-public-key
```

### 🗄️ **3. Database (Railway PostgreSQL)**
```bash
DATABASE_URL=postgresql://postgres:QAiTIKAwYOjZBnOxDPrjtVbwujpYwKQR@switchyard.proxy.rlwy.net:12836/railway
POSTGRES_URL=postgresql://postgres:QAiTIKAwYOjZBnOxDPrjtVbwujpYwKQR@switchyard.proxy.rlwy.net:12836/railway
POSTGRES_URL_NON_POOLING=postgresql://postgres:QAiTIKAwYOjZBnOxDPrjtVbwujpYwKQR@switchyard.proxy.rlwy.net:12836/railway
```

### 📧 **4. Email Service (Gmail SMTP)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=azulkarnaen7@gmail.com
SMTP_PASS=oejiviaotwgfviwv
SMTP_FROM=azulkarnaen7@gmail.com
```

### 🌐 **5. Application URLs**
```bash
NEXT_PUBLIC_BASE_URL=https://synergy-sea-summit2025.vercel.app
NEXT_PUBLIC_PRODUCTION_URL=https://synergy-sea-summit2025.vercel.app
NEXT_PUBLIC_APP_URL=https://synergy-sea-summit2025.vercel.app
```

### 🎫 **6. Event Configuration**
```bash
NEXT_PUBLIC_EVENT_NAME=Synergy SEA Summit 2025
NEXT_PUBLIC_EVENT_CURRENCY=IDR
```

### 🔒 **7. Security Settings (Production)**
```bash
NODE_ENV=production
DEBUG_LOGGING=false
ENABLE_API_LOGS=false
```

---

## ❌ **ENVIRONMENT VARIABLES YANG HARUS DIHAPUS/TIDAK DIGUNAKAN**

### **Dari .env.local - JANGAN MASUKKAN ke Vercel:**
```bash
# ❌ HAPUS - Tidak aman
ADMIN_PASS=azule3036458

# ❌ HAPUS - Hardcoded pricing (sekarang dynamic dari database)
NEXT_PUBLIC_EVENT_PRICE=250000

# ❌ HAPUS - Development only
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_TUNNEL_URL=

# ❌ HAPUS - Development settings  
DEBUG_LOGGING=true
ENABLE_API_LOGS=true
```

---

## 🛠️ **CARA SETUP DI VERCEL**

### **Step 1: Login ke Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select your project: `microsite-synergySEAsummit`
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add Environment Variables**
Copy-paste semua environment variables di atas ke Vercel:

**Format di Vercel:**
- **Name:** `ADMIN_USER`  
- **Value:** `admin`
- **Environments:** ✅ Production ✅ Preview ✅ Development

Ulangi untuk semua variables yang diperlukan.

### **Step 3: Generate New Security Keys (RECOMMENDED)**

Untuk production, sebaiknya generate keys baru:

```bash
# Generate new JWT secret
openssl rand -base64 32

# Generate new admin password hash
node generate-admin-password.js --generate
```

### **Step 4: Update DOKU to Production**
Ganti dari sandbox ke production:
- Change `NEXT_PUBLIC_DOKU_BASE_URL` to `https://api.doku.com`
- Update dengan production credentials dari DOKU

---

## 🧪 **TESTING CHECKLIST SETELAH DEPLOY**

### **✅ Test 1: Admin Login**
- https://synergy-sea-summit2025.vercel.app/admin/login
- Login dengan: `admin` / `6x(be}Ut@4R1L6EL`

### **✅ Test 2: Dynamic Pricing**  
- https://synergy-sea-summit2025.vercel.app/register
- Check harga diambil dari database, bukan hardcoded

### **✅ Test 3: Payment Flow**
- Test complete registration → payment → email ticket

### **✅ Test 4: Admin Panel**
- Test pricing management
- Test voucher management
- Test logout functionality

### **✅ Test 5: Security Headers**
```bash
curl -I https://synergy-sea-summit2025.vercel.app
# Should return security headers we configured
```

---

## ⚠️ **CRITICAL PRODUCTION REMINDERS**

1. **🔐 NEVER commit sensitive data to git:**
   - No passwords in code
   - No API keys in code  
   - No database URLs in code

2. **🔒 Use production DOKU credentials:**
   - Change from sandbox to production
   - Test payment flow thoroughly

3. **📧 Email service:**
   - Make sure Gmail App Password works
   - Test email delivery

4. **🗄️ Database:**
   - Railway PostgreSQL should work same in production
   - Test all database operations

5. **🚨 Monitor after deployment:**
   - Check logs for errors
   - Monitor failed login attempts
   - Test all functionality

---

## 📝 **DEPLOYMENT COMMAND**

```bash
# Push to git (triggers auto-deploy)
git add .
git commit -m "Security improvements and environment cleanup"
git push origin master
```

**Vercel will auto-deploy from your git repository!**

---

**🎯 Main difference: HAPUS semua hardcoded pricing dan gunakan dynamic pricing dari database!**
