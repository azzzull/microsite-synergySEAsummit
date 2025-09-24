import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

// Middleware to protect all /api/admin/* endpoints with JWT verification, except login/logout/set-cookie
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // List of admin endpoints that should NOT be protected
  const publicAdminEndpoints = [
    '/api/admin/login',
    '/api/admin/set-cookie',
    '/api/admin/logout',
  ];
  if (
    path.startsWith('/api/admin') &&
    !publicAdminEndpoints.includes(path)
  ) {
    const auth = authenticateRequest(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
