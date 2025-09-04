"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    ticket: "Regular"
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
      <div className="container mx-auto px-4 flex-1">
        <section className="max-w-lg mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-gold)"}}>Register</h1>
          {success ? (
            <div className="text-center font-bold" style={{color: "var(--color-gold)"}}>Registration successful! Please check your email for payment instructions.</div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="name" type="text" required placeholder="Name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}} />
              <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}} />
              <input name="phone" type="tel" required placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}} />
              <input name="company" type="text" placeholder="Company" value={form.company} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}} />
              <input name="position" type="text" placeholder="Position" value={form.position} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}} />
              <select name="ticket" value={form.ticket} onChange={handleChange} className="w-full px-4 py-2 rounded-lg" style={{background: "var(--color-navy)", borderColor: "var(--color-gold)", color: "var(--color-lightgrey)"}}>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Student">Student</option>
              </select>
              <Button type="submit" disabled={loading} className="cursor-pointer">{loading ? "Processing..." : "Checkout & Pay"}</Button>
            </form>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
