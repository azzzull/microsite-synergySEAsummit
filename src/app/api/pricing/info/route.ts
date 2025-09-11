import { NextResponse } from "next/server";
import { pricingService } from "@/lib/pricingService";

export async function GET() {
  try {
    const pricingInfo = await pricingService.getPricingInfo();
    return NextResponse.json({ 
      success: true, 
      ...pricingInfo 
    });
  } catch (error) {
    console.error('❌ Error fetching pricing info:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch pricing information',
      currentPrice: pricingService.getFallbackPrice(),
      isEarlyBird: false,
      earlyBirdEnd: null,
      normalPrice: null,
      label: 'Regular Price'
    });
  }
}
