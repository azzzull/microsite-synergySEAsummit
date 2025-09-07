# 🔧 Environment Variables Setup

## Add to Vercel Dashboard:

1. **Go to**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select**: microsite-synergy project
3. **Settings** → **Environment Variables**
4. **Add the following variables:**

### Production Environment Variables:
```
Name: POSTGRES_URL
Value: postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/railway
Environment: Production, Preview, Development
```

### Local Development (.env.local):
```bash
# Replace this with your actual Railway connection string
POSTGRES_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/railway
```

## Example Railway Connection String:
```
postgresql://postgres:xG7k9mP2nR8vQ5eL@containers-us-west-42.railway.app:7891/railway
```

## Test Commands After Setup:

### 1. Test Connection:
```bash
curl "https://your-app.vercel.app/api/test/railway-connection"
```

### 2. Initialize Database:
```bash
curl "https://your-app.vercel.app/api/setup/database"
```

### 3. Check Environment:
```bash
curl "https://your-app.vercel.app/api/debug"
```

## Expected Success Response:
```json
{
  "success": true,
  "message": "Railway PostgreSQL connection successful! 🚂",
  "database": {
    "version": "PostgreSQL 17.6...",
    "database": "railway",
    "user": "postgres"
  }
}
```
