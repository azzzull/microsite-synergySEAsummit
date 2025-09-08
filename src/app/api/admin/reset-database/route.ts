import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    console.log("🗑️ Database reset request received");
    
    // Get confirmation from request body
    const body = await request.json();
    const { confirm } = body;
    
    // Safety check - require explicit confirmation
    if (confirm !== "RESET_ALL_DATA") {
      return NextResponse.json(
        { 
          error: "Confirmation required", 
          message: "Please send { \"confirm\": \"RESET_ALL_DATA\" } to proceed" 
        },
        { status: 400 }
      );
    }

    console.log("🚨 Proceeding with database reset...");

    // Clear all data using the dedicated method
    const result = await postgresDb.clearAllData();

    console.log("🧹 Database reset completed:", result);

    return NextResponse.json({
      success: true,
      message: "Database has been reset successfully",
      rowsDeleted: result.results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("❌ Database reset error:", error);
    return NextResponse.json(
      { 
        error: "Database reset failed", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Database Reset Endpoint",
    usage: "Send POST request with { \"confirm\": \"RESET_ALL_DATA\" }",
    warning: "⚠️  This will permanently delete ALL data from registrations, payments, and tickets tables",
    status: "active",
    timestamp: new Date().toISOString()
  });
}
