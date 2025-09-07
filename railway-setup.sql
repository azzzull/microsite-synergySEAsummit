-- Railway Database Population Script
-- Run this directly in Railway PostgreSQL console

-- Create tables
CREATE TABLE IF NOT EXISTS registrations (
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

CREATE TABLE IF NOT EXISTS payments (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  ticket_code VARCHAR(255) UNIQUE NOT NULL,
  qr_code TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_order_id ON registrations(order_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);

-- Insert test data
INSERT INTO registrations (order_id, full_name, phone, email, date_of_birth, address, country, amount, status) VALUES
('ORD001_1757262800001', 'John Doe', '+628123456789', 'john.doe@email.com', '1990-01-15', 'Jl. Sudirman No. 123, Jakarta', 'Indonesia', 250000, 'confirmed'),
('ORD002_1757262800002', 'Jane Smith', '+628987654321', 'jane.smith@email.com', '1985-06-20', 'Jl. Thamrin No. 456, Jakarta', 'Indonesia', 250000, 'pending'),
('ORD003_1757262800003', 'Michael Johnson', '+6281122334455', 'michael.johnson@email.com', '1992-03-10', 'Jl. Gatot Subroto No. 789, Jakarta', 'Indonesia', 250000, 'confirmed'),
('ORD004_1757262800004', 'Sarah Wilson', '+6281233344455', 'sarah.wilson@email.com', '1988-12-05', 'Jl. Menteng No. 321, Jakarta', 'Indonesia', 250000, 'confirmed'),
('ORD005_1757262800005', 'David Brown', '+6281344455566', 'david.brown@email.com', '1991-08-22', 'Jl. Senopati No. 654, Jakarta', 'Indonesia', 250000, 'pending');

INSERT INTO payments (order_id, amount, status, payment_method, transaction_id) VALUES
('ORD001_1757262800001', 250000, 'confirmed', 'bank_transfer', 'TXN001_CONFIRMED'),
('ORD002_1757262800002', 250000, 'pending', 'virtual_account', NULL),
('ORD003_1757262800003', 250000, 'confirmed', 'credit_card', 'TXN003_CONFIRMED'),
('ORD004_1757262800004', 250000, 'confirmed', 'bank_transfer', 'TXN004_CONFIRMED'),
('ORD005_1757262800005', 250000, 'pending', 'virtual_account', NULL);

INSERT INTO tickets (order_id, ticket_code, status) VALUES
('ORD001_1757262800001', 'TKT_1757262800001_ABC123', 'active'),
('ORD003_1757262800003', 'TKT_1757262800003_DEF456', 'active'),
('ORD004_1757262800004', 'TKT_1757262800004_GHI789', 'active');

-- Verify data
SELECT 'Registrations' as table_name, COUNT(*) as count FROM registrations
UNION ALL
SELECT 'Payments' as table_name, COUNT(*) as count FROM payments  
UNION ALL
SELECT 'Tickets' as table_name, COUNT(*) as count FROM tickets;

-- Show sample data
SELECT 'REGISTRATIONS SAMPLE:' as info;
SELECT id, order_id, full_name, email, status, created_at FROM registrations LIMIT 3;

SELECT 'PAYMENTS SAMPLE:' as info;
SELECT id, order_id, amount, status, payment_method, created_at FROM payments LIMIT 3;

SELECT 'TICKETS SAMPLE:' as info;
SELECT id, order_id, ticket_code, status, issued_at FROM tickets LIMIT 3;
