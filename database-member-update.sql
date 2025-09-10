-- Database Schema Update - Add Member ID and Ticket Quantity
-- Run this in Railway PostgreSQL console to add new columns for member features

-- Add member_id and ticket_quantity columns to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS member_id VARCHAR(20),
ADD COLUMN IF NOT EXISTS ticket_quantity INTEGER DEFAULT 1;

-- Create index for member_id for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_member_id ON registrations(member_id);

-- Update existing records to have default ticket_quantity = 1
UPDATE registrations 
SET ticket_quantity = 1 
WHERE ticket_quantity IS NULL;

-- Make ticket_quantity NOT NULL with default value
ALTER TABLE registrations 
ALTER COLUMN ticket_quantity SET NOT NULL,
ALTER COLUMN ticket_quantity SET DEFAULT 1;

-- Verify new schema
\d registrations;

-- Show updated structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Sample query to test new columns
SELECT 
    id, 
    order_id, 
    full_name, 
    member_id, 
    ticket_quantity, 
    amount,
    status 
FROM registrations 
LIMIT 5;

-- Show total tickets by quantity
SELECT 
    ticket_quantity,
    COUNT(*) as registrations_count,
    SUM(ticket_quantity) as total_tickets
FROM registrations 
GROUP BY ticket_quantity
ORDER BY ticket_quantity;
