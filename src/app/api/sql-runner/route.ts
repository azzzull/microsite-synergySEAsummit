import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

// Simple SQL runner for database setup
export async function POST(request: NextRequest) {
  try {
    const { sql, action } = await request.json();
    
    console.log('🔧 SQL Runner executing:', action || 'custom query');
    
    if (action === 'setup') {
      // Initialize database with our setup script
      const result = await postgresDb.initializeDatabase();
      
      if (result.success) {
        // Add sample data
        const sampleData = await addSampleData();
        return NextResponse.json({
          success: true,
          message: 'Database setup completed with sample data',
          sampleData: sampleData
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
    }
    
    if (sql) {
      // Execute custom SQL
      const result = await executeCustomSQL(sql);
      return NextResponse.json({
        success: true,
        result: result
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'No SQL query provided'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ SQL Runner error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function executeCustomSQL(sql: string) {
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const result = await pool.query(sql);
    return {
      rowCount: result.rowCount,
      rows: result.rows,
      command: result.command
    };
  } finally {
    await pool.end();
  }
}

async function addSampleData() {
  try {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Insert sample registrations
    await pool.query(`
      INSERT INTO registrations (order_id, full_name, phone, email, date_of_birth, address, country, amount, status) VALUES
      ('ORD001_' || EXTRACT(EPOCH FROM NOW()), 'John Doe', '+628123456789', 'john.doe@email.com', '1990-01-15', 'Jl. Sudirman No. 123, Jakarta', 'Indonesia', 250000, 'confirmed'),
      ('ORD002_' || EXTRACT(EPOCH FROM NOW()), 'Jane Smith', '+628987654321', 'jane.smith@email.com', '1985-06-20', 'Jl. Thamrin No. 456, Jakarta', 'Indonesia', 250000, 'pending'),
      ('ORD003_' || EXTRACT(EPOCH FROM NOW()), 'Michael Johnson', '+6281122334455', 'michael.johnson@email.com', '1992-03-10', 'Jl. Gatot Subroto No. 789, Jakarta', 'Indonesia', 250000, 'confirmed')
      ON CONFLICT (order_id) DO NOTHING;
    `);

    // Insert sample payments
    await pool.query(`
      INSERT INTO payments (order_id, amount, status, payment_method) 
      SELECT order_id, amount, status, 'bank_transfer' 
      FROM registrations 
      WHERE NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = registrations.order_id);
    `);

    // Insert sample tickets for confirmed registrations
    await pool.query(`
      INSERT INTO tickets (order_id, ticket_code, status)
      SELECT 
        order_id, 
        'TKT_' || EXTRACT(EPOCH FROM NOW()) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6),
        'active'
      FROM registrations 
      WHERE status = 'confirmed' 
        AND NOT EXISTS (SELECT 1 FROM tickets t WHERE t.order_id = registrations.order_id);
    `);

    // Get counts
    const regCount = await pool.query('SELECT COUNT(*) FROM registrations');
    const payCount = await pool.query('SELECT COUNT(*) FROM payments');
    const ticketCount = await pool.query('SELECT COUNT(*) FROM tickets');

    await pool.end();

    return {
      registrations: regCount.rows[0].count,
      payments: payCount.rows[0].count,
      tickets: ticketCount.rows[0].count
    };
  } catch (error) {
    console.error('Error adding sample data:', error);
    throw error;
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SQL Runner API',
    usage: {
      setup: 'POST with { "action": "setup" } to initialize database with sample data',
      custom: 'POST with { "sql": "SELECT * FROM table" } to run custom queries'
    }
  });
}
