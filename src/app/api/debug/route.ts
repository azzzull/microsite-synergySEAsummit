import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const postgresUrl = process.env.POSTGRES_URL;
  const isRailwayConnection = postgresUrl?.includes('railway.app') || postgresUrl?.includes('containers-us-west');
  
  return NextResponse.json({
    environment: {
      DOKU_BASE_URL: process.env.NEXT_PUBLIC_DOKU_BASE_URL,
      CLIENT_ID: process.env.DOKU_CLIENT_ID ? 'SET' : 'MISSING',
      CLIENT_SECRET: process.env.DOKU_CLIENT_SECRET ? 'SET' : 'MISSING',
      MERCHANT_CODE: process.env.DOKU_MERCHANT_CODE ? 'SET' : 'MISSING',
      PUBLIC_KEY: process.env.DOKU_PUBLIC_KEY ? `SET (length: ${process.env.DOKU_PUBLIC_KEY.length})` : 'MISSING',
      BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      EVENT_PRICE: process.env.NEXT_PUBLIC_EVENT_PRICE,
      EVENT_NAME: process.env.NEXT_PUBLIC_EVENT_NAME,
      EVENT_CURRENCY: process.env.NEXT_PUBLIC_EVENT_CURRENCY,
    },
    database: {
      POSTGRES_URL: postgresUrl ? 'SET' : 'MISSING',
      provider: isRailwayConnection ? 'Railway' : (postgresUrl ? 'Other PostgreSQL' : 'Not configured'),
      host: postgresUrl ? postgresUrl.split('@')[1]?.split('/')[0] : 'N/A',
      configured: !!postgresUrl
    },
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown',
      environment: process.env.VERCEL_ENV || 'unknown'
    },
    node: {
      version: process.version,
      env: process.env.NODE_ENV
    },
    timestamp: new Date().toISOString(),
    debug_message: isRailwayConnection 
      ? "✅ Railway PostgreSQL detected! Ready for database operations" 
      : postgresUrl 
        ? "⚠️ PostgreSQL configured but not Railway"
        : "❌ PostgreSQL not configured - add POSTGRES_URL to environment variables"
  });
}
