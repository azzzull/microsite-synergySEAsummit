'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { convertToJakartaTime } from "@/lib/timezone";

interface Registration {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Payment {
  orderId: string;
  amount: number;
  status: string;
  transactionId?: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
}

interface Ticket {
  id?: string;
  ticketId: string;
  ticketCode?: string;
  orderId: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  eventName: string;
  eventDate?: string;
  eventLocation?: string;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
  issuedAt?: string;
  updatedAt?: string;
  status?: string;
  // Fallback fields from registration data
  fullName?: string;
  email?: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [emailTest, setEmailTest] = useState({ email: '', loading: false, result: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, payRes, ticketRes] = await Promise.all([
        fetch('/api/admin/registrations'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/tickets')
      ]);

      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData.registrations || []);
      }

      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }

      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        console.log('🎫 Fetched tickets data:', ticketData);
        setTickets(ticketData.tickets || []);
      } else {
        console.error('❌ Failed to fetch tickets:', ticketRes.status, ticketRes.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (!confirm("⚠️ WARNING: This will permanently delete ALL data!\n\nAre you absolutely sure you want to reset the database?\n\nThis action cannot be undone!")) {
      return;
    }

    try {
      setResetting(true);
      
      const response = await fetch('/api/admin/reset-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirm: "RESET_ALL_DATA" })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Database reset successful!\n\nDeleted:\n- ${result.rowsDeleted.registrations} registrations\n- ${result.rowsDeleted.payments} payments\n- ${result.rowsDeleted.tickets} tickets`);
        
        // Refresh data to show empty tables
        await fetchData();
      } else {
        alert(`❌ Reset failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Reset error:', error);
      alert('❌ Error resetting database');
    } finally {
      setResetting(false);
    }
  };

  const testEmailService = async (type: 'connection' | 'ticket' | 'confirmation') => {
    try {
      setEmailTest(prev => ({ ...prev, loading: true, result: '' }));

      if (type === 'connection') {
        const response = await fetch('/api/admin/test-email');
        const result = await response.json();
        setEmailTest(prev => ({ 
          ...prev, 
          result: result.connected ? '✅ Email service connected' : '❌ Email service not configured'
        }));
      } else {
        if (!emailTest.email) {
          setEmailTest(prev => ({ ...prev, result: '❌ Please enter an email address' }));
          return;
        }

        const response = await fetch('/api/admin/test-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: emailTest.email, 
            type: type === 'ticket' ? 'ticket' : 'confirmation'
          })
        });

        const result = await response.json();
        setEmailTest(prev => ({ 
          ...prev, 
          result: result.success 
            ? `✅ ${type} email sent successfully!` 
            : `❌ Failed: ${result.error}`
        }));
      }
    } catch (error) {
      console.error('Email test error:', error);
      setEmailTest(prev => ({ ...prev, result: '❌ Error testing email service' }));
    } finally {
      setEmailTest(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
          <div className="text-lg" style={{color: "var(--color-lightgrey)"}}>Loading admin data...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <main className="flex-1 mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--color-gold)"}}>Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">All timestamps displayed in Jakarta Time (WIB)</p>
        
        {/* Registrations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>Registrations ({registrations.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: "var(--color-gold)"}}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg, index) => (
                    <tr key={`registration-${reg.orderId}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {reg.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {convertToJakartaTime(reg.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>Payments ({payments.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: "var(--color-gold)"}}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Paid At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <tr key={`payment-${payment.orderId}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.transactionId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMethod || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paidAt ? convertToJakartaTime(payment.paidAt) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>E-Tickets ({tickets.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: "var(--color-gold)"}}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Ticket ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Email Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--color-navy)"}}>Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket, index) => (
                    <tr key={`ticket-${ticket.ticketId || ticket.id || index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.ticketId || ticket.ticketCode || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.orderId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.participantName || ticket.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.participantEmail || ticket.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.emailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ticket.emailSent ? 'Sent' : 'Not Sent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const dateStr = ticket.createdAt || ticket.issuedAt;
                          if (!dateStr) return 'N/A';
                          return convertToJakartaTime(dateStr);
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Email Service Testing */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/20 border border-yellow-400/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-gold)"}}>
              📧 Email Service Testing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Connection Test */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{color: "var(--color-gold)"}}>
                  Connection Test
                </h3>
                <button
                  onClick={() => testEmailService('connection')}
                  disabled={emailTest.loading}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-navy)",
                    border: `1px solid var(--color-gold)`
                  }}
                >
                  {emailTest.loading ? "Testing..." : "🔌 Test Connection"}
                </button>
              </div>

              {/* Email Sending Test */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{color: "var(--color-gold)"}}>
                  Send Test Email
                </h3>
                <input
                  type="email"
                  placeholder="Enter test email address"
                  value={emailTest.email}
                  onChange={(e) => setEmailTest(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-yellow-400/30 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => testEmailService('confirmation')}
                    disabled={emailTest.loading || !emailTest.email}
                    className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50 text-sm"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-gold)",
                      border: `1px solid var(--color-gold)`
                    }}
                  >
                    💳 Confirmation
                  </button>
                  <button
                    onClick={() => testEmailService('ticket')}
                    disabled={emailTest.loading || !emailTest.email}
                    className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50 text-sm"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-gold)",
                      border: `1px solid var(--color-gold)`
                    }}
                  >
                    🎫 Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Test Result */}
            {emailTest.result && (
              <div className="mt-6 p-4 rounded-lg bg-black/40 border border-yellow-400/20">
                <p className="text-center font-medium">{emailTest.result}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={fetchData}
            className="py-3 px-6 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-gold)",
              color: "var(--color-navy)",
              border: `1px solid var(--color-gold)`
            }}
          >
            Refresh Data
          </button>
          
          <button
            onClick={resetDatabase}
            disabled={resetting}
            className="py-3 px-6 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444"
            }}
          >
            {resetting ? "Resetting..." : "🗑️ Reset Database"}
          </button>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
