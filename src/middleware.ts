import { NextRequest, NextResponse } from 'next/server';
// Middleware to protect all /api/admin/* endpoints: only check for presence of admin_token cookie (Edge compatible)
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const publicAdminEndpoints = [
    '/api/admin/login',
    '/api/admin/set-cookie',
    '/api/admin/logout',
    '/api/admin/pricing',
    '/api/admin/vouchers',
    '/api/admin/registrations',
    '/api/admin/validate-ticket',
    '/api/admin/apply-validation-schema',
    '/api/payment/callback',
  ];
  
  // Allow all /api/payment endpoints (payment, callback, return)
  if (path.startsWith('/api/payment')) {
    return NextResponse.next();
  }
  if (
    path.startsWith('/api/admin') &&
    !publicAdminEndpoints.includes(path)
  ) {
    const hasToken = !!req.cookies.get('admin_token');
    if (!hasToken) {
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
