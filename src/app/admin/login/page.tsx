"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, setAdminAuthentication } from "@/lib/auth";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAdminAuthenticated()) {
      router.replace("/admin/pricing");
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLockoutMessage("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Use new secure authentication with JWT token
        setAdminAuthentication(data.token);
        router.push("/admin/pricing");
      } else {
        if (res.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (res.status === 423) {
          setLockoutMessage("Account temporarily locked due to too many failed attempts. Try again in 15 minutes.");
        } else {
          setError(data.error || "Login gagal");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--color-navy-dark)] to-[var(--color-navy)]">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-gold)"}}>Admin Login</h1>
        
        {lockoutMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{lockoutMessage}</p>
          </div>
        )}
        
        {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
          required
          disabled={loading}
          autoComplete="username"
          minLength={3}
          maxLength={50}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
          required
          disabled={loading}
          autoComplete="current-password"
          minLength={8}
          maxLength={128}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-medium hover:opacity-90 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300 text-xs text-center">
            🔒 Secured with JWT authentication, rate limiting, and account lockout protection
          </p>
        </div>
      </form>
    </div>
  );
}
