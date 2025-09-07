# 🔧 Fix DOKU Redirect - Step by Step Guide

## 🎯 Problem
Customer stuck di DOKU success page, tidak redirect kembali ke aplikasi kita setelah payment berhasil.

## 🔍 Root Cause
Environment variable `NEXT_PUBLIC_BASE_URL` di Vercel masih menggunakan placeholder value:
```
NEXT_PUBLIC_BASE_URL: "https://your-vercel-url.vercel.app"
```

Seharusnya menggunakan URL Vercel yang sebenarnya:
```
NEXT_PUBLIC_BASE_URL: "https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app"
```

## 📋 Solution Steps

### Step 1: Update Environment Variable di Vercel
1. **Login ke Vercel Dashboard**
   - Buka: https://vercel.com
   - Login dengan akun Anda

2. **Buka Project Settings**
   - Pilih project: `microsite-synergySEAsummit` atau `synergy-sea-summit2025`
   - Klik **Settings** tab

3. **Edit Environment Variables**
   - Klik **Environment Variables** di sidebar kiri
   - Cari variable: `NEXT_PUBLIC_BASE_URL`
   - Klik **Edit** (icon pensil)

4. **Update Value**
   - **Old Value:** `https://your-vercel-url.vercel.app`
   - **New Value:** `https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app`
   - Pastikan **Environment** = `Production`
   - Klik **Save**

### Step 2: Redeploy Application
1. **Trigger Redeploy**
   - Di Vercel Dashboard, klik tab **Deployments**
   - Pilih deployment terbaru (yang paling atas)
   - Klik **...** (three dots) → **Redeploy**
   - Atau push commit baru ke GitHub

2. **Wait for Deployment**
   - Tunggu sampai status **Ready** (biasanya 1-2 menit)
   - Status akan berubah dari **Building** → **Ready**

### Step 3: Test & Verify
1. **Test Debug Endpoint**
   ```
   GET https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app/api/debug
   ```
   - Pastikan `NEXT_PUBLIC_BASE_URL` sudah berubah ke URL yang benar

2. **Test Payment Flow**
   - Buka: https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app/register
   - Isi form registrasi
   - Klik **Bayar Sekarang**
   - Lakukan test payment di DOKU
   - **Expected:** Setelah payment success, otomatis redirect ke halaman success kita

## 🎯 Expected Result

Setelah fix ini, DOKU akan menggunakan URL redirect yang benar:

### Before (SALAH):
```
success_redirect_url: "https://your-vercel-url.vercel.app/register/success?order_id=12345"
```

### After (BENAR):
```
success_redirect_url: "https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app/register/success?order_id=12345"
```

## ⚡ Quick Verification Commands

### 1. Check Environment Variable
```bash
curl "https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app/api/debug"
```

Look for:
```json
{
  "NEXT_PUBLIC_BASE_URL": "https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app"
}
```

### 2. Check Payment API Response
Test dengan data dummy di browser console atau Postman untuk melihat redirect URLs yang di-generate.

## 🚨 Important Notes

1. **Jangan lupa redeploy** setelah update environment variable
2. **Environment variable changes** tidak otomatis apply sampai ada deployment baru
3. **Test di production** untuk memastikan redirect berfungsi end-to-end
4. **DOKU Back Office** tidak perlu diubah karena redirect URL dikonfigurasi dari kode aplikasi

## 📞 Support

Jika masih ada masalah setelah mengikuti steps ini:
1. Check Vercel Function Logs di Dashboard
2. Test debug endpoint untuk memastikan environment variables benar
3. Pastikan tidak ada caching issue di browser (gunakan incognito mode)

---

## ✅ **UPDATE STATUS:**

### COMPLETED ✅
- ✅ **Environment Variable Fixed** - `NEXT_PUBLIC_BASE_URL` sudah benar
- ✅ **Redirect URLs Working** - URL sudah menggunakan domain Vercel yang benar
- ✅ **DOKU Payment Flow** - Checkout API berhasil, payment URL generated
- ✅ **Customer redirect** - Seharusnya sudah bisa redirect ke success page

### REMAINING ISSUE ⚠️
- ⚠️ **Signature headers missing** - Perlu update DOKU Back Office webhook URL

### NEXT ACTION 🎯
Update DOKU Back Office dengan webhook URL:
```
https://synergy-sea-summit2025-852nvnj3l-azzzulls-projects.vercel.app/api/payment/callback
```

**Status:** ✅ **FIXED** - Redirect URL sudah benar, test payment flow end-to-end
**Priority:** 🟡 Medium - Signature headers untuk enhanced security  
**ETA:** Ready for production testing
