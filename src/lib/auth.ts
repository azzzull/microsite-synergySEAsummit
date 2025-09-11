import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { secureLog } from './secureLogging';

// Only import bcrypt on server-side
let bcrypt: any = null;
if (typeof window === 'undefined') {
  try {
    bcrypt = require('bcrypt');
  } catch (error) {
    console.warn('bcrypt not available');
  }
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';
const BCRYPT_ROUNDS = 12;

export interface AuthToken {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginAttempt {
  ip: string;
  timestamp: number;
  success: boolean;
}

// In-memory store for login attempts (in production, use Redis/Database)
const loginAttempts = new Map<string, LoginAttempt[]>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Hash password using bcrypt (server-side only)
 */
export async function hashPassword(password: string): Promise<string> {
  if (!bcrypt) {
    throw new Error('bcrypt not available on client-side');
  }
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash (server-side only)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!bcrypt) {
    throw new Error('bcrypt not available on client-side');
  }
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<AuthToken, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: TOKEN_EXPIRY,
    issuer: 'synergy-admin',
    audience: 'synergy-admin-panel'
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'synergy-admin',
      audience: 'synergy-admin-panel'
    }) as AuthToken;
    return decoded;
  } catch (error) {
    secureLog.warn('Invalid JWT token', { error: error instanceof Error ? error.message : 'Unknown error' });
    return null;
  }
}

/**
 * Check if IP is locked out due to too many failed attempts
 */
export function isIpLockedOut(ip: string): boolean {
  const attempts = loginAttempts.get(ip) || [];
  const recentAttempts = attempts.filter(
    attempt => Date.now() - attempt.timestamp < LOCKOUT_DURATION
  );
  
  const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
  return failedAttempts.length >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Record login attempt
 */
export function recordLoginAttempt(ip: string, success: boolean): void {
  const attempts = loginAttempts.get(ip) || [];
  attempts.push({
    ip,
    timestamp: Date.now(),
    success
  });
  
  // Keep only recent attempts to prevent memory bloat
  const recentAttempts = attempts.filter(
    attempt => Date.now() - attempt.timestamp < LOCKOUT_DURATION * 2
  );
  
  loginAttempts.set(ip, recentAttempts);
  
  if (!success) {
    secureLog.warn('Failed login attempt', { ip, attemptsCount: recentAttempts.filter(a => !a.success).length });
  }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const remoteAddress = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  if (remoteAddress) {
    return remoteAddress.trim();
  }
  
  return 'unknown';
}

/**
 * Authenticate admin from request (server-side)
 */
export function authenticateRequest(request: NextRequest): AuthToken | null {
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('admin_token')?.value;
  
  let token = '';
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Client-side authentication check (simplified)
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('admin_token') || getCookie('admin_token');
  if (!token) return false;
  
  // Simple check: token exists and looks like a JWT (has 3 parts separated by dots)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) return false;
  
  try {
    // Decode payload without verification (server will verify properly)
    const payload = JSON.parse(atob(tokenParts[1]));
    const isExpired = payload.exp && payload.exp < Date.now() / 1000;
    return !isExpired;
  } catch (error) {
    console.warn('Token parsing failed:', error);
    return false;
  }
}

/**
 * Set admin authentication (client-side)
 */
export function setAdminAuthentication(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage for client-side access
  localStorage.setItem('admin_token', token);
  
  // Also set as httpOnly cookie via API call for better security
  fetch('/api/admin/set-cookie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  }).catch(error => {
    secureLog.error('Failed to set secure cookie', error);
  });
}

/**
 * Clear admin authentication
 */
export function clearAdminAuthentication(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('admin_token');
  
  // Clear cookie via API call
  fetch('/api/admin/logout', {
    method: 'POST'
  }).catch(error => {
    secureLog.error('Failed to clear secure cookie', error);
  });
}

/**
 * Get current admin user info
 */
export function getCurrentAdmin(): AuthToken | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('admin_token');
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Utility function to get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Validate admin credentials against environment or database (server-side only)
 */
export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  // This function should only be called on server-side
  if (typeof window !== 'undefined') {
    throw new Error('validateAdminCredentials should only be called on server-side');
  }
  
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;
  
  // If no hash is set, use temporary fallback (NOT SECURE - only for development)
  if (!ADMIN_PASS_HASH && process.env.NODE_ENV !== 'production') {
    const tempPassword = process.env.ADMIN_PASS || 'synergy2025';
    secureLog.warn('Using temporary password authentication - NOT SECURE FOR PRODUCTION');
    return username === ADMIN_USER && password === tempPassword;
  }
  
  if (!ADMIN_PASS_HASH) {
    secureLog.error('ADMIN_PASS_HASH not configured');
    return false;
  }
  
  if (username !== ADMIN_USER) {
    return false;
  }
  
  if (!bcrypt) {
    secureLog.error('bcrypt not available for password verification');
    return false;
  }
  
  return await bcrypt.compare(password, ADMIN_PASS_HASH);
}

/**
 * Generate secure admin password hash for environment setup (server-side only)
 */
export async function generateAdminPasswordHash(password: string): Promise<string> {
  if (!bcrypt) {
    throw new Error('bcrypt not available - use server-side only');
  }
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
