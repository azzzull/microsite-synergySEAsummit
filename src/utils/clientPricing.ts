// Client-safe pricing utilities
// This file can be safely imported in client-side components

export const PRICING_CONFIG = {
  CURRENCY: "IDR",
  LOCALE: "id-ID",
  FALLBACK_PRICE: 250000,
  MIN_QUANTITY: 1,
} as const;

// Format price according to Indonesian locale
export function formatPrice(amount: number): string {
  return amount.toLocaleString(PRICING_CONFIG.LOCALE);
}

// Calculate total for given quantity and price
export function calculateTotal(quantity: number, ticketPrice: number): number {
  return quantity * ticketPrice;
}

// Fetch current price from API (client-side safe)
export async function fetchCurrentPrice(): Promise<number> {
  try {
    const res = await fetch('/api/admin/pricing');
    const data = await res.json();
    
    if (data.success && Array.isArray(data.pricing) && data.pricing.length > 0) {
      return data.pricing[0].price;
    } else {
      console.warn('⚠️ No pricing data from API, using fallback');
      return PRICING_CONFIG.FALLBACK_PRICE;
    }
  } catch (error) {
    console.error('❌ Error fetching price from API:', error);
    return PRICING_CONFIG.FALLBACK_PRICE;
  }
}
