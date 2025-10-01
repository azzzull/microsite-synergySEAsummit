const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://postgres:QAiTIKAwYOjZBnOxDPrjtVbwujpYwKQR@switchyard.proxy.rlwy.net:12836/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const testQuery = await pool.query('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Basic query result:', testQuery.rows[0]);
    
    // Test tickets table structure
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tickets' 
      ORDER BY ordinal_position
    `);
    console.log('📋 Tickets table structure:');
    tableStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Test VIP ticket creation
    console.log('\n🎫 Testing VIP ticket creation...');
    
    const ticketId = `VIP-SSS2025-${Date.now()}-test01`;
    const orderId = `TEST-${Date.now()}`;
    
    const insertQuery = `
      INSERT INTO tickets (
        order_id, ticket_code, qr_code, status,
        participant_name, participant_email, participant_phone,
        event_name, event_date, event_location, email_sent,
        ticket_type, is_complimentary, is_vip
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const params = [
      orderId, 
      ticketId, 
      'https://example.com/qr', 
      'active',
      'Test VIP User',
      'test@example.com',
      '+628123456789',
      'Synergy SEA Summit 2025',
      'November 8, 2025',
      'The Stones Hotel, Legian Bali',
      false,
      'vip',
      true,
      true
    ];
    
    const result = await pool.query(insertQuery, params);
    console.log('✅ VIP Ticket created successfully:', result.rows[0]);
    
    // Test retrieve ticket
    const retrieveQuery = await pool.query('SELECT * FROM tickets WHERE ticket_code = $1', [ticketId]);
    console.log('✅ Retrieved ticket:', retrieveQuery.rows[0]);
    
    // Cleanup test ticket
    await pool.query('DELETE FROM tickets WHERE ticket_code = $1', [ticketId]);
    console.log('🧹 Test ticket cleaned up');
    
  } catch (error) {
    console.error('💥 Database test error:', error);
    console.error('💥 Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  } finally {
    await pool.end();
  }
}

testDatabase();