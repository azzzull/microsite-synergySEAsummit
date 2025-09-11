"use client";
import { useState, useEffect } from "react";

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<any[]>([]);
  const [form, setForm] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    setLoading(true);
    const res = await fetch("/api/admin/pricing");
    const data = await res.json();
    if (data.success) {
      setPricing(data.pricing);
      setForm(
        data.pricing.map((row: any) => ({
          id: row.id,
          ticket_type: row.ticket_type,
          price: row.price.toString(),
          normal_price: row.normal_price ? row.normal_price.toString() : "",
          label: row.label || "",
          promotional_text: row.promotional_text || "",
          early_bird_end: row.early_bird_end ? row.early_bird_end.split("T")[0] : ""
        }))
      );
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Prepare payload for PUT (array of pricing rows)
    const payload = form.map(f => ({
      id: f.id,
      ticket_type: f.ticket_type,
      price: parseInt(f.price),
      normal_price: f.normal_price ? parseInt(f.normal_price) : null,
      label: f.label,
      promotional_text: f.promotional_text,
      early_bird_end: f.early_bird_end ? f.early_bird_end : null
    }));
    const res = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      setPricing(data.pricing);
      alert("Harga tiket berhasil diupdate!");
    }
    setSaving(false);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{color: "var(--color-gold)"}}>Ticket Pricing Management</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg" style={{color: "var(--color-lightgrey)"}}>Loading pricing data...</div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="grid gap-8">
            {form.map((row, idx) => (
              <div key={row.id || idx} className="border border-gray-700 rounded-lg p-4 mb-2 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4" style={{color: "var(--color-gold)"}}>Pricing Entry #{idx + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ticket Type</label>
                    <input
                      type="text"
                      value={row.ticket_type}
                      onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, ticket_type: e.target.value } : r))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Early Bird Price (IDR)</label>
                    <input
                      type="number"
                      value={row.price}
                      onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, price: e.target.value } : r))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                      required
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Normal Price (IDR)</label>
                    <input
                      type="number"
                      value={row.normal_price}
                      onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, normal_price: e.target.value } : r))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                      min="0"
                      placeholder="Harga setelah early bird berakhir"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Label</label>
                    <input
                      type="text"
                      value={row.label}
                      onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, label: e.target.value } : r))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Early Bird End Date</label>
                    <input
                      type="date"
                      value={row.early_bird_end}
                      onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, early_bird_end: e.target.value } : r))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Promotional Text</label>
                  <input
                    type="text"
                    value={row.promotional_text}
                    onChange={e => setForm(f => f.map((r, i) => i === idx ? { ...r, promotional_text: e.target.value } : r))}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                    placeholder="e.g., *Limited time offer"
                  />
                </div>
              </div>
            ))}
            
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-semibold hover:opacity-90 hover:cursor-pointer disabled:opacity-50 transition-opacity"
              >
                {saving ? 'Updating...' : 'Update Pricing'}
              </button>
              
              <button
                type="button"
                onClick={fetchPricing}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 hover:cursor-pointer transition-colors"
              >
                Reset Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
