import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { secureLog } from "@/lib/secureLogging";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    // Verify token before setting cookie
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ success: true });
    
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
    secureLog.error('Failed to set admin cookie', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
