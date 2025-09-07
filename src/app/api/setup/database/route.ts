import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function GET() {
  try {
    console.log('🔧 Setting up Vercel Postgres database...');
    
    const result = await postgresDb.initializeDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Database initialization failed'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database setup failed'
    }, { status: 500 });
  }
}

export async function POST() {
  // Force recreate tables (for development only)
  try {
    console.log('🔧 Force recreating database tables...');
    
    const result = await postgresDb.initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database tables recreated',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database recreation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
