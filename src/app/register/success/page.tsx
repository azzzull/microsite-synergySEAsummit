"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import Link from "next/link";

interface PaymentStatus {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'checking';
  registration?: any;
  payment?: any;
  ticket?: any;
  lastChecked?: string;
}

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentStatusParam = searchParams.get('payment_status');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncAttempted, setAutoSyncAttempted] = useState(false);

  // Log initial parameters for debugging
  useEffect(() => {
    console.log('Success page loaded with params:', {
      orderId,
      paymentStatusParam,
      allParams: Object.fromEntries(searchParams.entries())
    });
  }, [orderId, paymentStatusParam, searchParams]);

  // Auto-check payment status when page loads
  useEffect(() => {
    if (orderId && !autoSyncAttempted) {
      checkPaymentStatus();
      setAutoSyncAttempted(true);
      
      // Enhanced auto-sync: Check every 3 seconds for the first 2 minutes
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);

      // Stop auto-sync after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [orderId, autoSyncAttempted]);

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      
      // Get current status from database
      const registrationResponse = await fetch('/api/admin/registrations');
      const registrationData = await registrationResponse.json();
      const registration = registrationData.registrations?.find((r: any) => r.orderId === orderId);

      const paymentResponse = await fetch('/api/admin/payments');
      const paymentData = await paymentResponse.json();
      const payment = paymentData.payments?.find((p: any) => p.orderId === orderId);

      const ticketResponse = await fetch('/api/admin/tickets');
      const ticketData = await ticketResponse.json();
      const ticket = ticketData.tickets?.find((t: any) => t.orderId === orderId);

      const currentStatus = {
        orderId,
        status: registration?.status || 'pending',
        registration,
        payment,
        ticket,
        lastChecked: new Date().toISOString()
      } as PaymentStatus;

      setPaymentStatus(currentStatus);

      // Auto-sync if payment is still pending
      if (currentStatus.status === 'pending' && registration && !syncing) {
        console.log('🔄 Payment still pending, attempting auto-sync...');
        await performSync(false); // Silent sync
      }

    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSync = async (showUI = true) => {
    if (!orderId || syncing) return;

    try {
      if (showUI) setSyncing(true);
      
      console.log('🔄 Syncing payment status with DOKU...');
      
      const response = await fetch('/api/payment', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentMethod: 'VIRTUAL_ACCOUNT_BCA'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Payment sync successful:', result);
        // Refresh status after sync
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
      } else {
        console.error('❌ Payment sync failed:', result);
      }

    } catch (error) {
      console.error('❌ Sync error:', error);
    } finally {
      if (showUI) setSyncing(false);
    }
  };

  const handleManualSync = () => {
    performSync(true);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
          <div className="max-w-md w-full p-8 rounded-lg border text-center" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Invalid Payment Link</h1>
            <p className="mb-6" style={{color: "var(--color-lightgrey)"}}>
              Order ID tidak ditemukan. Silakan kembali ke halaman registrasi.
            </p>
            <Link href="/register">
              <button 
                className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--color-gold)",
                  color: "var(--color-navy)",
                  border: `1px solid var(--color-gold)`
                }}
              >
                Kembali ke Registrasi
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
        <div className="max-w-2xl w-full p-8 rounded-lg border" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
          
          {/* Loading State */}
          {loading && !paymentStatus && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Memeriksa Status Pembayaran...</h1>
              <p style={{color: "var(--color-lightgrey)"}}>Mohon tunggu sebentar</p>
            </div>
          )}

          {/* Payment Successful */}
          {paymentStatus && paymentStatus.status === 'paid' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Pembayaran Berhasil!</h1>
              <p className="mb-6" style={{color: "var(--color-lightgrey)"}}>
                Terima kasih! Pembayaran Anda telah berhasil diproses.
              </p>
              
              <div className="p-4 rounded-lg border border-green-400 mb-6" style={{backgroundColor: "rgba(34, 197, 94, 0.1)"}}>
                <h3 className="font-semibold text-green-400 mb-2">E-Ticket Telah Dikirim!</h3>
                <p className="text-green-400 text-sm">
                  E-ticket untuk Synergy SEA Summit 2025 telah dikirim ke email Anda. 
                  Silakan cek inbox atau folder spam.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-[var(--color-navy)] mb-2">Detail Pembayaran:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Order ID:</span> {paymentStatus.orderId}</p>
                  <p><span className="font-medium">Nama:</span> {paymentStatus.registration?.fullName}</p>
                  <p><span className="font-medium">Email:</span> {paymentStatus.registration?.email}</p>
                  <p><span className="font-medium">Phone:</span> {paymentStatus.registration?.phone}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      PAID
                    </span>
                  </p>
                  {paymentStatus.payment && (
                    <>
                      <p><span className="font-medium">Transaction ID:</span> {paymentStatus.payment.transactionId}</p>
                      <p><span className="font-medium">Amount:</span> Rp {paymentStatus.payment.amount?.toLocaleString('id-ID')}</p>
                      <p><span className="font-medium">Method:</span> {paymentStatus.payment.paymentMethod}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">E-Ticket Dikirim!</h4>
                    <p className="text-sm text-green-700">
                      E-ticket dan konfirmasi pembayaran telah dikirim ke email Anda: <strong>{paymentStatus.registration?.email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/" className="block">
                  <button 
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: "var(--color-gold)",
                      color: "var(--color-navy)",
                      border: `1px solid var(--color-gold)`
                    }}
                  >
                    Kembali ke Beranda
                  </button>
                </Link>
                <Link href="/hall-of-fame" className="block">
                  <button 
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-gold)",
                      border: `1px solid var(--color-gold)`
                    }}
                  >
                    Lihat Peserta Lain
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Payment Pending/Checking */}
          {paymentStatus && (paymentStatus.status === 'pending' || paymentStatus.status === 'checking') && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>
                {paymentStatus.status === 'checking' ? 'Memeriksa Pembayaran...' : 'Menunggu Pembayaran'}
              </h1>
              <p className="mb-6" style={{color: "var(--color-lightgrey)"}}>
                {paymentStatus.status === 'checking' 
                  ? 'Sedang memverifikasi status pembayaran dengan DOKU...'
                  : 'Pembayaran Anda sedang diproses. Status akan diperbarui otomatis setiap 3 detik.'
                }
              </p>
              
              <div className="p-4 rounded-lg border border-yellow-400 mb-6" style={{backgroundColor: "rgba(234, 179, 8, 0.1)"}}>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-1">Sudah Bayar di DOKU?</h4>
                    <p className="text-sm text-yellow-400">
                      Jika Anda sudah menyelesaikan pembayaran di halaman DOKU, status akan diperbarui otomatis. 
                      Jika tidak berubah setelah 2 menit, klik tombol "Periksa Status Pembayaran" di bawah.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border mb-6" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
                <h3 className="font-semibold mb-2" style={{color: "var(--color-lightgrey)"}}>Detail Registrasi:</h3>
                <div className="space-y-1 text-sm" style={{color: "var(--color-lightgrey)"}}>
                  <p><span className="font-medium">Order ID:</span> {paymentStatus.orderId}</p>
                  <p><span className="font-medium">Nama:</span> {paymentStatus.registration?.fullName}</p>
                  <p><span className="font-medium">Email:</span> {paymentStatus.registration?.email}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {paymentStatus.status.toUpperCase()}
                    </span>
                  </p>
                  {paymentStatus.lastChecked && (
                    <p><span className="font-medium">Last Checked:</span> {new Date(paymentStatus.lastChecked).toLocaleString('id-ID')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleManualSync}
                  disabled={syncing}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-navy)",
                    border: `1px solid var(--color-gold)`
                  }}
                >
                  {syncing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block"></div>
                      Sinkronisasi...
                    </>
                  ) : (
                    'Periksa Status Pembayaran'
                  )}
                </button>
                
                <button 
                  onClick={checkPaymentStatus} 
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-gold)",
                    border: `1px solid var(--color-gold)`
                  }}
                >
                  Refresh Status
                </button>
              </div>
            </div>
          )}

          {/* Payment Failed */}
          {paymentStatus && paymentStatus.status === 'failed' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Pembayaran Gagal</h1>
              <p className="mb-6" style={{color: "var(--color-lightgrey)"}}>
                Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau hubungi customer service.
              </p>
              
              <div className="p-4 rounded-lg border mb-6" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
                <h3 className="font-semibold mb-2" style={{color: "var(--color-lightgrey)"}}>Detail:</h3>
                <div className="space-y-1 text-sm" style={{color: "var(--color-lightgrey)"}}>
                  <p><span className="font-medium">Order ID:</span> {paymentStatus.orderId}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="inline-block ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      FAILED
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/register" className="block">
                  <button 
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: "var(--color-gold)",
                      color: "var(--color-navy)",
                      border: `1px solid var(--color-gold)`
                    }}
                  >
                    Coba Registrasi Lagi
                  </button>
                </Link>
                <button 
                  onClick={handleManualSync} 
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-gold)",
                    border: `1px solid var(--color-gold)`
                  }}
                >
                  Periksa Ulang Status
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4" style={{color: "var(--color-lightgrey)"}}>Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
