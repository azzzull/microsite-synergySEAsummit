-- Add voucher support columns to registrations table
-- This script adds support for voucher codes, original amounts, and discount amounts

-- Add voucher-related columns to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS original_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12,2) DEFAULT 0;

-- Create index on voucher_code for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_voucher_code ON registrations(voucher_code);

-- Update existing records to have original_amount = amount where original_amount is null
UPDATE registrations 
SET original_amount = amount 
WHERE original_amount IS NULL;

-- Update existing records to have discount_amount = 0 where discount_amount is null
UPDATE registrations 
SET discount_amount = 0 
WHERE discount_amount IS NULL;

-- Create vouchers table for managing voucher codes
CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(12,2) NOT NULL,
    description TEXT,
    min_purchase DECIMAL(12,2) DEFAULT 0,
    max_discount DECIMAL(12,2),
    expiry_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample vouchers
INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active) 
VALUES 
    ('WELCOME10', 'percentage', 10, '10% discount for new members', 0, 50000, true),
    ('SAVE25K', 'fixed', 25000, 'Rp 25,000 off your order', 100000, null, true),
    ('EARLYBIRD', 'percentage', 15, '15% early bird discount', 0, 75000, true),
    ('STUDENT20', 'percentage', 20, '20% student discount', 0, 100000, true),
    ('BULK50K', 'fixed', 50000, 'Rp 50,000 off for bulk orders', 500000, null, true)
ON CONFLICT (code) DO NOTHING;

-- Create index on voucher code for better performance
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active);

-- Add voucher usage tracking
CREATE TABLE IF NOT EXISTS voucher_usage (
    id SERIAL PRIMARY KEY,
    voucher_code VARCHAR(50) NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    discount_amount DECIMAL(12,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_code) REFERENCES vouchers(code)
);

-- Create indexes for voucher usage tracking
CREATE INDEX IF NOT EXISTS idx_voucher_usage_code ON voucher_usage(voucher_code);
CREATE INDEX IF NOT EXISTS idx_voucher_usage_order ON voucher_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_voucher_usage_email ON voucher_usage(user_email);

-- Function to update voucher used_count
CREATE OR REPLACE FUNCTION update_voucher_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vouchers 
    SET used_count = used_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE code = NEW.voucher_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update voucher usage count
DROP TRIGGER IF EXISTS trigger_update_voucher_usage ON voucher_usage;
CREATE TRIGGER trigger_update_voucher_usage
    AFTER INSERT ON voucher_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_voucher_usage_count();

COMMENT ON TABLE registrations IS 'Updated to support voucher codes and discount tracking';
COMMENT ON COLUMN registrations.voucher_code IS 'Voucher code used for this registration';
COMMENT ON COLUMN registrations.original_amount IS 'Original amount before discount';
COMMENT ON COLUMN registrations.discount_amount IS 'Discount amount applied';

COMMENT ON TABLE vouchers IS 'Voucher codes and their configurations';
COMMENT ON TABLE voucher_usage IS 'Tracking of voucher usage per order';
