'use client';

import { useState } from 'react';

export default function DatabaseSetupPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [sql, setSql] = useState('SELECT COUNT(*) FROM registrations;');

  const setupDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sql-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup' })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const runCustomSQL = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sql-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Database Setup & SQL Runner</h1>
      
      <div className="space-y-6">
        {/* Quick Setup */}
        <div className="bg-blue-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Database Setup</h2>
          <p className="text-gray-700 mb-4">
            This will create tables and add sample data to your Railway PostgreSQL database.
          </p>
          <button
            onClick={setupDatabase}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Setup Database'}
          </button>
        </div>

        {/* Custom SQL Runner */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🔧 Custom SQL Runner</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">SQL Query:</label>
              <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="w-full p-3 border rounded-md font-mono text-sm h-32"
                placeholder="Enter your SQL query here..."
              />
            </div>
            <button
              onClick={runCustomSQL}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Running...' : 'Run Query'}
            </button>
          </div>
        </div>

        {/* Common Queries */}
        <div className="bg-yellow-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">📋 Common Queries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSql('SELECT COUNT(*) FROM registrations;')}
              className="text-left p-3 bg-white border rounded hover:bg-gray-50"
            >
              <div className="font-medium">Count Registrations</div>
              <div className="text-sm text-gray-600">SELECT COUNT(*) FROM registrations;</div>
            </button>
            <button
              onClick={() => setSql('SELECT * FROM registrations LIMIT 5;')}
              className="text-left p-3 bg-white border rounded hover:bg-gray-50"
            >
              <div className="font-medium">View Registrations</div>
              <div className="text-sm text-gray-600">SELECT * FROM registrations LIMIT 5;</div>
            </button>
            <button
              onClick={() => setSql('SELECT COUNT(*) FROM payments;')}
              className="text-left p-3 bg-white border rounded hover:bg-gray-50"
            >
              <div className="font-medium">Count Payments</div>
              <div className="text-sm text-gray-600">SELECT COUNT(*) FROM payments;</div>
            </button>
            <button
              onClick={() => setSql('SELECT COUNT(*) FROM tickets;')}
              className="text-left p-3 bg-white border rounded hover:bg-gray-50"
            >
              <div className="font-medium">Count Tickets</div>
              <div className="text-sm text-gray-600">SELECT COUNT(*) FROM tickets;</div>
            </button>
            <button
              onClick={() => setSql(`SELECT 
  r.full_name, 
  r.email, 
  r.status as reg_status,
  p.status as payment_status,
  t.ticket_code
FROM registrations r
LEFT JOIN payments p ON r.order_id = p.order_id
LEFT JOIN tickets t ON r.order_id = t.order_id
LIMIT 10;`)}
              className="text-left p-3 bg-white border rounded hover:bg-gray-50 md:col-span-2"
            >
              <div className="font-medium">Full Data Join</div>
              <div className="text-sm text-gray-600">JOIN registrations, payments, and tickets</div>
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">📊 Results</h2>
            <pre className="text-green-400 text-sm overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
