# Voucher Management Guide

## Current Methods for Managing Vouchers

### Method 1: Direct Database Access (Railway CLI)

#### Add New Voucher:
```bash
# Connect to Railway database
source .env.local
psql "$DATABASE_URL" -c "
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('NEWCODE20', 'percentage', 20, 'Special 20% discount', 0, 100000, true);
"
```

#### Edit Existing Voucher:
```bash
# Update voucher
psql "$DATABASE_URL" -c "
UPDATE vouchers 
SET value = 25, description = 'Updated 25% discount' 
WHERE code = 'NEWCODE20';
"
```

#### Deactivate Voucher:
```bash
# Disable voucher
psql "$DATABASE_URL" -c "
UPDATE vouchers 
SET is_active = false 
WHERE code = 'OLDCODE';
"
```

#### View All Vouchers:
```bash
# List all vouchers
psql "$DATABASE_URL" -c "
SELECT code, type, value, description, is_active, used_count 
FROM vouchers 
ORDER BY created_at DESC;
"
```

### Method 2: API Endpoints (Development Mode)

You can create simple API endpoints for voucher management:

#### GET All Vouchers:
```
GET /api/admin/vouchers
```

#### POST New Voucher:
```
POST /api/admin/vouchers
{
  "code": "SAVE30K",
  "type": "fixed",
  "value": 30000,
  "description": "Rp 30,000 off your order",
  "min_purchase": 150000,
  "is_active": true
}
```

#### PUT Update Voucher:
```
PUT /api/admin/vouchers/SAVE30K
{
  "value": 35000,
  "description": "Updated: Rp 35,000 off your order"
}
```

#### DELETE Deactivate Voucher:
```
DELETE /api/admin/vouchers/SAVE30K
```

## Quick Voucher Templates

### Percentage Vouchers:
```sql
-- 10% discount for new users
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('WELCOME10', 'percentage', 10, '10% welcome discount', 0, 50000, true);

-- 15% early bird
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('EARLY15', 'percentage', 15, '15% early bird special', 0, 75000, true);

-- 25% flash sale
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('FLASH25', 'percentage', 25, '25% flash sale', 200000, 150000, true);
```

### Fixed Amount Vouchers:
```sql
-- Rp 20,000 off
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('SAVE20K', 'fixed', 20000, 'Rp 20,000 instant discount', 100000, null, true);

-- Rp 50,000 bulk discount
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES ('BULK50K', 'fixed', 50000, 'Rp 50,000 bulk order discount', 500000, null, true);
```

### Seasonal Vouchers:
```sql
-- Christmas special
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, expiry_date, is_active) 
VALUES ('XMAS2025', 'percentage', 20, 'Christmas 2025 special', 0, 100000, '2025-12-31 23:59:59+07', true);

-- New Year promo
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, expiry_date, is_active) 
VALUES ('NEWYEAR25', 'fixed', 25000, 'New Year 2025 celebration', 150000, null, '2025-01-31 23:59:59+07', true);
```

## Bulk Operations

### Deactivate All Expired Vouchers:
```sql
UPDATE vouchers 
SET is_active = false 
WHERE expiry_date < NOW() AND is_active = true;
```

### Clean Up Old Vouchers:
```sql
-- Archive old inactive vouchers (optional)
UPDATE vouchers 
SET description = CONCAT('[ARCHIVED] ', description)
WHERE is_active = false AND created_at < NOW() - INTERVAL '6 months';
```

### Reset Usage Count:
```sql
-- Reset usage count for specific voucher
UPDATE vouchers 
SET used_count = 0 
WHERE code = 'VOUCHER_CODE';
```

## Monitoring & Analytics

### Check Voucher Usage:
```sql
SELECT 
    v.code,
    v.type,
    v.value,
    v.used_count,
    v.usage_limit,
    COUNT(vu.id) as actual_usage,
    SUM(vu.discount_amount) as total_discount_given
FROM vouchers v
LEFT JOIN voucher_usage vu ON v.code = vu.voucher_code
GROUP BY v.id
ORDER BY v.used_count DESC;
```

### Top Performing Vouchers:
```sql
SELECT 
    code,
    description,
    used_count,
    SUM(vu.discount_amount) as total_savings
FROM vouchers v
LEFT JOIN voucher_usage vu ON v.code = vu.voucher_code
WHERE v.is_active = true
GROUP BY v.id
ORDER BY used_count DESC
LIMIT 10;
```

### Recent Voucher Usage:
```sql
SELECT 
    vu.voucher_code,
    vu.order_id,
    vu.user_email,
    vu.discount_amount,
    vu.used_at
FROM voucher_usage vu
ORDER BY vu.used_at DESC
LIMIT 20;
```
