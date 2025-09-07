'use client';

import { useState, useEffect } from 'react';

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
  ticketId: string;
  orderId: string;
  participantName: string;
  participantEmail: string;
  eventName: string;
  emailSent: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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
        setTickets(ticketData.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Registrations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registrations ({registrations.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg.orderId}>
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
                        {new Date(reg.createdAt).toLocaleString()}
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payments ({payments.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.orderId}>
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
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-'}
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">E-Tickets ({tickets.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticketId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.ticketId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.participantName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.participantEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.emailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ticket.emailSent ? 'Sent' : 'Not Sent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
