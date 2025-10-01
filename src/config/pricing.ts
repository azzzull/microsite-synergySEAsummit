// Ticket Pricing Configuration
// This file centralizes all pricing-related settings for easy management

export const PRICING_CONFIG = {
  // Price display label
  PRICE_LABEL: "Early Bird Price", // Early bird pricing for sandbox testing
  
  // Currency settings
  CURRENCY: "IDR",
  LOCALE: "id-ID",
  
  // Promotional settings
  PROMOTIONAL_TEXT: "*Limited time offer",
  
  // Validation rules
  MIN_QUANTITY: 1,
  // No maximum quantity limit as requested
  
  // Event ticket limits
  MAX_EVENT_TICKETS: parseInt(process.env.MAX_EVENT_TICKETS || '210'), // Total tickets available for the event
  FALLBACK_PRICE: 250000, // Fallback price if database fails
} as const;

// Helper function to format price
export function formatPrice(amount: number): string {
  return amount.toLocaleString(PRICING_CONFIG.LOCALE);
}

// Fetch ticket price dynamically from the API
export async function fetchTicketPrice(): Promise<number> {
  try {
    const res = await fetch('/api/admin/pricing');
    const data = await res.json();
    if (data.success && Array.isArray(data.pricing) && data.pricing.length > 0) {
      return data.pricing[0].price;
    }
    throw new Error('Failed to fetch ticket price from API');
  } catch (error) {
    console.error('Error fetching ticket price:', error);
    // Import fallback from pricingService instead of hardcoding
    const { pricingService } = await import('@/lib/pricingService');
    return pricingService.getFallbackPrice();
  }
}

// Helper function to calculate total with dynamic pricing
export async function calculateTotal(quantity: number): Promise<number> {
  const ticketPrice = await fetchTicketPrice();
  return ticketPrice * quantity;
}

// Synchronous version for compatibility (uses fallback price)
export function calculateTotalSync(quantity: number, ticketPrice: number): number {
  return ticketPrice * quantity;
}
