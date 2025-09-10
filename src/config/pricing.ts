// Ticket Pricing Configuration
// This file centralizes all pricing-related settings for easy management

export const PRICING_CONFIG = {
  // Current ticket price in IDR
  TICKET_PRICE: 250000, // IDR 250,000 - Sandbox testing price (same as real early bird price)
  
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
} as const;

// Helper function to format price
export function formatPrice(amount: number): string {
  return amount.toLocaleString(PRICING_CONFIG.LOCALE);
}

// Helper function to calculate total
export function calculateTotal(quantity: number): number {
  return PRICING_CONFIG.TICKET_PRICE * quantity;
}
