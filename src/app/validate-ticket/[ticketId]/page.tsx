"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface TicketValidationResponse {
  valid: boolean;
  participantName?: string;
  participantEmail?: string;
  type?: string;
  error?: string;
}

export default function ValidateTicketPage() {
  const params = useParams();
  const ticketId = params?.ticketId as string;
  
  const [validationResult, setValidationResult] = useState<TicketValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId) {
      validateTicket(ticketId);
    }
  }, [ticketId]);

  const validateTicket = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Validating ticket:', id);
      
      const response = await fetch(`/api/admin/validate-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TicketValidationResponse = await response.json();
      console.log('✅ Validation result:', data);
      
      setValidationResult(data);
    } catch (err: any) {
      console.error('❌ Validation error:', err);
      setError(err.message || 'Failed to validate ticket');
      setValidationResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

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

          {/* Validation Card */}
          <div className="bg-[var(--color-lightgrey)] rounded-xl p-6 shadow-xl">
            {/* Ticket ID Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Ticket ID
              </label>
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all text-shadow-gray-900">
                {ticketId || 'No ticket ID provided'}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-600 font-medium">Checking ticket...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-8">
                <div className="text-red-600 font-bold text-lg mb-2">
                  ❌ Ticket Invalid
                </div>
                <p className="text-red-500 text-sm">
                  Error: {error}
                </p>
              </div>
            )}

            {/* Validation Result */}
            {validationResult && !loading && !error && (
              <div className="text-center py-4">
                {validationResult.valid ? (
                  <div>
                    {/* Valid Ticket */}
                    <div className="text-green-600 font-bold text-xl mb-4">
                      ✅ Ticket Valid
                    </div>
                    
                    {/* Ticket Details */}
                    <div className="space-y-3 text-left">
                      {validationResult.participantName && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Name:</span>
                          <span className="text-gray-800 font-semibold">
                            {validationResult.participantName}
                          </span>
                        </div>
                      )}
                      
                      {validationResult.participantEmail && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Email:</span>
                          <span className="text-gray-800">
                            {validationResult.participantEmail}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Success Badge */}
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm font-medium text-center">
                        🎉 This ticket is valid for Synergy SEA Summit 2025
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Invalid Ticket */}
                    <div className="text-red-600 font-bold text-xl mb-4">
                      ❌ Ticket Invalid
                    </div>
                    
                    {validationResult.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-sm">
                          {validationResult.error}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* No Ticket ID */}
            {!ticketId && !loading && (
              <div className="text-center py-8">
                <div className="text-red-600 font-bold text-lg mb-2">
                  ❌ No Ticket ID
                </div>
                <p className="text-red-500 text-sm">
                  Please provide a valid ticket ID in the URL.
                </p>
              </div>
            )}

            {/* Retry Button */}
            {(error || (validationResult && !validationResult.valid)) && ticketId && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => validateTicket(ticketId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Try Again'}
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Need help? Contact us at{' '}
              <a 
                href="mailto:synergyindonesiasales@gmail.com" 
                className="text-[var(--color-gold)] hover:underline"
              >
                synergyindonesiasales@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}