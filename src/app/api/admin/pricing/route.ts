import { NextResponse } from "next/server";
import { getPricing, updatePricing } from "./pricingService";
import { pricingService } from "@/lib/pricingService";

export async function GET() {
  // Return current pricing config
  const pricing = await getPricing();
  return NextResponse.json({ success: true, pricing });
}

export async function PUT(req: Request) {
  const body = await req.json();
  // Update pricing config
  const result = await updatePricing(body);
  
  // Clear pricing cache when price is updated
  pricingService.clearCache();
  console.log('🔄 Pricing updated and cache cleared');
  
  return NextResponse.json({ success: true, pricing: result });
}
