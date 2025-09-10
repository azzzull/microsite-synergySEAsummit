"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: null as Date | null,
    address: "",
    country: "Indonesia",
    memberId: "",
    ticketQuantity: 1
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
    if (form.ticketQuantity < 1 || form.ticketQuantity > 10) {
      setError("Ticket quantity must be between 1 and 10");
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
      console.log('Submitting registration form...');
      // Call payment API
      const response = await axios.post('/api/payment', {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        dob: form.dob?.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        address: form.address,
        country: form.country,
        memberId: form.memberId,
        ticketQuantity: form.ticketQuantity
      });

      console.log('Payment API response:', response.data);

      if (response.data.success) {
        // Redirect to payment page or show payment instructions
        if (response.data.payment_url) {
          console.log('Redirecting to:', response.data.payment_url);
          // Check if it's an external URL or internal redirect
          if (response.data.payment_url.startsWith('http')) {
            window.location.href = response.data.payment_url;
          } else {
            window.location.href = response.data.payment_url;
          }
        } else {
          // Show payment instructions (for VA/QRIS)
          setSuccess(true);
          console.log('Payment created:', response.data);
        }
      } else {
        throw new Error(response.data.error || 'Payment creation failed');
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy) 40vh, var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <div className="container mx-auto px-4 flex-1 mt-16 sm:mt-20 md:mt-20">
        <section className="max-w-4xl mx-auto py-8 px-4">
          
          {/* Wording Register Section */}
          <div className="mb-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-8 md:gap-8">
              <div className="flex flex-col justify-center text-center md:text-left flex-1 order-2 md:order-1">
                <p className="text-lg mb-3" style={{color: "var(--color-lightgrey)"}}>Synergy SEA Summit 2025</p>
                <h2 className="text-4xl md:text-4xl font-bold mb-4 leading-tight" style={{color: "var(--color-gold)"}}>Register Yourself Now!</h2>
                <p className="text-base leading-relaxed mb-4" style={{color: "var(--color-lightgrey)"}}>
                  The Premier Southeast Asia Business & Technology Summit: Connecting Innovation Across the Region!
                </p>
                <div className="border px-4 py-3 rounded-lg inline-block" style={{borderColor: "var(--color-gold)"}}>
                  <p className="text-xl font-bold" style={{color: "var(--color-gold)"}}>Early Bird Price: Rp 250.000</p>
                  <p className="text-sm" style={{color: "var(--color-lightgrey)"}}>*Limited time offer</p>
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0 order-1 md:order-2">
                <div className="w-48 h-48 rounded-full flex flex-col items-center justify-center text-center" 
                     style={{
                       backgroundColor: "var(--color-gold)"
                     }}>
                  <h2 className="text-2xl font-bold mb-2" style={{color: "var(--color-navy)"}}>8 November 2025</h2>
                  <p className="text-sm px-4 text-center" style={{color: "var(--color-navy)"}}>@The Stones Hotel, Legian Bali</p>
                </div>
              </div>
            </div>
          </div>

          {success ? (
            <div className="text-center font-bold text-xl p-8 rounded-lg" style={{color: "var(--color-gold)", backgroundColor: "var(--color-white-transparent)"}}>
              Registration successful! Please check your email for payment instructions.
            </div>
          ) : (
            /* Form Container */
            <div className="p-8 rounded-lg border" style={{backgroundColor: "var(--color-white-transparent)", borderColor: "var(--color-gold)"}}>
              {error && (
                <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="fullName" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Full Name</label>
                  <div className="md:w-2/3">
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName" 
                      required 
                      value={form.fullName} 
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-lightgrey)", 
                        color: "var(--color-navy)"
                      }} 
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="phone" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Phone Number</label>
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
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="email" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Email</label>
                  <div className="md:w-2/3">
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      required 
                      value={form.email} 
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-lightgrey)", 
                        color: "var(--color-navy)"
                      }} 
                    />
                    <p className="text-xs mt-2" style={{color: "var(--color-gold)"}}>
                      *Please ensure your email is correct as the e-ticket will be sent to this email address
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="address" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Address</label>
                  <div className="md:w-2/3">
                    <textarea 
                      id="address"
                      name="address" 
                      required 
                      value={form.address} 
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      placeholder="Enter your complete address (street, city, postal code)"
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-lightgrey)", 
                        color: "var(--color-navy)"
                      }} 
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="country" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Country</label>
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

                {/* Member ID */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="memberId" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Member ID</label>
                  <div className="md:w-2/3">
                    <input 
                      type="text" 
                      id="memberId"
                      name="memberId" 
                      required 
                      value={form.memberId} 
                      onChange={handleChange}
                      placeholder="Enter your member ID (minimum 6 digits)"
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

                {/* Ticket Quantity */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="ticketQuantity" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Number of Tickets</label>
                  <div className="md:w-2/3">
                    <select 
                      id="ticketQuantity"
                      name="ticketQuantity" 
                      required 
                      value={form.ticketQuantity} 
                      onChange={(e) => setForm({ ...form, ticketQuantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-lightgrey)", 
                        color: "var(--color-navy)"
                      }} 
                    >
                      <option value={1}>1 Ticket</option>
                      <option value={2}>2 Tickets</option>
                      <option value={3}>3 Tickets</option>
                      <option value={4}>4 Tickets</option>
                      <option value={5}>5 Tickets</option>
                      <option value={6}>6 Tickets</option>
                      <option value={7}>7 Tickets</option>
                      <option value={8}>8 Tickets</option>
                      <option value={9}>9 Tickets</option>
                      <option value={10}>10 Tickets</option>
                    </select>
                    <p className="text-xs mt-2" style={{color: "var(--color-gold)"}}>
                      *Maximum 10 tickets per registration
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="dob" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Date of Birth</label>
                  <div className="md:w-2/3 relative">
                    <DatePicker
                      selected={form.dob}
                      onChange={(date: Date | null) => setForm({ ...form, dob: date })}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select your date of birth"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                      yearDropdownItemNumber={100}
                      scrollableYearDropdown
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 custom-datepicker-input"
                      wrapperClassName="w-full"
                      calendarClassName="custom-datepicker"
                    />
                    <style jsx global>{`
                      .custom-datepicker-input {
                        background-color: var(--color-lightgrey) !important;
                        color: var(--color-navy) !important;
                        border: none !important;
                      }
                      .custom-datepicker-input::placeholder {
                        color: rgba(7, 13, 45, 0.6) !important;
                      }
                      .custom-datepicker .react-datepicker__header {
                        background-color: var(--color-navy) !important;
                        border-bottom: 1px solid var(--color-gold) !important;
                      }
                      .custom-datepicker .react-datepicker__current-month,
                      .custom-datepicker .react-datepicker__day-name {
                        color: var(--color-gold) !important;
                        font-weight: bold !important;
                      }
                      .custom-datepicker .react-datepicker__day {
                        color: var(--color-navy) !important;
                      }
                      .custom-datepicker .react-datepicker__day:hover {
                        background-color: var(--color-gold) !important;
                        color: var(--color-navy) !important;
                      }
                      .custom-datepicker .react-datepicker__day--selected {
                        background-color: var(--color-gold) !important;
                        color: var(--color-navy) !important;
                      }
                      .custom-datepicker .react-datepicker__day--keyboard-selected {
                        background-color: var(--color-gold) !important;
                        color: var(--color-navy) !important;
                      }
                      
                      /* Styling untuk dropdown bulan dan tahun */
                      .custom-datepicker .react-datepicker__month-dropdown,
                      .custom-datepicker .react-datepicker__year-dropdown {
                        background-color: #ffffff !important;
                        border: 2px solid #ffc107 !important;
                        border-radius: 8px !important;
                        color: #000000 !important;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                        max-height: 200px !important;
                        overflow-y: auto !important;
                        z-index: 9999 !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-dropdown *,
                      .custom-datepicker .react-datepicker__year-dropdown * {
                        color: #000000 !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-option,
                      .custom-datepicker .react-datepicker__year-option {
                        color: #000000 !important;
                        background-color: #ffffff !important;
                        padding: 8px 12px !important;
                        cursor: pointer !important;
                        border-bottom: 1px solid #ddd !important;
                        font-weight: 600 !important;
                        text-shadow: none !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-option *,
                      .custom-datepicker .react-datepicker__year-option * {
                        color: #000000 !important;
                        font-weight: 600 !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-option:hover,
                      .custom-datepicker .react-datepicker__year-option:hover {
                        background-color: var(--color-gold) !important;
                        color: var(--color-navy) !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-option--selected,
                      .custom-datepicker .react-datepicker__year-option--selected {
                        background-color: var(--color-gold) !important;
                        color: var(--color-navy) !important;
                        font-weight: bold !important;
                      }
                      
                      /* Styling untuk navigation buttons (next/prev month) */
                      .custom-datepicker .react-datepicker__navigation {
                        border: none !important;
                        background: none !important;
                        color: var(--color-gold) !important;
                      }
                      
                      .custom-datepicker .react-datepicker__navigation:hover {
                        color: var(--color-gold) !important;
                      }
                      
                      /* Styling untuk dropdown arrows */
                      .custom-datepicker .react-datepicker__month-dropdown-container,
                      .custom-datepicker .react-datepicker__year-dropdown-container {
                        color: var(--color-gold) !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-read-view,
                      .custom-datepicker .react-datepicker__year-read-view {
                        color: var(--color-gold) !important;
                        border: 1px solid var(--color-gold) !important;
                        border-radius: 4px !important;
                        padding: 4px 8px !important;
                        background-color: rgba(255, 193, 7, 0.1) !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-read-view:hover,
                      .custom-datepicker .react-datepicker__year-read-view:hover {
                        border-color: var(--color-gold) !important;
                        color: var(--color-gold) !important;
                        background-color: rgba(255, 193, 7, 0.2) !important;
                      }
                      
                      .custom-datepicker .react-datepicker__month-read-view--down-arrow,
                      .custom-datepicker .react-datepicker__year-read-view--down-arrow {
                        border-top-color: var(--color-gold) !important;
                      }
                    `}</style>
                  </div>
                </div>

                <div className="pt-6 flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="cursor-pointer text-md py-3 px-6 bg-[var(--color-gold)] border border-[var(--color-gold)] rounded-lg hover:bg-[var(--color-gold)]"
                    style={{color: "var(--color-navy)"}}
                  >
                    {loading ? "Processing..." : "Submit Registration"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
