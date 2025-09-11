"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import axios from "axios";
import { PRICING_CONFIG, formatPrice, calculateTotal } from "@/config/pricing";

interface RegistrationData {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  address: string;
  country: string;
  memberId: string;
  ticketQuantity: number;
}

interface VoucherData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export default function ReviewOrderPage() {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherData | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load registration data from sessionStorage
    const savedData = sessionStorage.getItem('registrationData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setRegistrationData(data);
      setTicketQuantity(data.ticketQuantity);
    } else {
      // Redirect back to register if no data
      window.location.href = '/register';
    }
  }, []);

  const subtotal = calculateTotal(ticketQuantity);
  const discountAmount = appliedVoucher 
    ? appliedVoucher.type === 'percentage' 
      ? subtotal * (appliedVoucher.value / 100)
      : appliedVoucher.value
    : 0;
  const total = subtotal - discountAmount;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setTicketQuantity(newQuantity);
      // Update sessionStorage
      if (registrationData) {
        const updatedData = { ...registrationData, ticketQuantity: newQuantity };
        setRegistrationData(updatedData);
        sessionStorage.setItem('registrationData', JSON.stringify(updatedData));
      }
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError("Please enter a voucher code");
      return;
    }

    setLoading(true);
    setVoucherError("");

    try {
      // Call voucher validation API
      const response = await axios.post('/api/voucher/validate', {
        code: voucherCode,
        subtotal: subtotal
      });

      if (response.data.success) {
        setAppliedVoucher(response.data.voucher);
        setVoucherCode("");
        setVoucherError("");
      } else {
        setVoucherError(response.data.error || "Invalid voucher code");
      }
    } catch (error: any) {
      console.error('Voucher validation error:', error);
      setVoucherError(error.response?.data?.error || "Failed to validate voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError("");
  };

  const handleProceedToPayment = async () => {
    if (!registrationData) return;

    setLoading(true);
    setError(null);

    try {
      // Call payment API with updated data and voucher
      const response = await axios.post('/api/payment', {
        ...registrationData,
        ticketQuantity: ticketQuantity,
        voucher: appliedVoucher ? {
          code: appliedVoucher.code,
          discountAmount: discountAmount
        } : null
      });

      if (response.data.success) {
        // Clear sessionStorage
        sessionStorage.removeItem('registrationData');
        
        // Redirect to payment
        if (response.data.payment_url) {
          if (response.data.payment_url.startsWith('http')) {
            window.location.href = response.data.payment_url;
          } else {
            window.location.href = response.data.payment_url;
          }
        } else {
          // Redirect to payment success page
          window.location.href = '/payment';
        }
      } else {
        throw new Error(response.data.error || 'Payment creation failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    window.location.href = '/register';
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy) 40vh, var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      
      <main className="flex-grow mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{color: "var(--color-gold)"}}>
              Review Your Order
            </h1>
            <p className="text-lg" style={{color: "var(--color-lightgrey)"}}>
              Please review your registration details and proceed to payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Registration Details */}
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4" style={{color: "var(--color-gold)"}}>
                Registration Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Full Name</label>
                  <p className="text-white">{registrationData.fullName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Member ID</label>
                  <p className="text-white">{registrationData.memberId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Email</label>
                  <p className="text-white">{registrationData.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Phone</label>
                  <p className="text-white">{registrationData.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Date of Birth</label>
                  <p className="text-white">{new Date(registrationData.dob).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Address</label>
                  <p className="text-white">{registrationData.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium" style={{color: "var(--color-lightgrey)"}}>Country</label>
                  <p className="text-white">{registrationData.country}</p>
                </div>
              </div>
              
              <button
                onClick={handleBackToRegister}
                className="mt-4 text-sm underline transition-opacity hover:opacity-80"
                style={{color: "var(--color-gold)"}}
              >
                ← Edit Registration Details
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4" style={{color: "var(--color-gold)"}}>
                Order Summary
              </h2>
              
              {/* Ticket Quantity Counter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{color: "var(--color-lightgrey)"}}>
                  Number of Tickets
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(ticketQuantity - 1)}
                    disabled={ticketQuantity <= 1}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--color-gold)",
                      color: "var(--color-navy)"
                    }}
                  >
                    -
                  </button>
                  <div className="flex-1 px-4 py-2 rounded-lg text-center font-medium bg-white/10 text-white">
                    {ticketQuantity} Ticket{ticketQuantity > 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(ticketQuantity + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: "var(--color-gold)",
                      color: "var(--color-navy)"
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Voucher Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{color: "var(--color-lightgrey)"}}>
                  Voucher Code (Optional)
                </label>
                {!appliedVoucher ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Enter voucher code"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={loading || !voucherCode.trim()}
                      className="px-4 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Checking...' : 'Apply'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-900/30 border border-green-600">
                    <div>
                      <p className="text-green-300 font-medium">{appliedVoucher.code}</p>
                      <p className="text-sm text-green-400">{appliedVoucher.description}</p>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {voucherError && (
                  <p className="text-red-400 text-sm mt-1">{voucherError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-600 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{color: "var(--color-lightgrey)"}}>
                      Subtotal ({ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''})
                    </span>
                    <span className="text-white">Rp {formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedVoucher && (
                    <div className="flex justify-between">
                      <span className="text-green-400">
                        Discount ({appliedVoucher.code})
                      </span>
                      <span className="text-green-400">-Rp {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-600 pt-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold" style={{color: "var(--color-gold)"}}>
                        Total
                      </span>
                      <span className="text-xl font-bold" style={{color: "var(--color-gold)"}}>
                        Rp {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {error && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-600">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
                
                <Button
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
                
                <button
                  onClick={handleBackToRegister}
                  className="w-full py-2 text-center text-sm underline transition-opacity hover:opacity-80"
                  style={{color: "var(--color-gold)"}}
                >
                  ← Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
