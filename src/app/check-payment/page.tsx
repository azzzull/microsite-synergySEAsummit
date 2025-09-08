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
        <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Cek Status Pembayaran</h1>
            <p className="text-gray-600">
              Masukkan Order ID Anda untuk mengecek status pembayaran
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SSS2025-xxxxxxxxx-xxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Order ID dapat ditemukan di email konfirmasi registrasi
              </p>
            </div>

            <Button
              onClick={checkPayment}
              disabled={checking}
              className="w-full py-3"
            >
              {checking ? "Mengecek..." : "Cek Status Pembayaran"}
            </Button>

            {result && (
              <div className={`p-4 rounded-lg ${
                result.found && result.status === 'paid' 
                  ? 'bg-green-50 border border-green-200' 
                  : result.found && result.status === 'pending'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {result.found ? (
                  <>
                    <h3 className={`font-semibold mb-2 ${
                      result.status === 'paid' ? 'text-green-900' : 
                      result.status === 'pending' ? 'text-yellow-900' : 'text-red-900'
                    }`}>
                      Status: {result.status === 'paid' ? 'BERHASIL DIBAYAR ✅' : 
                               result.status === 'pending' ? 'MENUNGGU PEMBAYARAN ⏳' : 'STATUS UNKNOWN'}
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Nama:</span> {result.registration.fullName}</p>
                      <p><span className="font-medium">Email:</span> {result.registration.email}</p>
                      <p><span className="font-medium">Order ID:</span> {result.registration.orderId}</p>
                    </div>
                    
                    {result.status === 'paid' && (
                      <p className="text-green-700 text-sm mt-3 font-medium">
                        🎉 Pembayaran berhasil! Mengalihkan ke halaman sukses...
                      </p>
                    )}
                    
                    {result.status === 'pending' && (
                      <p className="text-yellow-700 text-sm mt-3">
                        Pembayaran masih diproses. Silakan coba lagi dalam beberapa menit.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-red-700">
                    {result.message}
                  </p>
                )}
              </div>
            )}

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Butuh bantuan? Hubungi customer service kami
              </p>
              <div className="space-y-2">
                <Link href="/register" className="block text-purple-600 hover:text-purple-700 text-sm">
                  ← Kembali ke Registrasi
                </Link>
                <Link href="/" className="block text-purple-600 hover:text-purple-700 text-sm">
                  🏠 Beranda
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
