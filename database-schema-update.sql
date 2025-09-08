-- Database Schema Update for Tickets Table
-- Run this in Railway PostgreSQL console to add missing columns

-- Add missing columns to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS participant_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS participant_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS participant_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS event_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS event_date VARCHAR(100),
ADD COLUMN IF NOT EXISTS event_location TEXT,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_tickets_participant_email ON tickets(participant_email);
CREATE INDEX IF NOT EXISTS idx_tickets_email_sent ON tickets(email_sent);

-- Verify new schema
\d tickets;

-- Show updated structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tickets' 
ORDER BY ordinal_position;
