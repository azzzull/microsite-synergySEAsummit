"use client";
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function ValidateTicketNotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-navy)] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-lightgrey)" }}>
              🎫 Ticket Validation
            </h1>
            <p className="text-gray-400">
              Synergy SEA Summit 2025
            </p>
          </div>

          {/* Error Card */}
          <div className="bg-[var(--color-lightgrey)] rounded-xl p-6 shadow-xl">
            {/* Invalid URL/Format */}
            <div className="text-center py-8">
              <div className="text-red-600 font-bold text-xl mb-4">
                ❌ Invalid Ticket URL
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm mb-3">
                  The ticket URL format is invalid or incomplete.
                </p>
                <p className="text-red-600 text-xs">
                  Please make sure you're using the complete ticket validation URL.
                </p>
              </div>

              {/* Expected Format */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-blue-800 font-semibold text-sm mb-2">
                  Expected URL Format:
                </h4>
                <div className="text-blue-700 text-xs font-mono break-all">
                  https://synergyseasummit.co.id/validate-ticket/[TICKET_ID]
                </div>
              </div>

              {/* Manual Input Option */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Or enter your ticket ID manually:
                </p>
                <ManualTicketInput />
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Need help? Contact us at{' '}
              <a 
                href="mailto:synergyindonesiasales@gmail.com" 
                className="text-[var(--color-gold)] hover:underline"
              >
                synergyindonesiasales@gmail.com
              </a>
            </p>
            
            <Link 
              href="/"
              className="text-[var(--color-gold)] hover:underline text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ManualTicketInput() {
  const [ticketId, setTicketId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId.trim()) {
      window.location.href = `/validate-ticket/${encodeURIComponent(ticketId.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="Enter your ticket ID"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!ticketId.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Validate Ticket
      </button>
    </form>
  );
}