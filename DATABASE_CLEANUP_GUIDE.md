# 🧹 Database Cleanup Script - Pre-Production

## 📋 Overview
Script untuk membersihkan test data sebelum go-live production, tanpa perlu setup database baru.

---

## 🎯 Strategi Database Migration

### ✅ **Keep Existing Database** (Smart Choice!)
- ✅ **Database schema** sudah perfect
- ✅ **Connection** sudah stable 
- ✅ **Environment variables** sudah set
- ✅ **Performance** sudah tested

### 🧹 **Just Clean Test Data**
- 🗑️ Clear test registrations
- 🗑️ Clear test payments  
- 🗑️ Clear test tickets
- ✅ Keep database structure

---

## 🛠️ Database Cleanup Commands

### **Option 1: Complete Reset** (Recommended)
```sql
-- Clear all test data but keep schema
TRUNCATE TABLE tickets RESTART IDENTITY CASCADE;
TRUNCATE TABLE payments RESTART IDENTITY CASCADE; 
TRUNCATE TABLE registrations RESTART IDENTITY CASCADE;

-- Reset auto-increment counters
ALTER SEQUENCE registrations_id_seq RESTART WITH 1;
ALTER SEQUENCE payments_id_seq RESTART WITH 1;
ALTER SEQUENCE tickets_id_seq RESTART WITH 1;

-- Verify cleanup
SELECT COUNT(*) as registrations_count FROM registrations;
SELECT COUNT(*) as payments_count FROM payments;
SELECT COUNT(*) as tickets_count FROM tickets;
```

### **Option 2: Selective Cleanup** (If you want to keep some data)
```sql
-- Delete test registrations (keep production-like ones)
DELETE FROM tickets WHERE participant_email LIKE '%test%' OR participant_email LIKE '%@gmail.com';
DELETE FROM payments WHERE order_id LIKE '%test%' OR status = 'pending';
DELETE FROM registrations WHERE email LIKE '%test%' OR email LIKE '%@gmail.com';

-- Or delete by date (keep recent production-ready tests)
DELETE FROM registrations WHERE created_at < '2025-09-10';
DELETE FROM payments WHERE created_at < '2025-09-10';
DELETE FROM tickets WHERE created_at < '2025-09-10';
```

### **Option 3: Admin Panel Cleanup** (Easiest)
```
1. Go to https://your-domain.com/admin
2. Use "Reset Database" feature
3. Confirm cleanup
```

---

## 🚀 Pre-Launch Cleanup Script

### **Run this before go-live:**

```bash
#!/bin/bash

echo "🧹 Pre-Production Database Cleanup"
echo "================================="

# Get database URL (from environment or manual input)
if [ -z "$DATABASE_URL" ]; then
    echo "Enter your DATABASE_URL:"
    read -r DATABASE_URL
fi

# Backup before cleanup (optional)
echo "📦 Creating backup..."
pg_dump $DATABASE_URL > backup_pre_cleanup_$(date +%Y%m%d_%H%M%S).sql

# Cleanup test data
echo "🗑️ Cleaning test data..."
psql $DATABASE_URL << 'EOF'
-- Clear all test data
TRUNCATE TABLE tickets RESTART IDENTITY CASCADE;
TRUNCATE TABLE payments RESTART IDENTITY CASCADE; 
TRUNCATE TABLE registrations RESTART IDENTITY CASCADE;

-- Reset sequences
ALTER SEQUENCE registrations_id_seq RESTART WITH 1;
ALTER SEQUENCE payments_id_seq RESTART WITH 1;
ALTER SEQUENCE tickets_id_seq RESTART WITH 1;

-- Verify cleanup
\echo 'Cleanup verification:'
SELECT 'registrations' as table_name, COUNT(*) as count FROM registrations
UNION ALL
SELECT 'payments' as table_name, COUNT(*) as count FROM payments
UNION ALL
SELECT 'tickets' as table_name, COUNT(*) as count FROM tickets;
EOF

echo "✅ Database cleanup complete!"
echo "🎯 Ready for production launch!"
```

---

## 📊 Verification Queries

### **Check if cleanup successful:**
```sql
-- Should all return 0
SELECT COUNT(*) FROM registrations; -- Should be 0
SELECT COUNT(*) FROM payments;      -- Should be 0  
SELECT COUNT(*) FROM tickets;       -- Should be 0

-- Check table structure (should be intact)
\d registrations
\d payments
\d tickets
```

### **Test with fresh data:**
```sql
-- Test insert (should start with ID = 1)
INSERT INTO registrations (email, full_name, status) 
VALUES ('test@production.com', 'Production Test', 'pending');

SELECT * FROM registrations; -- Should show ID = 1
```

---

## ⚠️ Important Notes

### **Before Cleanup:**
- [ ] **Backup important data** (if any)
- [ ] **Notify team** about cleanup timing
- [ ] **Test backup restore** (if needed)

### **After Cleanup:**
- [ ] **Verify tables are empty** but structure intact
- [ ] **Test registration flow** with fresh data
- [ ] **Test payment flow** end-to-end
- [ ] **Check auto-increment** starts from 1

### **Production Launch Day:**
- [ ] **Final cleanup** (remove any last-minute tests)
- [ ] **Monitor first real registration**
- [ ] **Check email delivery**
- [ ] **Verify payment processing**

---

## 🎯 Advantages of This Approach

### ✅ **Benefits:**
- 🚀 **Faster migration** (no new DB setup)
- 🔒 **Proven stability** (same DB that worked in testing)
- 💰 **Cost effective** (no additional DB instance)
- 🛡️ **Less risk** (known performance characteristics)
- 📊 **Keep schema optimizations** (all indexes, constraints intact)

### ✅ **What We Keep:**
- Database schema & structure
- Indexes & constraints  
- Environment variables
- Connection pooling settings
- Performance optimizations

### 🗑️ **What We Remove:**
- Test registration data
- Test payment records
- Test tickets & emails
- Development artifacts

---

## 🔧 Alternative: Admin Panel Reset

If you prefer UI approach:
1. Go to `/admin` panel
2. Use "Reset Database" feature  
3. Confirm cleanup
4. Verify with fresh test registration

---

**🎉 This approach is perfect! Keep the proven database, just clean the data!**
