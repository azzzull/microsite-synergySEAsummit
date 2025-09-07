# 🚀 VERCEL DEPLOYMENT CHECKLIST

## ✅ **SUDAH SELESAI:**
- [x] ✅ **Git Push Complete** - Code sudah di GitHub
- [x] ✅ **Build Test Passed** - Project builds successfully
- [x] ✅ **Files Optimized** - Unnecessary files removed
- [x] ✅ **DOKU Integration Ready** - Payment system functional

---

## 📋 **LANGKAH-LANGKAH DEPLOY KE VERCEL:**

### **STEP 1: DEPLOY TO VERCEL**
#### **1.1 Akses Vercel Dashboard**
- [ ] Buka [vercel.com](https://vercel.com)
- [ ] Sign in dengan **GitHub account yang sama**
- [ ] Pastikan GitHub account ter-connect

#### **1.2 Import Project**
- [ ] Klik "**Add New**" → "**Project**"
- [ ] Pilih "**Import Git Repository**"
- [ ] Cari repository: `azzzull/microsite-synergySEAsummit`
- [ ] Klik "**Import**"

#### **1.3 Configure Project**
- [ ] **Project Name**: `microsite-synergy` (atau sesuai keinginan)
- [ ] **Framework**: `Next.js` (auto-detected ✅)
- [ ] **Root Directory**: `./` (default)
- [ ] **Build Command**: `npm run build` (auto-detected ✅)
- [ ] **Output Directory**: `.next` (auto-detected ✅)

#### **1.4 Deploy**
- [ ] Klik "**Deploy**"
- [ ] Tunggu proses deployment selesai (~2-5 menit)
- [ ] Dapatkan URL deployment: `https://microsite-synergy-xxx.vercel.app`

---

### **STEP 2: CONFIGURE ENVIRONMENT VARIABLES**
#### **2.1 Akses Project Settings**
- [ ] Masuk ke project dashboard di Vercel
- [ ] Klik "**Settings**" tab
- [ ] Pilih "**Environment Variables**" dari sidebar

#### **2.2 Add Required Variables**
Copy-paste variables berikut **SATU PER SATU**:

```bash
# DOKU Configuration
NEXT_PUBLIC_DOKU_BASE_URL=https://api-sandbox.doku.com
DOKU_CLIENT_ID=BRN-0210-1756278654327
DOKU_CLIENT_SECRET=SK-EtK47WijI2zI51CkmX0K
DOKU_MERCHANT_CODE=BRN-0210-1756278654327
DOKU_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArs7Th1CZo7ox4TSqOgU/rJHnOeeAuwHVnRJgNRQNwZHPvqFDenDP9IPIVJE9J4mUNtLhYqc8CYxW8ttNSEltjgZ+WJDPhg+4KgcTr6gWVC2bCSzPaOk0l/Aq73haMQrkkXabG17HIntb6DKtC+Cdwb9sAqlzASrJIMftGvvIjgynZlIv90INa8iyjuEYJVIShXMyeRiu4h1N4RkNIdvnKXFVAhXPrZw6esBWfgz9dc2xrT5tUfXcK2nDmVmk4KsYsHvZcEGyJ0FL0raXpmJrkrDc1fedNgNHk2xX78W9v5v4PyUHLIfFdz6rGCmr3JBlvEbyVb0Wm8u0HvGrAT/kFQIDAQAB

# Event Configuration
NEXT_PUBLIC_EVENT_PRICE=250000
NEXT_PUBLIC_EVENT_NAME=Synergy SEA Summit 2025
NEXT_PUBLIC_EVENT_CURRENCY=IDR
```

**Cara Add Variable:**
- [ ] Klik "**Add New**"
- [ ] **Name**: (copy nama variable, contoh: `NEXT_PUBLIC_DOKU_BASE_URL`)
- [ ] **Value**: (copy value, contoh: `https://api-sandbox.doku.com`)
- [ ] **Environment**: Pilih "**Production**" (default)
- [ ] Klik "**Save**"
- [ ] Ulangi untuk semua 7 variables di atas

#### **2.3 Redeploy After Variables**
- [ ] Kembali ke "**Deployments**" tab
- [ ] Klik "**...** (3 dots)" pada deployment terakhir
- [ ] Pilih "**Redeploy**"
- [ ] Tunggu redeploy selesai

---

### **STEP 3: CONFIGURE DOKU BACK OFFICE**
#### **3.1 Get Vercel URL**
- [ ] Copy URL final dari Vercel (contoh: `https://microsite-synergy-xxx.vercel.app`)
- [ ] Test URL berfungsi dengan baik

#### **3.2 Update DOKU Back Office**
- [ ] Login ke [DOKU Back Office Sandbox](https://bo-sandbox.doku.com)
- [ ] Masuk ke **Merchant Settings** atau **Partnership Configuration**
- [ ] Update **Payment Notification URL** dari:

```bash
# GANTI DARI:
http://www.contoh-url.com

# MENJADI:
https://YOUR-VERCEL-URL.vercel.app/api/payment/callback
```

**Yang TIDAK PERLU DIUBAH:**
- ✅ Partnership Model: Tetap **Aggregator** atau **Direct** (sesuai existing)
- ✅ Billing Type & Feature: Tetap existing settings
- ✅ Company Code: Tetap existing (190080, 190060, 190070, 56090, 31830)
- ✅ Prefix Merchant: Tetap **Azul**

**Yang WAJIB DIUBAH:**
- 🔄 **Payment Notification URL**: Update ke Vercel URL

**Contoh setelah deployment:**
```bash
# Jika Vercel URL Anda: https://microsite-synergy-abc123.vercel.app
# Maka Payment Notification URL jadi:
https://microsite-synergy-abc123.vercel.app/api/payment/callback
```

- [ ] **Save Configuration** di DOKU Back Office

---

### **STEP 4: TEST DEPLOYMENT**
#### **4.1 Basic Functionality Test**
- [ ] **Homepage**: Visit `https://your-vercel-url.vercel.app`
- [ ] **Navigation**: Test all menu links
- [ ] **Responsive**: Test on mobile view
- [ ] **Admin Panel**: Visit `/admin` - should show empty tables

#### **4.2 Registration Flow Test**
- [ ] **Registration Form**: Fill `/register` with test data
- [ ] **Payment Creation**: Should redirect to DOKU payment page
- [ ] **Payment URL**: Verify DOKU payment page loads

#### **4.3 DOKU Integration Test**
- [ ] **Real Payment**: Complete payment di DOKU page
- [ ] **Redirect Back**: Should return to success page
- [ ] **Auto-Sync**: Wait for auto-sync on success page
- [ ] **Database Update**: Check admin panel for new data

#### **4.4 Alternative: Test with Realistic Endpoint**
- [ ] **Visit**: `/test` page
- [ ] **Create Test Registration**: Click "Create Test Registration"
- [ ] **Copy Order ID**: From response
- [ ] **Run Realistic Payment**: Paste Order ID and test
- [ ] **Check Success Page**: Visit `/register/success?order_id=ORDER_ID`
- [ ] **Verify Admin**: Check `/admin` for updated data

---

### **STEP 5: FINAL VERIFICATION**
#### **5.1 All Systems Check**
- [ ] **Website Loading**: All pages load correctly
- [ ] **DOKU API**: Payment creation working
- [ ] **Webhooks**: Callback receiving and processing
- [ ] **Database**: Data persisting correctly
- [ ] **Email Simulation**: Logs showing email sends
- [ ] **Admin Dashboard**: Data displaying correctly

#### **5.2 Performance Check**
- [ ] **Page Speed**: Pages load under 3 seconds
- [ ] **Mobile**: Responsive design working
- [ ] **Console**: No critical JavaScript errors
- [ ] **API Response**: APIs responding within reasonable time

---

## 🎯 **TROUBLESHOOTING CHECKLIST**

### **❌ Jika Build Gagal:**
- [ ] Check Vercel build logs
- [ ] Verify package.json dependencies
- [ ] Check TypeScript errors
- [ ] Retry deployment

### **❌ Jika Environment Variables Tidak Work:**
- [ ] Double-check variable names (case sensitive)
- [ ] Ensure no extra spaces in values
- [ ] Redeploy after adding variables
- [ ] Check Vercel function logs

### **❌ Jika DOKU Integration Gagal:**
- [ ] Verify DOKU Back Office URLs correct
- [ ] Check environment variables set correctly
- [ ] Test webhook endpoint manually
- [ ] Check Vercel function logs for errors

### **❌ Jika Database Tidak Update:**
- [ ] Check API endpoint responses
- [ ] Verify JSON file permissions
- [ ] Check Vercel function logs
- [ ] Test realistic payment endpoint

---

## 🎉 **SUCCESS INDICATORS**

### **✅ Deployment Successful When:**
- [ ] **Green checkmark** di Vercel deployments
- [ ] **Website accessible** via Vercel URL
- [ ] **Registration works** end-to-end
- [ ] **Payment integration** functional
- [ ] **Admin panel** shows data
- [ ] **No critical errors** in console/logs

### **✅ Ready for DOKU Testing When:**
- [ ] **Webhook URL** configured in DOKU
- [ ] **Real payment** can be processed
- [ ] **Success page** receives redirects
- [ ] **Database syncs** with payment status
- [ ] **E-ticket system** working

---

## 📞 **NEXT STEPS AFTER SUCCESSFUL DEPLOYMENT**

1. **Share URL** with team for testing
2. **Document deployment** process
3. **Plan production migration** strategy
4. **Monitor performance** and logs
5. **Prepare for custom domain** setup

---

## 🔗 **USEFUL LINKS**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **DOKU Back Office**: https://bo-sandbox.doku.com
- **GitHub Repository**: https://github.com/azzzull/microsite-synergySEAsummit
- **Project Documentation**: README.md

---

**🚀 READY FOR VERCEL! Follow this checklist step by step.**
