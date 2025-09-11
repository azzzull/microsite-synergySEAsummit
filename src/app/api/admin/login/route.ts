import { NextRequest, NextResponse } from "next/server";
import { 
  validateAdminCredentials, 
  generateToken, 
  isIpLockedOut, 
  recordLoginAttempt, 
  getClientIp 
} from "@/lib/auth";
import { InputValidator } from "@/lib/validation";
import { secureLog } from "@/lib/secureLogging";

// Rate limiting - in production, use Redis or proper rate limiting service
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  
  // Check rate limiting
  if (isRateLimited(clientIp)) {
    secureLog.warn('Rate limit exceeded for admin login', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }
  
  // Check if IP is locked out due to failed attempts
  if (isIpLockedOut(clientIp)) {
    secureLog.warn('IP locked out due to failed login attempts', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: "Account temporarily locked due to too many failed attempts. Try again in 15 minutes." },
      { status: 423 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate and sanitize input
    const validation = InputValidator.validateAdminLogin(body);
    if (!validation.isValid) {
      recordLoginAttempt(clientIp, false);
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { username, password } = validation.sanitizedData!;
    
    // Validate credentials
    const isValid = await validateAdminCredentials(username, password);
    
    if (!isValid) {
      recordLoginAttempt(clientIp, false);
      secureLog.warn('Invalid admin login attempt', { username, ip: clientIp });
      
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken({
      id: username,
      username: username,
      role: 'admin'
    });
    
    recordLoginAttempt(clientIp, true);
    secureLog.info('Admin login successful', { username, ip: clientIp });
    
    // Create response with secure cookie
    const response = NextResponse.json({ 
      success: true, 
      token,
      user: { username, role: 'admin' }
    });
    
    // Set secure httpOnly cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    secureLog.error('Admin login error', error);
    recordLoginAttempt(clientIp, false);
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
