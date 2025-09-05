"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate Doku Payment API here
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
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
                <div className="bg-[var(--color-gold)] text-[var(--color-navy)] px-4 py-3 rounded-lg inline-block">
                  <p className="text-xl font-bold">Early Bird Price: Rp 250.000</p>
                  <p className="text-sm">*Limited time offer</p>
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
            <div className="text-center font-bold text-xl p-8 rounded-lg" style={{color: "var(--color-gold)", backgroundColor: "rgba(255, 255, 255, 0.05)"}}>
              Registration successful! Please check your email for payment instructions.
            </div>
          ) : (
            /* Form Container */
            <div className="p-8 rounded-lg" style={{backgroundColor: "rgba(255, 255, 255, 0.05)"}}>
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
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:border-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-navy)", 
                        borderColor: "rgba(212, 175, 55, 0.5)", 
                        color: "var(--color-lightgrey)"
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
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '');
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:border-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-navy)", 
                        borderColor: "rgba(212, 175, 55, 0.5)", 
                        color: "var(--color-lightgrey)"
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
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:border-yellow-400" 
                      style={{
                        backgroundColor: "var(--color-navy)", 
                        borderColor: "rgba(212, 175, 55, 0.5)", 
                        color: "var(--color-lightgrey)"
                      }} 
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label htmlFor="dob" className="md:w-1/3 font-medium" style={{color: "var(--color-lightgrey)"}}>Date of Birth</label>
                  <div className="md:w-2/3 relative">
                    <input 
                      type="date" 
                      id="dob"
                      name="dob" 
                      required 
                      value={form.dob} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:border-yellow-400 date-input" 
                      style={{
                        backgroundColor: "var(--color-navy)", 
                        borderColor: "rgba(212, 175, 55, 0.5)", 
                        color: "var(--color-lightgrey)"
                      }} 
                    />
                    <style jsx>{`
                      .date-input::-webkit-calendar-picker-indicator {
                        filter: brightness(0) saturate(100%) invert(84%) sepia(4%) saturate(0%) hue-rotate(313deg) brightness(96%) contrast(92%);
                        cursor: pointer;
                        opacity: 0.8;
                      }
                      .date-input::-webkit-calendar-picker-indicator:hover {
                        opacity: 1;
                      }
                    `}</style>
                  </div>
                </div>

                <div className="pt-6 flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="cursor-pointer text-md py-3 px-6 border-2 border-[var(--color-gold)] rounded-lg hover:bg-[var(--color-navy)]"
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
