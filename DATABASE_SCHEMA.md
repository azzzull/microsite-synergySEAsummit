# 🗄️ Railway Database Schema

## Railway PostgreSQL Database Structure

### Tables Created by `/api/setup/database`:

```sql
-- 1. REGISTRATIONS TABLE
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

-- 2. PAYMENTS TABLE  
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
  payment_data JSONB,  -- DOKU response data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TICKETS TABLE
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  ticket_code VARCHAR(255) UNIQUE NOT NULL,
  qr_code TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_registrations_order_id ON registrations(order_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_tickets_order_id ON tickets(order_id);
CREATE INDEX idx_tickets_code ON tickets(ticket_code);
```

## Data Flow:

```
1. User Register → INSERT INTO registrations
2. DOKU Payment → INSERT INTO payments  
3. Payment Success → UPDATE registrations.status
4. Generate Ticket → INSERT INTO tickets
```

## Sample Data:

### Registration Record:
```json
{
  "id": 1,
  "order_id": "ORDER_1725716742123",
  "full_name": "John Doe", 
  "email": "john@example.com",
  "amount": 250000,
  "status": "completed"
}
```

### Payment Record:
```json
{
  "id": 1,
  "order_id": "ORDER_1725716742123",
  "transaction_id": "TXN_DOKU_123456",
  "amount": 250000,
  "payment_method": "credit_card",
  "status": "success",
  "payment_data": {
    "doku_response": {...}
  }
}
```

### Ticket Record:
```json
{
  "id": 1,
  "order_id": "ORDER_1725716742123", 
  "ticket_code": "TKT_1725716742123_abc123",
  "status": "active"
}
```

## Database Setup Verification:

After running `/api/setup/database`, check tables exist:

```sql
-- Connect via Railway PostgreSQL console
\dt  -- List all tables

-- Should show:
-- registrations
-- payments  
-- tickets
```

## Troubleshooting:

### Issue: Tables not created
```bash
# Re-run setup endpoint
curl "https://your-app.vercel.app/api/setup/database"
```

### Issue: Permission denied
```bash
# Check connection string in environment variables
curl "https://your-app.vercel.app/api/debug"
```

### Issue: Connection timeout
```bash
# Test Railway connection first
curl "https://your-app.vercel.app/api/test/railway-connection"
```
