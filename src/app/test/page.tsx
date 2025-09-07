'use client';

import { useState } from 'react';

export default function TestPage() {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRealisticTest = async () => {
    if (!orderId) {
      alert('Please create a test registration first, or enter an existing Order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test/realistic-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          orderId: orderId,
          paymentMethod: 'VIRTUAL_ACCOUNT_BCA'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Realistic test failed:', error);
      setResult({ error: 'Realistic test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTest = async () => {
    setLoading(true);
    try {
      const testData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+62812345678',
        dob: '1990-01-01',
        address: 'Test Address 123',
        country: 'Indonesia'
      };

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      if (data.success && data.order_id) {
        setOrderId(data.order_id);
        setResult({
          message: 'Registration created successfully',
          order_id: data.order_id,
          payment_url: data.payment_url
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setResult({ error: 'Registration failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment System Test</h1>
        
        {/* Test Registration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Create Test Registration</h2>
          <p className="text-gray-600 mb-4">
            This will create a test registration and payment record in the database.
          </p>
          <button
            onClick={handleRegisterTest}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Creating...' : 'Create Test Registration'}
          </button>
        </div>

        {/* Realistic DOKU Payment Simulation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Realistic DOKU Payment Simulation</h2>
          <p className="text-gray-600 mb-4">
            This simulates a real DOKU payment callback with proper status synchronization between our database and DOKU system.
          </p>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., SSS2025-xxxxx)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRealisticTest}
              disabled={loading || !orderId}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Processing...' : 'Simulate DOKU Payment'}
            </button>
          </div>
          <div className="text-sm text-purple-600 bg-purple-50 p-3 rounded">
            <strong>Features:</strong> Synchronized status, Real DOKU payload structure, Proper transaction ID, Complete audit trail, E-ticket generation
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="flex gap-4">
            <a
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              View Admin Dashboard
            </a>
            <a
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Registration Form
            </a>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Testing Instructions</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Click "Create Test Registration" to generate a test order</li>
            <li>Copy the generated Order ID from the results</li>
            <li>Paste it in the "Simulate Payment Success" field</li>
            <li>Click "Simulate Payment" to complete the flow</li>
            <li>Check the Admin Dashboard to see all records</li>
            <li>Check browser console for email simulation logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
