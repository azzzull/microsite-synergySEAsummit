// Railway PostgreSQL Database Layer using pg
import { Pool } from 'pg';

// Create a connection pool for Railway PostgreSQL with robust configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 3, // Reduced max connections for Railway
  idleTimeoutMillis: 20000, // Shorter idle timeout
  connectionTimeoutMillis: 15000, // Longer connection timeout
  allowExitOnIdle: true, // Allow the pool to exit when all connections are idle (good for serverless)
  query_timeout: 30000, // Query timeout
  application_name: 'synergy-vercel', // Application name for connection tracking
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

export class PostgresDatabase {
  private async executeQuery(text: string, params: any[] = [], retries: number = 2): Promise<any> {
    let client;
    let attempt = 0;
    
    while (attempt <= retries) {
      try {
        console.log(`🔗 Attempting to connect to PostgreSQL (attempt ${attempt + 1}/${retries + 1})...`);
        client = await pool.connect();
        console.log('✅ Connected to PostgreSQL successfully');
        
        const result = await client.query(text, params);
        console.log('📊 Query executed successfully');
        
        return result;
      } catch (error) {
        console.error(`❌ Database query error (attempt ${attempt + 1}):`, error);
        console.error('Error type:', error instanceof Error ? error.constructor.name : 'Unknown');
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        
        // Log connection string (without credentials) for debugging
        const connectionInfo = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        if (connectionInfo) {
          try {
            const urlObj = new URL(connectionInfo);
            console.log('🔧 Attempting connection to:', `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}${urlObj.pathname}`);
          } catch (urlError) {
            console.log('🔧 Connection string format issue');
          }
        }
        
        // Check if it's a connection error that might benefit from retry
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isRetryableError = errorMessage.includes('ECONNRESET') || 
                                errorMessage.includes('ENOTFOUND') || 
                                errorMessage.includes('ECONNREFUSED') ||
                                errorMessage.includes('timeout');
        
        if (isRetryableError && attempt < retries) {
          console.log(`🔄 Retrying connection in 1 second... (${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
          attempt++;
          continue;
        }
        
        throw error;
      } finally {
        if (client) {
          console.log('🔄 Releasing database connection');
          client.release();
        }
      }
    }
  }

  // Alternative method: Direct connection without pool for problematic queries
  private async executeQueryDirect(text: string, params: any[] = []): Promise<any> {
    const { Client } = require('pg');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 15000,
      query_timeout: 30000,
      application_name: 'synergy-vercel-direct',
    });

    try {
      console.log('🔗 Direct connection to PostgreSQL...');
      await client.connect();
      console.log('✅ Direct connection established');
      
      const result = await client.query(text, params);
      console.log('📊 Direct query executed successfully');
      
      return result;
    } catch (error) {
      console.error('❌ Direct connection error:', error);
      throw error;
    } finally {
      try {
        await client.end();
        console.log('🔄 Direct connection closed');
      } catch (closeError) {
        console.error('❌ Error closing direct connection:', closeError);
      }
    }
  }

  async createRegistration(data: any) {
    try {
      console.log('🔧 Creating registration with PostgreSQL...');
      
      const queryText = `
        INSERT INTO registrations (
          order_id, full_name, phone, email, date_of_birth, 
          address, country, amount, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      
      const params = [
        data.orderId, data.fullName, data.phone, 
        data.email, data.dob, data.address, 
        data.country, data.amount, data.status || 'pending'
      ];

      const result = await this.executeQuery(queryText, params);
      const registration = result.rows[0];
      console.log('📝 Registration created in Postgres:', registration.id);
      
      return { 
        success: true, 
        registration: {
          ...registration,
          id: `REG_${registration.id}`,
          orderId: registration.order_id,
          fullName: registration.full_name,
          createdAt: registration.created_at,
          updatedAt: registration.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Error creating registration:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createPayment(data: any) {
    try {
      const queryText = `
        INSERT INTO payments (
          order_id, transaction_id, amount, payment_method, 
          payment_url, token_id, expired_date, status, payment_data
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      
      const params = [
        data.order_id, data.transaction_id || null, 
        data.amount, data.payment_method || null,
        data.payment_url || null, data.token_id || null,
        data.expired_date || null, data.status || 'pending',
        JSON.stringify(data.payment_data || {})
      ];

      const result = await this.executeQuery(queryText, params);
      const payment = result.rows[0];
      console.log('💳 Payment created in Postgres:', payment.id);
      
      return { 
        success: true, 
        payment: {
          ...payment,
          id: `PAY_${payment.id}`,
          orderId: payment.order_id,
          transactionId: payment.transaction_id,
          paymentMethod: payment.payment_method,
          paymentUrl: payment.payment_url,
          tokenId: payment.token_id,
          expiredDate: payment.expired_date,
          paymentData: payment.payment_data,
          createdAt: payment.created_at,
          updatedAt: payment.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getRegistrations() {
    try {
      console.log('🔍 Getting registrations from PostgreSQL...');
      console.log('Environment variables check:');
      console.log('- DATABASE_URL:', !!process.env.DATABASE_URL);
      console.log('- POSTGRES_URL:', !!process.env.POSTGRES_URL);
      console.log('- POSTGRES_URL_NON_POOLING:', !!process.env.POSTGRES_URL_NON_POOLING);
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      
      const queryText = `
        SELECT * FROM registrations 
        ORDER BY created_at DESC;
      `;

      let result;
      try {
        // Try pool connection first
        result = await this.executeQuery(queryText);
      } catch (poolError) {
        console.log('🔄 Pool connection failed, trying direct connection...');
        console.error('Pool error:', poolError);
        
        // Fallback to direct connection
        result = await this.executeQueryDirect(queryText);
      }

      console.log('✅ PostgreSQL query successful, rows:', result.rows.length);

      const registrations = result.rows.map((row: any) => ({
        ...row,
        id: `REG_${row.id}`,
        orderId: row.order_id,
        fullName: row.full_name,
        dateOfBirth: row.date_of_birth,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return { success: true, registrations };
    } catch (error) {
      console.error('❌ Error getting registrations:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        code: (error as any)?.code || 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Check if it's a connection error and suggest solutions
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('ECONNRESET') || errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
        console.error('🚨 Connection error detected. Possible causes:');
        console.error('1. Railway database might be sleeping or restarting');
        console.error('2. Network connectivity issues');
        console.error('3. Incorrect connection string');
        console.error('4. SSL configuration mismatch');
      }
      
      return { success: false, registrations: [], error: errorMessage };
    }
  }

  // Add connection test method
  async testConnection() {
    try {
      console.log('🔧 Testing PostgreSQL connection...');
      const result = await this.executeQuery('SELECT 1 as test');
      console.log('✅ Connection test successful');
      return { success: true, message: 'Database connection working' };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          hasDBUrl: !!process.env.DATABASE_URL,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          nodeEnv: process.env.NODE_ENV
        }
      };
    }
  }

  async getPayments() {
    try {
      const queryText = `
        SELECT * FROM payments 
        ORDER BY created_at DESC;
      `;

      const result = await this.executeQuery(queryText);

      const payments = result.rows.map((row: any) => ({
        ...row,
        id: `PAY_${row.id}`,
        orderId: row.order_id,
        transactionId: row.transaction_id,
        paymentMethod: row.payment_method,
        paymentUrl: row.payment_url,
        tokenId: row.token_id,
        expiredDate: row.expired_date,
        paymentData: row.payment_data,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return { success: true, payments };
    } catch (error) {
      console.error('❌ Error getting payments:', error);
      return { success: false, payments: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async updateRegistration(orderId: string, updates: any) {
    try {
      const queryText = `
        UPDATE registrations 
        SET 
          status = COALESCE($1, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $2
        RETURNING *;
      `;

      const params = [updates.status, orderId];
      const result = await this.executeQuery(queryText, params);

      if (result.rowCount === 0) {
        return { success: false, error: 'Registration not found' };
      }

      const registration = result.rows[0];
      console.log('📝 Registration updated in Postgres:', registration.order_id);

      return { 
        success: true, 
        registration: {
          ...registration,
          id: `REG_${registration.id}`,
          orderId: registration.order_id,
          fullName: registration.full_name,
          dateOfBirth: registration.date_of_birth,
          createdAt: registration.created_at,
          updatedAt: registration.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Error updating registration:', error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getRegistrationByOrderId(orderId: string) {
    try {
      const queryText = `
        SELECT * FROM registrations 
        WHERE order_id = $1
        LIMIT 1;
      `;

      const result = await this.executeQuery(queryText, [orderId]);

      if (result.rowCount === 0) {
        return { success: false, registration: null };
      }

      const row = result.rows[0];
      const registration = {
        ...row,
        id: `REG_${row.id}`,
        orderId: row.order_id,
        fullName: row.full_name,
        dateOfBirth: row.date_of_birth,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      return { success: true, registration };
    } catch (error) {
      console.error('❌ Error getting registration by order ID:', error);
      return { success: false, registration: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getPaymentByOrderId(orderId: string) {
    try {
      const queryText = `
        SELECT * FROM payments 
        WHERE order_id = $1
        LIMIT 1;
      `;

      const result = await this.executeQuery(queryText, [orderId]);

      if (result.rowCount === 0) {
        return { success: false, payment: null };
      }

      const row = result.rows[0];
      const payment = {
        ...row,
        id: `PAY_${row.id}`,
        orderId: row.order_id,
        transactionId: row.transaction_id,
        paymentMethod: row.payment_method,
        paymentUrl: row.payment_url,
        tokenId: row.token_id,
        expiredDate: row.expired_date,
        paymentData: row.payment_data,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      return { success: true, payment };
    } catch (error) {
      console.error('❌ Error getting payment by order ID:', error);
      return { success: false, payment: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async createTicket(data: any) {
    try {
      const ticketCode = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const queryText = `
        INSERT INTO tickets (order_id, ticket_code, qr_code, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const params = [data.orderId, ticketCode, data.qrCode || null, data.status || 'active'];
      const result = await this.executeQuery(queryText, params);

      const ticket = result.rows[0];
      console.log('🎫 Ticket created in Postgres:', ticket.ticket_code);

      return { 
        success: true, 
        ticket: {
          ...ticket,
          id: `TKT_${ticket.id}`,
          orderId: ticket.order_id,
          ticketCode: ticket.ticket_code,
          qrCode: ticket.qr_code,
          issuedAt: ticket.issued_at
        }
      };
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getTickets() {
    try {
      const queryText = `
        SELECT t.*, r.full_name, r.email 
        FROM tickets t
        LEFT JOIN registrations r ON t.order_id = r.order_id
        ORDER BY t.issued_at DESC;
      `;

      const result = await this.executeQuery(queryText);

      const tickets = result.rows.map((row: any) => ({
        ...row,
        id: `TKT_${row.id}`,
        orderId: row.order_id,
        ticketCode: row.ticket_code,
        qrCode: row.qr_code,
        issuedAt: row.issued_at,
        fullName: row.full_name,
        email: row.email
      }));

      return { success: true, tickets };
    } catch (error) {
      console.error('❌ Error getting tickets:', error);
      return { success: false, tickets: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async updatePayment(orderId: string, updates: any) {
    try {
      const queryText = `
        UPDATE payments 
        SET 
          status = COALESCE($1, status),
          transaction_id = COALESCE($2, transaction_id),
          payment_method = COALESCE($3, payment_method),
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $4
        RETURNING *;
      `;

      const params = [updates.status, updates.transactionId, updates.paymentMethod, orderId];
      const result = await this.executeQuery(queryText, params);

      if (result.rowCount === 0) {
        return { success: false, error: 'Payment not found' };
      }

      const payment = result.rows[0];
      console.log('💳 Payment updated in Postgres:', payment.order_id);

      return { 
        success: true, 
        payment: {
          ...payment,
          id: `PAY_${payment.id}`,
          orderId: payment.order_id,
          transactionId: payment.transaction_id,
          paymentMethod: payment.payment_method,
          paymentUrl: payment.payment_url,
          tokenId: payment.token_id,
          expiredDate: payment.expired_date,
          paymentData: payment.payment_data,
          createdAt: payment.created_at,
          updatedAt: payment.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Error updating payment:', error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async updateTicket(orderId: string, updates: any) {
    try {
      const queryText = `
        UPDATE tickets 
        SET 
          status = COALESCE($1, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $2
        RETURNING *;
      `;

      const params = [updates.status, orderId];
      const result = await this.executeQuery(queryText, params);

      if (result.rowCount === 0) {
        return { success: false, error: 'Ticket not found' };
      }

      const ticket = result.rows[0];
      console.log('🎫 Ticket updated in Postgres:', ticket.ticket_code);

      return { 
        success: true, 
        ticket: {
          ...ticket,
          id: `TKT_${ticket.id}`,
          orderId: ticket.order_id,
          ticketCode: ticket.ticket_code,
          qrCode: ticket.qr_code,
          issuedAt: ticket.issued_at,
          updatedAt: ticket.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Error updating ticket:', error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Initialize database tables
  async initializeDatabase() {
    try {
      console.log('🔧 Initializing Postgres database...');
      
      // Create registrations table
      await this.executeQuery(`
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

      // Create payments table
      await this.executeQuery(`
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

      // Create tickets table
      await this.executeQuery(`
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

      // Create indexes
      await this.executeQuery(`CREATE INDEX IF NOT EXISTS idx_registrations_order_id ON registrations(order_id);`);
      await this.executeQuery(`CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);`);
      await this.executeQuery(`CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);`);
      await this.executeQuery(`CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);`);
      await this.executeQuery(`CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);`);

      console.log('✅ Database initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}

// Export singleton instance
export const postgresDb = new PostgresDatabase();
