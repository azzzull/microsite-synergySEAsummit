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
            {/* Invalid Ticket */}
            <div className="text-center py-8">
              <div className="text-red-600 font-bold text-xl mb-4">
                ❌ Ticket Invalid
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm mb-3">
                  The ticket ID provided is invalid or not found.
                </p>
                <p className="text-red-600 text-xs">
                  Please check your ticket ID and try again.
                </p>
              </div>

              {/* What to do next */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-semibold text-sm mb-2">
                  What to do next:
                </h4>
                <ul className="text-blue-700 text-xs text-left space-y-1">
                  <li>• Check your email for the correct ticket link</li>
                  <li>• Verify the QR code is complete and readable</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
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