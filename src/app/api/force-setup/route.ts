import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    console.log('🔧 Force creating database tables...');
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        success: false,
        error: 'POSTGRES_URL not configured'
      }, { status: 500 });
    }

    // Drop tables if exist (for fresh start)
    await sql`DROP TABLE IF EXISTS tickets CASCADE;`;
    await sql`DROP TABLE IF EXISTS payments CASCADE;`;
    await sql`DROP TABLE IF EXISTS registrations CASCADE;`;

    // Create registrations table
    await sql`
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
    `;

    // Create payments table
    await sql`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create tickets table
    await sql`
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        ticket_code VARCHAR(255) UNIQUE NOT NULL,
        qr_code TEXT,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'active'
      );
    `;

    // Create indexes
    await sql`CREATE INDEX idx_registrations_order_id ON registrations(order_id);`;
    await sql`CREATE INDEX idx_registrations_email ON registrations(email);`;
    await sql`CREATE INDEX idx_payments_order_id ON payments(order_id);`;
    await sql`CREATE INDEX idx_tickets_order_id ON tickets(order_id);`;
    await sql`CREATE INDEX idx_tickets_code ON tickets(ticket_code);`;

    // Verify tables created
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = current_schema() 
      AND table_name IN ('registrations', 'payments', 'tickets')
      ORDER BY table_name;
    `;

    // Insert test data
    await sql`
      INSERT INTO registrations (order_id, full_name, phone, email, date_of_birth, address, country, status)
      VALUES ('FORCE_SETUP_TEST', 'Force Setup Test', '+628123456789', 'forcetest@synergyseasummit.com', '1990-01-01', 'Force Setup Address', 'Indonesia', 'test');
    `;

    return NextResponse.json({
      success: true,
      message: '✅ Database tables force created successfully!',
      tables_created: tables.rows.map(t => t.table_name),
      total_tables: tables.rowCount,
      test_data_inserted: true,
      railway_note: 'Tables should now be visible in Railway console. Refresh the page.',
      next_steps: [
        '1. Refresh Railway console to see tables',
        '2. Check /api/database-inspect for verification',
        '3. Test registration flow',
        '4. Tables: registrations, payments, tickets'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Force table creation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to force create tables',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to force create tables',
    usage: 'curl -X POST /api/force-setup',
    warning: 'This will DROP and recreate all tables'
  });
}
