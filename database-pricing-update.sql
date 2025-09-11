-- pricing table for ticket management
CREATE TABLE IF NOT EXISTS pricing (
    id SERIAL PRIMARY KEY,
    ticket_type VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    label VARCHAR(100),
    promotional_text TEXT,
    early_bird_end TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);
