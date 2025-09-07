# 🐘 Vercel Postgres Setup for Synergy SEA Summit 2025

## 🎯 Overview
Migrasi dari JSON file storage ke **Vercel Postgres** - database yang sudah terintegrasi dengan Vercel platform.

## � Quick Setup dengan Vercel Postgres

### 1. Enable Vercel Postgres
1. **Go to Vercel Dashboard** → Your Project → Storage
2. **Click "Create Database"** → **Select "Postgres"**
3. **Choose region** (Singapore/Tokyo untuk latency optimal)
4. **Database akan otomatis provisioned**

### 2. Environment Variables (Auto-Generated)
Vercel akan otomatis menambahkan environment variables ini:
```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NO_SSL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 3. Install Vercel Postgres SDK
```bash
npm install @vercel/postgres
```

**No need for manual connection strings!** Semua sudah di-handle Vercel.

## 📊 Database Schema

```sql
-- Registrations Table
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL DEFAULT 250000,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255),
    amount INTEGER NOT NULL,
    payment_method VARCHAR(100),
    payment_url TEXT,
    token_id VARCHAR(255),
    expired_date VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES registrations(order_id)
);

-- Tickets Table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    ticket_code VARCHAR(255) UNIQUE NOT NULL,
    qr_code TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    FOREIGN KEY (order_id) REFERENCES registrations(order_id)
);

-- Indexes for performance
CREATE INDEX idx_registrations_order_id ON registrations(order_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_tickets_order_id ON tickets(order_id);
CREATE INDEX idx_tickets_code ON tickets(ticket_code);
```

## 💡 Vercel Postgres Benefits

✅ **Zero Config**: Environment variables auto-generated
✅ **Same Region**: Database di region yang sama dengan functions
✅ **Connection Pooling**: Built-in connection pooling
✅ **Auto Scaling**: Scales dengan traffic Vercel functions
✅ **Backup**: Automated backups included
✅ **Security**: SSL connections by default
✅ **Monitoring**: Built-in monitoring di Vercel dashboard

## 🔧 Implementation Steps

### Step 1: Create Database
1. **Vercel Dashboard** → Project → **Storage tab**
2. **"Create Database"** → **"Postgres"**
3. **Wait for provisioning** (2-3 minutes)

### Step 2: Install Dependencies
```bash
npm install @vercel/postgres
```

### Step 3: Update Code
Replace JSON file storage dengan Vercel Postgres SDK

### Step 4: Deploy & Test
```bash
git add . && git commit -m "Add Vercel Postgres integration" && git push
```

## ⚡ Quick Start

Setelah database created, kita tinggal:
1. **Install `@vercel/postgres`**
2. **Update database.ts** dengan Vercel Postgres
3. **Run schema SQL** di Vercel dashboard
4. **Deploy**

**Total setup time: 15-20 menit!** 🚀

## 🎯 Next Action

Mau saya langsung implement **Vercel Postgres integration** sekarang? 

1. Anda create database di Vercel Dashboard dulu
2. Saya update code untuk menggunakan Vercel Postgres
3. Deploy dan test

Ready? 🚀

## 🔄 Migration Strategy

### Phase 1: Parallel Storage
- Keep existing JSON file system
- Add PostgreSQL storage alongside
- Sync data between both systems

### Phase 2: PostgreSQL Primary
- Make PostgreSQL primary data source
- JSON files as backup/fallback
- Test thoroughly

### Phase 3: Full Migration
- Remove JSON file dependencies
- PostgreSQL only
- Clean up old code

## 🚀 Implementation Benefits

✅ **Production Ready**: Reliable data persistence
✅ **Scalable**: Handle thousands of registrations
✅ **ACID Compliance**: Data integrity guaranteed
✅ **Performance**: Indexed queries, connection pooling
✅ **Backup**: Automated backups available
✅ **Analytics**: Easy reporting and analytics

## 📊 Estimated Migration Time
- **Setup Database**: 30 minutes
- **Create Schema**: 15 minutes
- **Update Code**: 1-2 hours
- **Testing**: 30 minutes
- **Total**: 2-3 hours

## 🔧 Next Steps
1. Choose PostgreSQL provider (Vercel Postgres recommended)
2. Create database and get connection string
3. Update environment variables
4. Implement PostgreSQL database layer
5. Test and deploy

Ready to proceed with PostgreSQL setup? 🚀
