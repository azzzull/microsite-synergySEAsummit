"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import Link from "next/link";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount') || '0'; // Will be fetched dynamically if not provided
  const paymentUrl = searchParams.get('payment_url');
  const tokenId = searchParams.get('token_id');
  const paymentType = searchParams.get('payment_type');
  const simulationDataParam = searchParams.get('simulation_data');
  const errorParam = searchParams.get('error');
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  // Parse simulation data if available
  useEffect(() => {
    if (simulationDataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(simulationDataParam));
        setSimulationData(parsed);
        console.log('🔄 Simulation data loaded:', parsed);
      } catch (e) {
        console.error('Failed to parse simulation data:', e);
      }
    }
  }, [simulationDataParam]);

  // Auto redirect ke DOKU Checkout jika ada payment_url real
  useEffect(() => {
    if (paymentUrl && paymentType === 'doku_checkout') {
      console.log('🚀 Redirecting to DOKU Checkout:', paymentUrl);
      setIsRedirecting(true);
      
      // Beri delay singkat untuk UX yang lebih baik
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 2000);
    }
  }, [paymentUrl, paymentType]);

  const handleRedirectToDoku = () => {
    if (paymentUrl) {
      setIsRedirecting(true);
      window.location.href = paymentUrl;
    } else if (simulationData?.payment_url) {
      setIsRedirecting(true);
      // Untuk simulation, redirect ke halaman demo
      window.open(simulationData.payment_url, '_blank');
    }
  };

  // Jika sedang redirect otomatis ke DOKU Checkout
  if (isRedirecting && paymentType === 'doku_checkout') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <div className="animate-spin w-16 h-16 border-4 border-[var(--color-gold)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold text-white mb-4">Redirecting to DOKU Checkout</h2>
              <p className="text-gray-300 mb-6">
                You will be redirected to DOKU's secure payment page to complete your registration payment.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Order ID: {orderId}</p>
                <p>Amount: Rp {parseInt(amount).toLocaleString('id-ID')}</p>
                {tokenId && <p>Token: {tokenId}</p>}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Complete Your Registration
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Synergy SEA Summit 2025
            </p>
            <div className="inline-block bg-[var(--color-gold)]/20 backdrop-blur-md border border-[var(--color-gold)]/30 rounded-lg px-6 py-3">
              <span className="text-[var(--color-gold)] font-semibold">
                Order ID: {orderId}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorParam && (
            <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-center">
                ⚠️ {decodeURIComponent(errorParam)}
              </p>
            </div>
          )}

          {/* Payment Method */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* DOKU Checkout */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <span className="bg-[var(--color-gold)] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                DOKU Checkout
              </h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-300">
                  Complete your payment securely through DOKU's payment gateway.
                </p>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Payment Amount</h3>
                  <p className="text-2xl font-bold text-[var(--color-gold)]">
                    Rp {parseInt(amount).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Available Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    {simulationData?.payment_method_types?.map((method: string, index: number) => (
                      <span key={index} className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                        {method.replace(/_/g, ' ')}
                      </span>
                    )) || (
                      <>
                        <span className="bg-white/10 text-white text-xs px-2 py-1 rounded">Virtual Account</span>
                        <span className="bg-white/10 text-white text-xs px-2 py-1 rounded">QRIS</span>
                        <span className="bg-white/10 text-white text-xs px-2 py-1 rounded">Credit Card</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleRedirectToDoku}
                disabled={isRedirecting}
                className="w-full bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/80 text-black font-semibold py-4 rounded-xl transition-all duration-300"
              >
                {isRedirecting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                    Redirecting...
                  </div>
                ) : (
                  'Pay Now with DOKU'
                )}
              </Button>

              {paymentType === 'doku_checkout_simulation' && (
                <p className="text-yellow-400 text-sm mt-2 text-center">
                  ⚠️ Demo Mode - Payment simulation will open in new tab
                </p>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <span className="bg-[var(--color-gold)] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Payment Instructions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">After clicking "Pay Now":</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                    <li>You'll be redirected to DOKU's secure payment page</li>
                    <li>Choose your preferred payment method</li>
                    <li>Complete the payment process</li>
                    <li>You'll be redirected back to our success page</li>
                  </ol>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>Event: Synergy SEA Summit 2025</p>
                    <p>Registration Fee: Rp {parseInt(amount).toLocaleString('id-ID')}</p>
                    <p>Payment Method: DOKU Checkout</p>
                    {tokenId && <p>Token ID: {tokenId}</p>}
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-2">🔒 Secure Payment</h3>
                  <p className="text-blue-200 text-sm">
                    Your payment is processed securely through DOKU, one of Indonesia's trusted payment gateways.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <Link href="/register">
              <Button className="text-white border border-white/30 hover:bg-white/10 bg-transparent">
                ← Back to Registration
              </Button>
            </Link>
            
            <p className="text-gray-400 text-sm">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@synergyseasummit.com" className="text-[var(--color-gold)] hover:underline">
                support@synergyseasummit.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
