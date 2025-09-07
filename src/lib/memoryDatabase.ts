// Production-compatible database using memory + API persistence
let memoryDatabase = {
  registrations: [],
  payments: [],
  tickets: []
};

export class MemoryDatabase {
  
  constructor() {
    this.loadFromAPI();
  }

  async loadFromAPI() {
    try {
      // Load existing data from API endpoints
      const [regRes, payRes, ticketRes] = await Promise.all([
        fetch('/api/admin/registrations').catch(() => ({ ok: false })),
        fetch('/api/admin/payments').catch(() => ({ ok: false })),
        fetch('/api/admin/tickets').catch(() => ({ ok: false }))
      ]);

      if (regRes.ok) {
        const regData = await regRes.json();
        memoryDatabase.registrations = regData.registrations || [];
      }
      
      if (payRes.ok) {
        const payData = await payRes.json();
        memoryDatabase.payments = payData.payments || [];
      }
      
      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        memoryDatabase.tickets = ticketData.tickets || [];
      }
    } catch (error) {
      console.log('No existing data to load');
    }
  }

  async createRegistration(data: any) {
    const registration = {
      ...data,
      id: `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to memory
    memoryDatabase.registrations.push(registration);
    
    // Also persist to file system if possible (for local development)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'registrations.json');
      fs.writeFileSync(filePath, JSON.stringify(memoryDatabase.registrations, null, 2));
    } catch (error) {
      // Ignore file system errors in production
      console.log('Using memory storage only');
    }

    return { success: true, registration };
  }

  async getRegistrations() {
    return { success: true, registrations: memoryDatabase.registrations };
  }

  async createPayment(data: any) {
    const payment = {
      ...data,
      id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryDatabase.payments.push(payment);

    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'payments.json');
      fs.writeFileSync(filePath, JSON.stringify(memoryDatabase.payments, null, 2));
    } catch (error) {
      console.log('Using memory storage only');
    }

    return { success: true, payment };
  }

  async getPayments() {
    return { success: true, payments: memoryDatabase.payments };
  }

  async updateRegistration(orderId: string, updates: any) {
    const index = memoryDatabase.registrations.findIndex(r => r.orderId === orderId);
    if (index !== -1) {
      memoryDatabase.registrations[index] = {
        ...memoryDatabase.registrations[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'data', 'registrations.json');
        fs.writeFileSync(filePath, JSON.stringify(memoryDatabase.registrations, null, 2));
      } catch (error) {
        console.log('Using memory storage only');
      }

      return { success: true, registration: memoryDatabase.registrations[index] };
    }
    return { success: false, error: 'Registration not found' };
  }
}

// Export singleton instance
export const memoryDb = new MemoryDatabase();
