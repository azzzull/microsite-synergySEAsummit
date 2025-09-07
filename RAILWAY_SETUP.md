# 🚂 Railway PostgreSQL Setup Guide

## Langkah-langkah Setup Railway PostgreSQL (100% Gratis)

### Step 1: Create Railway Account
1. **Buka**: [railway.app](https://railway.app)
2. **Click**: "Start a New Project"
3. **Login** dengan GitHub account kamu
4. **Authorize** Railway untuk akses GitHub

### Step 2: Create PostgreSQL Database
1. **Click**: "New Project"
2. **Select**: "Provision PostgreSQL"
3. **Wait** sampai database ter-deploy (1-2 menit)
4. Database akan muncul dengan status "Active"

### Step 3: Get Connection Details
1. **Click** pada PostgreSQL service box
2. **Go to**: "Variables" tab
3. **Copy** connection string dari variable `DATABASE_URL`

```bash
# Format connection string:
postgresql://postgres:password@containers-us-west-xxx.railway.app:7891/railway
```

### Step 4: Add to Vercel Environment Variables

#### Via Vercel Dashboard:
1. **Buka**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select**: project "microsite-synergy"
3. **Go to**: Settings → Environment Variables
4. **Add New**:
   - **Name**: `POSTGRES_URL`
   - **Value**: Connection string dari Railway
   - **Environment**: Production, Preview, Development

#### Via Local Development:
```bash
# Update .env.local file
POSTGRES_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:7891/railway
```

### Step 5: Deploy Updated Code
```bash
# Commit perubahan jika ada
git add .
git commit -m "Add Railway PostgreSQL configuration"
git push origin master
```

### Step 6: Initialize Database
1. **Wait** sampai Vercel deployment selesai
2. **Visit**: `https://your-vercel-app.vercel.app/api/setup/database`
3. **Verify** response: `{"success": true, "message": "Database initialized"}`

**🚨 IMPORTANT**: Railway PostgreSQL starts empty! This step creates:
- ✅ `registrations` table (customer data)
- ✅ `payments` table (DOKU transactions) 
- ✅ `tickets` table (event tickets)
- ✅ Indexes for performance

### Step 7: Verify Tables Created
```bash
# Check database structure
curl "https://your-vercel-app.vercel.app/api/debug"
```

**Expected response should include**:
```json
{
  "database": {
    "provider": "Railway",
    "configured": true
  }
}
```

## 🎯 Railway Dashboard Overview

### Database Metrics:
- **Storage Used**: 0/1GB
- **Monthly Cost**: $0 (using free $5 credit)
- **Status**: Active
- **Region**: us-west (atau region terdekat)

### Free Tier Limits:
✅ **$5 credit** per month  
✅ **1GB storage**  
✅ **Unlimited queries**  
✅ **No time limits**  
✅ **Auto-sleep** when not used  

## 🔧 Advanced Configuration (Optional)

### Custom Database Name:
```sql
-- Connect via Railway PostgreSQL Console
CREATE DATABASE synergy_sea_summit;
```

### Connection Pooling:
```bash
# Add to environment variables for better performance
POSTGRES_URL_POOLED=postgresql://postgres:password@pooler.railway.app:5432/railway
```

### Backup Strategy:
```bash
# Manual backup via Railway CLI
railway login
railway pg:dump > backup.sql
```

## 🚨 Troubleshooting

### Issue: Connection Timeout
```bash
# Check if Railway service is active
railway status
```

### Issue: Database Not Found
```bash
# Recreate database
railway pg:create
```

### Issue: SSL Connection Error
```javascript
// Add to PostgreSQL connection in code
const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});
```

## 📊 Monitoring & Usage

### Check Usage:
1. **Railway Dashboard** → PostgreSQL service
2. **Metrics** tab
3. Monitor **Storage** dan **Compute** usage

### Cost Tracking:
- **Current**: $0/month (free credit)
- **Usage**: ~$0.02/day untuk event microsite
- **Estimate**: Total gratis untuk 6 bulan+

## 🎉 Success Indicators

✅ **Database created** in Railway  
✅ **Connection string** added to Vercel  
✅ **Tables initialized** via setup endpoint  
✅ **DOKU payment** saves to PostgreSQL  
✅ **Success page** reads from database  
✅ **Admin panel** displays data  

## 🔄 Migration Path (Future)

### Jika Perlu Upgrade:
```
Railway Free → Railway Pro ($5/month)
  ↓
More storage, guaranteed uptime, priority support
```

### Alternative Migration:
```
Railway → Supabase → Neon → Self-hosted
```

## 📞 Support

### Railway Community:
- **Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub**: [github.com/railwayapp](https://github.com/railwayapp)

---

**Next**: Setelah setup Railway, test full payment flow dari register → DOKU → success page dengan data tersimpan di PostgreSQL! 🚀
