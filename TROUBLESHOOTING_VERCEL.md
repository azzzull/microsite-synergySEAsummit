# 🚨 TROUBLESHOOTING: DOKU Payment Gagal di Vercel

## ❌ **MASALAH UMUM: Localhost Works, Vercel Doesn't**

### **🔍 DIAGNOSIS STEP-BY-STEP:**

#### **1. CHECK ENVIRONMENT VARIABLES**
Masalah paling umum: Environment variables tidak ter-set di Vercel

**Debug Steps:**
- [ ] Buka Vercel project dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Pastikan SEMUA 7 variables sudah ada:
  ```
  NEXT_PUBLIC_DOKU_BASE_URL ✅
  DOKU_CLIENT_ID ✅
  DOKU_CLIENT_SECRET ✅
  DOKU_MERCHANT_CODE ✅
  DOKU_PUBLIC_KEY ✅
  NEXT_PUBLIC_EVENT_PRICE ✅
  NEXT_PUBLIC_EVENT_NAME ✅
  NEXT_PUBLIC_EVENT_CURRENCY ✅
  ```

**Test Environment Variables:**
- [ ] Tambahkan test endpoint untuk debug environment variables
- [ ] Visit: `https://your-vercel-url.vercel.app/api/test-env`

#### **2. CHECK VERCEL FUNCTION LOGS**
DOKU API calls mungkin gagal tapi error tidak terlihat

**Check Logs:**
- [ ] Buka Vercel dashboard → Project → Functions tab
- [ ] Klik pada function `/api/payment`
- [ ] Check "Invocations" untuk error logs
- [ ] Look for DOKU API call errors

#### **3. CORS & API ENDPOINT ISSUES**
Vercel serverless functions punya behavior berbeda

**Potential Issues:**
- [ ] DOKU API timeout (Vercel functions have 10s limit)
- [ ] Network connectivity issues
- [ ] API request format differences

#### **4. BASE URL CONFIGURATION**
URL generation mungkin salah di production

**Check URLs:**
- [ ] Verify `NEXT_PUBLIC_BASE_URL` di environment variables
- [ ] Check webhook URLs dalam DOKU request
- [ ] Ensure no localhost references

---

## 🛠️ **QUICK DEBUG SOLUTIONS:**

### **Solution 1: Add Debug API Endpoint**
```typescript
// Add this file: src/app/api/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      DOKU_BASE_URL: process.env.NEXT_PUBLIC_DOKU_BASE_URL,
      CLIENT_ID: process.env.DOKU_CLIENT_ID ? 'SET' : 'MISSING',
      CLIENT_SECRET: process.env.DOKU_CLIENT_SECRET ? 'SET' : 'MISSING',
      MERCHANT_CODE: process.env.DOKU_MERCHANT_CODE ? 'SET' : 'MISSING',
      PUBLIC_KEY: process.env.DOKU_PUBLIC_KEY ? 'SET (length: ' + (process.env.DOKU_PUBLIC_KEY?.length || 0) + ')' : 'MISSING',
      BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      EVENT_PRICE: process.env.NEXT_PUBLIC_EVENT_PRICE,
    },
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV
  });
}
```

### **Solution 2: Enhanced Error Logging**
- [ ] Check Vercel function logs for detailed errors
- [ ] Look for network timeout errors
- [ ] Check DOKU API response errors

### **Solution 3: Test API Calls Manually**
```bash
# Test API endpoint directly:
curl -X POST https://your-vercel-url.vercel.app/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "081234567890",
    "dob": "1990-01-01",
    "address": "Test Address",
    "country": "Indonesia"
  }'
```

---

## 📋 **STEP-BY-STEP DEBUGGING:**

### **Step 1: Verify Environment Variables**
- [ ] Visit: `https://your-vercel-url.vercel.app/api/debug`
- [ ] Check if all variables are "SET"
- [ ] If MISSING: Re-add environment variables in Vercel

### **Step 2: Check Function Logs**
- [ ] Vercel Dashboard → Functions → `/api/payment`
- [ ] Look for error messages in "Invocations"
- [ ] Check for timeout or network errors

### **Step 3: Test DOKU API Directly**
- [ ] Try manual API call to payment endpoint
- [ ] Check response for specific error messages
- [ ] Compare with localhost behavior

### **Step 4: Network & Timeout Issues**
- [ ] DOKU API might be slower from Vercel servers
- [ ] Check if API calls are timing out
- [ ] Verify DOKU sandbox is accessible from Vercel

---

## 🎯 **COMMON FIXES:**

### **Fix 1: Re-deploy After Environment Variables**
```bash
# After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Select "Redeploy"
4. Wait for redeployment to complete
```

### **Fix 2: Check DOKU Base URL**
```bash
# Ensure correct DOKU endpoint:
NEXT_PUBLIC_DOKU_BASE_URL=https://api-sandbox.doku.com
# NOT: http://localhost:3000 or other URLs
```

### **Fix 3: Verify Request Format**
- [ ] Check if DOKU request body is properly formatted
- [ ] Verify signature generation works in production
- [ ] Ensure timestamp format is correct

---

## 🚨 **IMMEDIATE ACTIONS:**

1. **Add debug endpoint** and check environment variables
2. **Check Vercel function logs** for error details
3. **Test API manually** with curl or Postman
4. **Compare exact request/response** between localhost and Vercel

---

## 📞 **GET SPECIFIC ERROR:**

After adding debug endpoint, share:
- [ ] Response from `/api/debug`
- [ ] Error logs from Vercel Functions
- [ ] Exact error message from payment attempt

This will help identify the specific issue! 🔍
