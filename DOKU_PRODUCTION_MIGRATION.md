# 🔥 CRITICAL: DOKU Migration Guide - Sandbox to Production

## ⚠️ IMPORTANT
Saat ini system menggunakan **DOKU Sandbox**. Untuk production, SEMUA payment akan GAGAL jika tidak migrasi ke DOKU Production!

---

## 🎯 Current State (Sandbox)
```javascript
// File: src/app/api/payment/route.ts
const dokuBaseUrl = "https://api-sandbox.doku.com"; // SANDBOX!
```

---

## 🚀 Production Migration Steps

### 1. Setup DOKU Production Account
1. **Login ke DOKU Production Dashboard**: https://dashboard.doku.com
2. **Complete KYB**: Upload dokumen bisnis (SIUP, NPWP, dll)
3. **Activate Production**: Tunggu approval dari DOKU (1-3 hari kerja)
4. **Get Production Credentials**:
   - Client ID (Production)
   - Secret Key (Production)  
   - Shared Key (Production)
   - Merchant ID (Production)

### 2. Update Code untuk Production

#### File: `src/app/api/payment/route.ts`
```typescript
// CHANGE FROM:
const dokuBaseUrl = "https://api-sandbox.doku.com";

// CHANGE TO:
const dokuBaseUrl = process.env.DOKU_BASE_URL || "https://api.doku.com";
```

#### File: Environment Variables (Vercel)
```bash
# ADD THESE NEW VARIABLES:
DOKU_BASE_URL=https://api.doku.com
DOKU_CLIENT_ID=your_production_client_id
DOKU_SECRET_KEY=your_production_secret_key
DOKU_SHARED_KEY=your_production_shared_key
DOKU_MERCHANT_ID=your_production_merchant_id
```

### 3. Update DOKU Dashboard Configuration
Login ke DOKU Production Dashboard dan set:

**Callback URLs**:
- Success URL: `https://your-domain.com/register/success`
- Callback URL: `https://your-domain.com/api/payment/callback`  
- Return URL: `https://your-domain.com/api/payment/return`

**Payment Methods**: Enable semua yang dibutuhkan
- Virtual Account (BCA, Mandiri, BNI, BRI, BSI, dll)
- Credit Card (Visa, Mastercard, JCB)
- E-Wallet (OVO, DANA, GoPay, dll)
- Convenience Store (Alfamart, Indomaret)

### 4. Testing Production
```bash
# Test dengan amount minimal
curl -X POST https://your-domain.com/api/payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "orderId": "TEST-001"}'
```

---

## 🔧 Code Changes Required

### Required Change #1: Payment Route
```typescript
// File: src/app/api/payment/route.ts
// Line ~15-20

// BEFORE (Sandbox):
const dokuBaseUrl = "https://api-sandbox.doku.com";

// AFTER (Production):
const dokuBaseUrl = process.env.DOKU_BASE_URL || "https://api.doku.com";
```

### Required Change #2: Environment Variables
Add to Vercel Dashboard:
```bash
DOKU_BASE_URL=https://api.doku.com
DOKU_CLIENT_ID=prod_client_id_from_doku
DOKU_SECRET_KEY=prod_secret_key_from_doku
```

---

## ⚡ Quick Migration Commands

```bash
# 1. Update payment route file
# Edit src/app/api/payment/route.ts line ~15

# 2. Add to Vercel environment variables
vercel env add DOKU_BASE_URL production
# Enter: https://api.doku.com

vercel env add DOKU_CLIENT_ID production  
# Enter: your_production_client_id

vercel env add DOKU_SECRET_KEY production
# Enter: your_production_secret_key

# 3. Redeploy
vercel --prod
```

---

## 🚨 CRITICAL CHECKPOINTS

### ✅ Before Go-Live
- [ ] DOKU Production account ACTIVE ✅
- [ ] Production credentials VALID ✅  
- [ ] Callback URLs CONFIGURED ✅
- [ ] Code UPDATED to use production API ✅
- [ ] Environment variables SET ✅

### ✅ After Go-Live  
- [ ] Test payment Rp 1.000 ✅
- [ ] Verify callback working ✅
- [ ] Check email e-ticket sent ✅
- [ ] Monitor error logs ✅

---

## 📞 DOKU Production Support
- **Email**: support@doku.com
- **Phone**: 021-2934-5678  
- **WhatsApp**: 0811-1200-5678
- **Dashboard**: https://dashboard.doku.com

---

## ⏰ Timeline
- **Day 1**: Submit DOKU production application
- **Day 2-4**: Wait for DOKU approval (KYB process)
- **Day 5**: Update code & deploy to production
- **Day 6**: Go-live testing

---

**🎯 REMEMBER**: Tanpa migrasi DOKU ke production, SEMUA payment akan gagal di production environment!
