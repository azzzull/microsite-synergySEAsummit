"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";

interface Voucher {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  min_purchase: number;
  max_discount?: number;
  expiry_date?: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export default function VoucherManagementPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    description: '',
    min_purchase: '0',
    max_discount: '',
    expiry_date: '',
    usage_limit: '',
    is_active: true
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/vouchers');
      const data = await response.json();
      
      if (data.success) {
        setVouchers(data.vouchers);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        min_purchase: parseFloat(formData.min_purchase) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        expiry_date: formData.expiry_date || null
      };

      const url = editingVoucher ? '/api/admin/vouchers' : '/api/admin/vouchers';
      const method = editingVoucher ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchVouchers();
        resetForm();
        setShowForm(false);
        setEditingVoucher(null);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to save voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (code: string) => {
    if (!confirm(`Are you sure you want to deactivate voucher ${code}?`)) return;
    
    try {
      const response = await fetch(`/api/admin/vouchers?code=${code}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchVouchers();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to deactivate voucher');
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      type: voucher.type,
      value: voucher.value.toString(),
      description: voucher.description,
      min_purchase: voucher.min_purchase.toString(),
      max_discount: voucher.max_discount?.toString() || '',
      expiry_date: voucher.expiry_date ? new Date(voucher.expiry_date).toISOString().split('T')[0] : '',
      usage_limit: voucher.usage_limit?.toString() || '',
      is_active: voucher.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      min_purchase: '0',
      max_discount: '',
      expiry_date: '',
      usage_limit: '',
      is_active: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{color: "var(--color-gold)"}}>
        Voucher Management
      </h1>
      <p className="text-lg mb-8">Manage discount vouchers and promotional codes</p>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={() => {
            resetForm();
            setEditingVoucher(null);
            setShowForm(!showForm);
          }}
          className="px-6 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-medium hover:opacity-90 hover:cursor-pointer"
        >
          {showForm ? 'Cancel' : 'Add New Voucher'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-600">
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 hover:cursor-pointer text-sm underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white/5 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4" style={{color: "var(--color-gold)"}}>
            {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Voucher Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder="SAVE20"
                required
                disabled={!!editingVoucher}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed'})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Value {formData.type === 'percentage' ? '(%)' : '(Rp)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder={formData.type === 'percentage' ? '10' : '25000'}
                required
                min="0"
                max={formData.type === 'percentage' ? '100' : undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Min Purchase (Rp)</label>
              <input
                type="number"
                value={formData.min_purchase}
                onChange={(e) => setFormData({...formData, min_purchase: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder="Special discount for..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Discount (Rp) - Optional</label>
              <input
                type="number"
                value={formData.max_discount}
                onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder="50000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Usage Limit - Optional</label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                placeholder="100"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date - Optional</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-medium hover:opacity-90 hover:cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingVoucher ? 'Update Voucher' : 'Create Voucher'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVoucher(null);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:opacity-90 hover:cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Vouchers List */}
      <div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">No vouchers found</td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${voucher.type === 'percentage' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                        {voucher.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {voucher.type === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {voucher.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {voucher.used_count}{voucher.usage_limit ? `/${voucher.usage_limit}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${voucher.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {voucher.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="text-blue-400 hover:text-blue-300 hover:cursor-pointer underline"
                      >
                        Edit
                      </button>
                      {voucher.is_active && (
                        <button
                          onClick={() => handleDeactivate(voucher.code)}
                          className="text-red-400 hover:text-red-300 hover:cursor-pointer underline"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
