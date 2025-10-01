"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import TicketAvailability from "@/components/TicketAvailability";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function GenerateTicketPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: null as Date | null,
    address: "",
    country: "Indonesia",
    memberId: "",
    ticketQuantity: 1,
    ticketType: "complimentary" // Default ke complimentary/gratis
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.fullName || !form.phone || !form.email || !form.dob || !form.address || !form.memberId) {
      setError("Please fill in all required fields");
      return;
    }

    // Member ID validation (minimal 6 digits)
    const memberIdRegex = /^\d{6,}$/;
    if (!memberIdRegex.test(form.memberId)) {
      setError("Member ID must contain at least 6 digits");
      return;
    }

    // Ticket quantity validation
    if (form.ticketQuantity < 1) {
      setError("Ticket quantity must be at least 1");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid Indonesian phone number");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format date properly without timezone issues
      const formatDateForStorage = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const ticketData = {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        dob: form.dob ? formatDateForStorage(form.dob) : null,
        address: form.address,
        country: form.country,
        memberId: form.memberId,
        ticketQuantity: form.ticketQuantity,
        ticketType: form.ticketType,
        amount: 0, // Gratis
        isComplimentary: true
      };

      const response = await fetch('/api/admin/generate-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setForm({
          fullName: "",
          phone: "",
          email: "",
          dob: null,
          address: "",
          country: "Indonesia",
          memberId: "",
          ticketQuantity: 1,
          ticketType: "complimentary"
        });
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to generate ticket');
      }
      
    } catch (error: any) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4" style={{color: "var(--color-gold)"}}>
            Ticket Generated Successfully!
          </h2>
          <p className="text-lg mb-6" style={{color: "var(--color-lightgrey)"}}>
            E-ticket with QR code has been sent to the participant's email address.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="bg-[var(--color-gold)] text-[var(--color-navy)] px-6 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Generate Another Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4" style={{color: "var(--color-gold)"}}>
              Generate Complimentary Ticket
            </h1>
            <p className="text-lg" style={{color: "var(--color-lightgrey)"}}>
              Admin panel to generate free tickets for Synergy SEA Summit 2025
            </p>
          </div>

          {/* Ticket Availability Display */}
          <div className="mb-8">
            <TicketAvailability 
              className="max-w-2xl mx-auto"
              showDetails={true}
              refreshTrigger={success ? Date.now() : 0}
            />
          </div>

          {/* Form Container */}
          <div className="p-8 rounded-lg border bg-white/10 backdrop-blur-md" style={{borderColor: "var(--color-gold)"}}>
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="fullName" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Full Name</label>
                <div className="md:w-2/3">
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName" 
                    required 
                    value={form.fullName} 
                    onChange={handleChange}
                    placeholder="Enter participant's full name"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  />
                </div>
              </div>

              {/* Member ID */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="memberId" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Member ID</label>
                <div className="md:w-2/3">
                  <input 
                    type="text" 
                    id="memberId"
                    name="memberId" 
                    required 
                    value={form.memberId} 
                    onChange={handleChange}
                    placeholder="Enter member ID (minimum 6 digits)"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }}
                    pattern="[0-9]{6,}"
                    title="Member ID must contain at least 6 digits"
                  />
                  <p className="text-xs mt-2" style={{color: "var(--color-gold)"}}>
                    *Member ID must contain at least 6 digits
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="phone" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Phone Number</label>
                <div className="md:w-2/3">
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone" 
                    required 
                    value={form.phone} 
                    onChange={handleChange}
                    placeholder="e.g., 081234567890 or +6281234567890"
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/[^0-9]/g, '');
                    }}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="email" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Email</label>
                <div className="md:w-2/3">
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    required 
                    value={form.email} 
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  />
                  <p className="text-xs mt-2" style={{color: "var(--color-gold)"}}>
                    *E-ticket with QR code will be sent to this email address
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="address" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Address</label>
                <div className="md:w-2/3">
                  <textarea 
                    id="address"
                    name="address" 
                    required 
                    value={form.address} 
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    placeholder="Enter complete address (street, city, postal code)"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  />
                </div>
              </div>

              {/* Country */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="country" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Country</label>
                <div className="md:w-2/3">
                  <select 
                    id="country"
                    name="country" 
                    required 
                    value={form.country} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Laos">Laos</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="dob" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Date of Birth</label>
                <div className="md:w-2/3 relative">
                  <DatePicker
                    selected={form.dob}
                    onChange={(date: Date | null) => setForm({ ...form, dob: date })}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date of birth"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    className="w-full px-4 py-3 bg-white text-black rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 custom-datepicker-input"
                    wrapperClassName="w-full"
                    calendarClassName="custom-datepicker"
                  />
                </div>
              </div>

              {/* Ticket Quantity */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label className="md:w-1/3 font-medium md:pt-2" style={{color: "var(--color-lightgrey)"}}>Number of Tickets</label>
                <div className="md:w-2/3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, ticketQuantity: Math.max(1, form.ticketQuantity - 1) })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 hover:opacity-80 cursor-pointer"
                      style={{
                        backgroundColor: "var(--color-gold)",
                        color: "var(--color-navy)"
                      }}
                      disabled={form.ticketQuantity <= 1}
                    >
                      -
                    </button>
                    <div className="flex-1 px-3 py-2 rounded-lg text-center font-medium" 
                         style={{
                           backgroundColor: "var(--color-lightgrey)", 
                           color: "var(--color-navy)"
                         }}>
                      {form.ticketQuantity} Ticket{form.ticketQuantity > 1 ? 's' : ''}
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, ticketQuantity: Math.min(5, form.ticketQuantity + 1) })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "var(--color-gold)",
                        color: "var(--color-navy)"
                      }}
                      disabled={form.ticketQuantity >= 5}
                    >
                      +
                    </button>
                  </div>
                  {form.ticketQuantity >= 5 && (
                    <div className="text-xs mt-2" style={{ color: "var(--color-gold)" }}>
                      *Maximum 5 complimentary tickets per participant
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Type */}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <label htmlFor="ticketType" className="md:w-1/3 font-medium md:pt-3" style={{color: "var(--color-lightgrey)"}}>Ticket Type</label>
                <div className="md:w-2/3">
                  <select 
                    id="ticketType"
                    name="ticketType" 
                    required 
                    value={form.ticketType} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                    style={{
                      backgroundColor: "var(--color-lightgrey)", 
                      color: "var(--color-navy)"
                    }} 
                  >
                    <option value="complimentary">Complimentary (Free)</option>
                    <option value="vip">VIP Complimentary</option>
                    <option value="speaker">Speaker/Guest</option>
                    <option value="staff">Staff/Organizer</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="cursor-pointer text-md py-3 px-6 bg-[var(--color-gold)] border border-[var(--color-gold)] rounded-lg hover:bg-[var(--color-gold)]"
                  style={{color: "var(--color-navy)"}}
                >
                  {loading ? "Generating Ticket..." : "Generate Free Ticket & Send Email"}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}