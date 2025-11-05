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
  validatedAt?: string | null;
  usedCount?: number;
  status?: 'used' | 'unused';
}

export default function ValidateTicketPage() {
  const params = useParams();
  const ticketId = params?.ticketId as string;
  
  const [validationResult, setValidationResult] = useState<TicketValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInvalidTicket, setIsInvalidTicket] = useState(false);

  // Helper function to determine ticket type based on ticket code
  const getTicketType = (ticketCode: string): { type: string; badge: string; color: string } => {
    if (ticketCode.startsWith('COMP') || ticketCode.startsWith('VIP')) {
      return {
        type: 'Complimentary',
        badge: 'Complimentary',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    } else if (ticketCode.startsWith('TICKET')) {
      return {
        type: 'Regular',
        badge: 'Regular',
        color: 'bg-gray-100 text-gray-800 border-gray-300'
      };
    } else {
      return {
        type: 'Standard',
        badge: 'Standard',
        color: 'bg-gray-100 text-gray-800 border-gray-300'
      };
    }
  };

  useEffect(() => {
    if (ticketId) {
      // Clean and validate ticketId format
      const cleanTicketId = decodeURIComponent(ticketId).trim();
      
      if (cleanTicketId.length < 3) {
        // Mark as invalid ticket for short IDs
        setIsInvalidTicket(true);
        setLoading(false);
        return;
      }
      
      validateTicket(cleanTicketId);
    } else {
      // Mark as invalid if no ticket ID
      setIsInvalidTicket(true);
      setLoading(false);
    }
  }, [ticketId]);

  const validateTicket = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Validating ticket:', id);
      
      // Additional client-side validation
      if (!id || id.length < 3) {
        setIsInvalidTicket(true);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/admin/validate-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: id }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Ticket not found in database - mark as invalid
          setIsInvalidTicket(true);
          setLoading(false);
          return;
        } else if (response.status >= 500) {
          throw new Error('Server error - please try again later');
        } else {
          throw new Error(`Validation failed: ${response.status}`);
        }
      }

      const data: TicketValidationResponse = await response.json();
      console.log('✅ Validation result:', data);
      
      // Always set validation result first
      setValidationResult(data);
      
      // Check if ticket is already used - this takes priority
      if (data.status === 'used') {
        // Ticket is already used, display will show "used" message
        setLoading(false);
        return;
      }
      
      // If ticket is not valid and not used, mark as invalid
      if (!data.valid) {
        setIsInvalidTicket(true);
        setLoading(false);
        return;
      }
      
      // Ticket is valid and unused - display will show "valid" message
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Validation error:', err);
      
      // For network errors or other issues, show error message
      const errorMessage = err.message || 'Failed to validate ticket';
      setError(errorMessage);
      setValidationResult({ 
        valid: false, 
        error: errorMessage
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-navy)] flex items-center justify-center px-4 pt-24 pb-8 md:pt-8">
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
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all" style={{ color: '#1f2937' }}>
                {ticketId || 'No ticket ID provided'}
              </div>
            </div>

            {/* Ticket Already Used Display */}
            {validationResult && validationResult.status === 'used' && !loading && !error && (
              <div className="text-center py-8">
                <div className="text-orange-600 font-bold text-xl mb-4">
                  ⚠️ Ticket Sudah Digunakan
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-orange-800 text-sm mb-3">
                    Ticket ini sudah pernah digunakan sebelumnya.
                  </p>
                  <p className="text-orange-600 text-xs">
                    Setiap ticket hanya dapat digunakan sekali untuk mencegah penyalahgunaan.
                  </p>
                </div>

                {/* Ticket Details for Used Ticket */}
                <div className="space-y-3 text-left mb-6">
                  {/* Ticket Type Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTicketType(ticketId).color}`}>
                      {getTicketType(ticketId).badge}
                    </span>
                  </div>

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

                  {validationResult.validatedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Digunakan:</span>
                      <span className="text-gray-800 text-sm">
                        {new Date(validationResult.validatedAt).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Warning Badge */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium text-center">
                    🚫 Ticket tidak dapat digunakan lagi
                  </p>
                </div>
              </div>
            )}

            {/* Invalid Ticket Display */}
            {isInvalidTicket && !loading && (
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
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-600 font-medium">Checking ticket...</span>
                </div>
              </div>
            )}

            {/* Error State (Network/Server Issues) */}
            {error && !loading && (
              <div className="text-center py-8">
                <div className="text-red-600 font-bold text-lg mb-2">
                  ⚠️ Connection Error
                </div>
                <p className="text-red-500 text-sm mb-4">
                  {error}
                </p>
                <button
                  onClick={() => validateTicket(ticketId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Valid Ticket Display - Only show for unused tickets */}
            {validationResult && validationResult.valid && validationResult.status === 'unused' && !loading && !error && (
              <div className="text-center py-4">
                {/* Valid Ticket */}
                <div className="text-green-600 font-bold text-xl mb-4">
                  ✅ Ticket Valid
                </div>
                
                {/* Ticket Details */}
                <div className="space-y-3 text-left">
                  {/* Ticket Type Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTicketType(ticketId).color}`}>
                      {getTicketType(ticketId).badge}
                    </span>
                  </div>

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