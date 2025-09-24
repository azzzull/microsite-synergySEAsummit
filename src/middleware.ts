import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

// Middleware to protect all /api/admin/* endpoints with JWT verification
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
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
