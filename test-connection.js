// Simple connection test to Railway PostgreSQL
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔗 Attempting to connect to Railway PostgreSQL...');
    console.log('Connection string (masked):', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test simple query
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version);
    
    // Check if tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', tables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Host not found - check if Railway database is running');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection refused - check port and firewall');
    } else if (error.code === 'ECONNRESET') {
      console.log('💡 Connection reset - SSL configuration issue');
    }
  } finally {
    await client.end();
  }
}

testConnection();
