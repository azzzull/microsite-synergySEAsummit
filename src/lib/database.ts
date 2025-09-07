// Database simulation using JSON files
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DB_PATH, 'registrations.json');
const PAYMENTS_FILE = path.join(DB_PATH, 'payments.json');
const TICKETS_FILE = path.join(DB_PATH, 'tickets.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath: string, initialData: any = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
};

initializeFile(REGISTRATIONS_FILE);
initializeFile(PAYMENTS_FILE);
initializeFile(TICKETS_FILE);

export interface Registration {
  id: string;
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  dob: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  createdAt: string;
  updatedAt: string;
  paymentData?: any;
}

export interface Payment {
  id: string;
  orderId: string;
  transactionId?: string;
  paymentMethod?: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expired';
  paidAt?: string;
  dokuyResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  orderId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  qrCode: string;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
}

class Database {
  private readFile(filePath: string): any[] {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      return [];
    }
  }

  private writeFile(filePath: string, data: any[]): void {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${filePath}:`, error);
    }
  }

  // Registration methods
  async createRegistration(registration: Omit<Registration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Registration> {
    const registrations = this.readFile(REGISTRATIONS_FILE);
    const newRegistration: Registration = {
      ...registration,
      id: `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    registrations.push(newRegistration);
    this.writeFile(REGISTRATIONS_FILE, registrations);
    
    console.log('📝 Registration created:', newRegistration.id);
    return newRegistration;
  }

  async getRegistrationByOrderId(orderId: string): Promise<Registration | null> {
    const registrations = this.readFile(REGISTRATIONS_FILE);
    return registrations.find((reg: Registration) => reg.orderId === orderId) || null;
  }

  async updateRegistration(orderId: string, updates: Partial<Registration>): Promise<Registration | null> {
    const registrations = this.readFile(REGISTRATIONS_FILE);
    const index = registrations.findIndex((reg: Registration) => reg.orderId === orderId);
    
    if (index === -1) return null;
    
    registrations[index] = {
      ...registrations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(REGISTRATIONS_FILE, registrations);
    console.log('📝 Registration updated:', orderId);
    return registrations[index];
  }

  // Payment methods
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const payments = this.readFile(PAYMENTS_FILE);
    const newPayment: Payment = {
      ...payment,
      id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    this.writeFile(PAYMENTS_FILE, payments);
    
    console.log('💳 Payment created:', newPayment.id);
    return newPayment;
  }

  async updatePayment(orderId: string, updates: Partial<Payment>): Promise<Payment | null> {
    const payments = this.readFile(PAYMENTS_FILE);
    const index = payments.findIndex((pay: Payment) => pay.orderId === orderId);
    
    if (index === -1) return null;
    
    payments[index] = {
      ...payments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(PAYMENTS_FILE, payments);
    console.log('💳 Payment updated:', orderId);
    return payments[index];
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    const payments = this.readFile(PAYMENTS_FILE);
    return payments.find((pay: Payment) => pay.orderId === orderId) || null;
  }

  // Ticket methods
  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> {
    const tickets = this.readFile(TICKETS_FILE);
    const newTicket: Ticket = {
      ...ticket,
      id: `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    tickets.push(newTicket);
    this.writeFile(TICKETS_FILE, tickets);
    
    console.log('🎫 Ticket created:', newTicket.id);
    return newTicket;
  }

  async getTicketByOrderId(orderId: string): Promise<Ticket | null> {
    const tickets = this.readFile(TICKETS_FILE);
    return tickets.find((tkt: Ticket) => tkt.orderId === orderId) || null;
  }

  async updateTicket(orderId: string, updates: Partial<Ticket>): Promise<Ticket | null> {
    const tickets = this.readFile(TICKETS_FILE);
    const index = tickets.findIndex((tkt: Ticket) => tkt.orderId === orderId);
    
    if (index === -1) return null;
    
    tickets[index] = {
      ...tickets[index],
      ...updates
    };
    
    this.writeFile(TICKETS_FILE, tickets);
    console.log('🎫 Ticket updated:', orderId);
    return tickets[index];
  }

  // Get all records methods
  async getAllRegistrations(): Promise<Registration[]> {
    try {
      return this.readFile(REGISTRATIONS_FILE);
    } catch (error) {
      console.error('Error reading registrations:', error);
      return [];
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      return this.readFile(PAYMENTS_FILE);
    } catch (error) {
      console.error('Error reading payments:', error);
      return [];
    }
  }

  async getAllTickets(): Promise<Ticket[]> {
    try {
      return this.readFile(TICKETS_FILE);
    } catch (error) {
      console.error('Error reading tickets:', error);
      return [];
    }
  }

  // Analytics methods
  async getStats() {
    const registrations = this.readFile(REGISTRATIONS_FILE);
    const payments = this.readFile(PAYMENTS_FILE);
    const tickets = this.readFile(TICKETS_FILE);

    return {
      totalRegistrations: registrations.length,
      paidRegistrations: registrations.filter((r: Registration) => r.status === 'paid').length,
      pendingPayments: payments.filter((p: Payment) => p.status === 'pending').length,
      successfulPayments: payments.filter((p: Payment) => p.status === 'success').length,
      ticketsIssued: tickets.length,
      emailsSent: tickets.filter((t: Ticket) => t.emailSent).length,
      totalRevenue: payments
        .filter((p: Payment) => p.status === 'success')
        .reduce((sum: number, p: Payment) => sum + p.amount, 0)
    };
  }
}

export const db = new Database();
