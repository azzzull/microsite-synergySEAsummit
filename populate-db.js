// Manual script to populate Railway database with test data
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function populateDatabase() {
  try {
    console.log('🔧 Connecting to Railway PostgreSQL...');
    
    // Create tables first
    await pool.query(`
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
    `);
    
    await pool.query(`
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
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        ticket_code VARCHAR(255) UNIQUE NOT NULL,
        qr_code TEXT,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'active'
      );
    `);
    
    console.log('✅ Tables created successfully');
    
    // Insert test data
    const testRegistrations = [
      {
        order_id: 'ORD001_' + Date.now(),
        full_name: 'John Doe',
        phone: '+628123456789',
        email: 'john.doe@email.com',
        date_of_birth: '1990-01-15',
        address: 'Jl. Sudirman No. 123, Jakarta',
        country: 'Indonesia',
        amount: 250000,
        status: 'confirmed'
      },
      {
        order_id: 'ORD002_' + Date.now(),
        full_name: 'Jane Smith',
        phone: '+628987654321',
        email: 'jane.smith@email.com',
        date_of_birth: '1985-06-20',
        address: 'Jl. Thamrin No. 456, Jakarta',
        country: 'Indonesia',
        amount: 250000,
        status: 'pending'
      },
      {
        order_id: 'ORD003_' + Date.now(),
        full_name: 'Michael Johnson',
        phone: '+6281122334455',
        email: 'michael.johnson@email.com',
        date_of_birth: '1992-03-10',
        address: 'Jl. Gatot Subroto No. 789, Jakarta',
        country: 'Indonesia',
        amount: 250000,
        status: 'confirmed'
      }
    ];
    
    for (const reg of testRegistrations) {
      await pool.query(`
        INSERT INTO registrations (
          order_id, full_name, phone, email, date_of_birth, 
          address, country, amount, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        reg.order_id, reg.full_name, reg.phone, reg.email, 
        reg.date_of_birth, reg.address, reg.country, reg.amount, reg.status
      ]);
      
      console.log(`✅ Inserted registration: ${reg.full_name}`);
      
      // Insert corresponding payment
      await pool.query(`
        INSERT INTO payments (
          order_id, amount, status
        )
        VALUES ($1, $2, $3)
      `, [reg.order_id, reg.amount, reg.status]);
      
      console.log(`✅ Inserted payment for: ${reg.order_id}`);
      
      // Insert ticket if confirmed
      if (reg.status === 'confirmed') {
        const ticketCode = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await pool.query(`
          INSERT INTO tickets (order_id, ticket_code, status)
          VALUES ($1, $2, $3)
        `, [reg.order_id, ticketCode, 'active']);
        
        console.log(`✅ Inserted ticket: ${ticketCode}`);
      }
    }
    
    // Verify data
    const registrationCount = await pool.query('SELECT COUNT(*) FROM registrations');
    const paymentCount = await pool.query('SELECT COUNT(*) FROM payments');
    const ticketCount = await pool.query('SELECT COUNT(*) FROM tickets');
    
    console.log('🎉 Database populated successfully!');
    console.log(`📊 Registrations: ${registrationCount.rows[0].count}`);
    console.log(`💳 Payments: ${paymentCount.rows[0].count}`);
    console.log(`🎫 Tickets: ${ticketCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await pool.end();
  }
}

populateDatabase();
