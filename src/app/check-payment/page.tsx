"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function CheckPaymentPage() {
  const [orderId, setOrderId] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkPayment = async () => {
    if (!orderId.trim()) {
      alert("Masukkan Order ID terlebih dahulu");
      return;
    }

    setChecking(true);
    setResult(null);

    try {
      const response = await fetch(`/api/admin/registrations`);
      const data = await response.json();
      
      if (data.success) {
        const registration = data.registrations.find((r: any) => r.orderId === orderId.trim());
        
        if (registration) {
          setResult({
            found: true,
            status: registration.status,
            registration
          });
          
          // If payment is successful, redirect to success page
          if (registration.status === 'paid') {
            setTimeout(() => {
              window.location.href = `/register/success?order_id=${orderId}`;
            }, 2000);
          }
        } else {
          setResult({
            found: false,
            message: "Order ID tidak ditemukan"
          });
        }
      }
    } catch (error) {
      setResult({
        found: false,
        message: "Terjadi kesalahan saat mengecek pembayaran"
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
        <div className="max-w-lg w-full p-8 rounded-lg border" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Cek Status Pembayaran</h1>
            <p style={{color: "var(--color-lightgrey)"}}>
              Masukkan Order ID Anda untuk mengecek status pembayaran
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium mb-2" style={{color: "var(--color-lightgrey)"}}>
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SSS2025-xxxxxxxxx-xxxxxx"
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{
                  backgroundColor: "var(--color-lightgrey)", 
                  color: "var(--color-navy)"
                }}
              />
              <p className="text-xs mt-1" style={{color: "var(--color-lightgrey)"}}>
                Order ID dapat ditemukan di email konfirmasi registrasi
              </p>
            </div>

            <button
              onClick={checkPayment}
              disabled={checking}
              className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-gold)",
                color: "var(--color-navy)",
                border: `1px solid var(--color-gold)`
              }}
            >
              {checking ? "Mengecek..." : "Cek Status Pembayaran"}
            </button>

            {result && (
              <div className={`p-4 rounded-lg border ${
                result.found && result.status === 'paid' 
                  ? 'border-green-400' 
                  : result.found && result.status === 'pending'
                  ? 'border-yellow-400'
                  : 'border-red-400'
              }`} style={{
                backgroundColor: result.found && result.status === 'paid' 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : result.found && result.status === 'pending'
                  ? 'rgba(234, 179, 8, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)'
              }}>
                {result.found ? (
                  <>
                    <h3 className={`font-semibold mb-2 ${
                      result.status === 'paid' ? 'text-green-400' : 
                      result.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      Status: {result.status === 'paid' ? 'BERHASIL DIBAYAR ✅' : 
                               result.status === 'pending' ? 'MENUNGGU PEMBAYARAN ⏳' : 'STATUS UNKNOWN'}
                    </h3>
                    <div className="text-sm space-y-1" style={{color: "var(--color-lightgrey)"}}>
                      <p><span className="font-medium">Nama:</span> {result.registration.fullName}</p>
                      <p><span className="font-medium">Email:</span> {result.registration.email}</p>
                      <p><span className="font-medium">Order ID:</span> {result.registration.orderId}</p>
                    </div>
                    
                    {result.status === 'paid' && (
                      <p className="text-green-400 text-sm mt-3 font-medium">
                        Pembayaran berhasil! Mengalihkan ke halaman sukses...
                      </p>
                    )}
                    
                    {result.status === 'pending' && (
                      <p className="text-yellow-400 text-sm mt-3">
                        Pembayaran masih diproses. Silakan coba lagi dalam beberapa menit.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-red-400">
                    {result.message}
                  </p>
                )}
              </div>
            )}

            <div className="text-center pt-4 border-t" style={{borderColor: "var(--color-gold)"}}>
              <p className="text-sm mb-4" style={{color: "var(--color-lightgrey)"}}>
                Butuh bantuan? Hubungi customer service kami
              </p>
              <div className="space-y-2">
                <Link href="/register" className="block text-sm font-medium transition-colors duration-200" style={{color: "var(--color-gold)"}}>
                  Kembali ke Registrasi
                </Link>
                <Link href="/" className="block text-sm font-medium transition-colors duration-200" style={{color: "var(--color-gold)"}}>
                  Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
