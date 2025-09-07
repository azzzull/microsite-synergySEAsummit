// Railway PostgreSQL Database Layer
import { sql, createPool, db } from '@vercel/postgres';

// Create connection pool for better performance
const pool = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

export class PostgresDatabase {
  
  async createRegistration(data: any) {
    try {
      console.log('🔧 Creating registration with PostgreSQL...');
      
      const result = await sql`
        INSERT INTO registrations (
          order_id, full_name, phone, email, date_of_birth, 
          address, country, amount, status
        )
        VALUES (
          ${data.orderId}, ${data.fullName}, ${data.phone}, 
          ${data.email}, ${data.dob}, ${data.address}, 
          ${data.country}, ${data.amount}, ${data.status || 'pending'}
        )
        RETURNING *;
      `;

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
      const result = await sql`
        INSERT INTO payments (
          order_id, transaction_id, amount, payment_method, 
          payment_url, token_id, expired_date, status, payment_data
        )
        VALUES (
          ${data.order_id}, ${data.transaction_id || null}, 
          ${data.amount}, ${data.payment_method || null},
          ${data.payment_url || null}, ${data.token_id || null},
          ${data.expired_date || null}, ${data.status || 'pending'},
          ${JSON.stringify(data.payment_data || {})}
        )
        RETURNING *;
      `;

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
      console.log('Database URL configured:', !!process.env.POSTGRES_URL || !!process.env.DATABASE_URL);
      
      const result = await sql`
        SELECT * FROM registrations 
        ORDER BY created_at DESC;
      `;

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
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return { success: false, registrations: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getPayments() {
    try {
      const result = await sql`
        SELECT * FROM payments 
        ORDER BY created_at DESC;
      `;

      const payments = result.rows.map(row => ({
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
      const result = await sql`
        UPDATE registrations 
        SET 
          status = COALESCE(${updates.status}, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${orderId}
        RETURNING *;
      `;

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
      const result = await sql`
        SELECT * FROM registrations 
        WHERE order_id = ${orderId}
        LIMIT 1;
      `;

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
      const result = await sql`
        SELECT * FROM payments 
        WHERE order_id = ${orderId}
        LIMIT 1;
      `;

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
      
      const result = await sql`
        INSERT INTO tickets (order_id, ticket_code, qr_code, status)
        VALUES (${data.orderId}, ${ticketCode}, ${data.qrCode || null}, ${data.status || 'active'})
        RETURNING *;
      `;

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
      const result = await sql`
        SELECT t.*, r.full_name, r.email 
        FROM tickets t
        LEFT JOIN registrations r ON t.order_id = r.order_id
        ORDER BY t.issued_at DESC;
      `;

      const tickets = result.rows.map(row => ({
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
      const result = await sql`
        UPDATE payments 
        SET 
          status = ${updates.status || null},
          transaction_id = ${updates.transactionId || null},
          payment_method = ${updates.paymentMethod || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${orderId}
        RETURNING *;
      `;

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
      const result = await sql`
        UPDATE tickets 
        SET 
          status = COALESCE(${updates.status}, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${orderId}
        RETURNING *;
      `;

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
      await sql`
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
      `;

      // Create payments table
      await sql`
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
      `;

      // Create tickets table
      await sql`
        CREATE TABLE IF NOT EXISTS tickets (
          id SERIAL PRIMARY KEY,
          order_id VARCHAR(255) NOT NULL,
          ticket_code VARCHAR(255) UNIQUE NOT NULL,
          qr_code TEXT,
          issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) NOT NULL DEFAULT 'active'
        );
      `;

      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_registrations_order_id ON registrations(order_id);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);`;

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
