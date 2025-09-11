// Centralized pricing service that ensures all prices are synced with database
import { postgresDb } from './postgresDatabase';

interface PricingData {
  id: number;
  ticket_type: string;
  price: number;
  label: string;
  promotional_text?: string;
  early_bird_end: string | null;
  normal_price?: number; // Harga normal setelah early bird berakhir
  created_at: Date;
  updated_at: Date;
}

class PricingService {
  private cachedPrice: number | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly FALLBACK_PRICE = 250000;

  /**
   * Get current ticket price from database with early bird logic
   */
  async getCurrentPrice(): Promise<number> {
    // Check if cache is still valid
    if (this.cachedPrice && Date.now() < this.cacheExpiry) {
      return this.cachedPrice;
    }

    try {
      const result = await postgresDb.executeQuery(
        'SELECT * FROM pricing ORDER BY id ASC LIMIT 1'
      );

      if (result && result.rows && result.rows.length > 0) {
        const pricingData = result.rows[0] as PricingData;
        const currentPrice = this.calculateCurrentPrice(pricingData);
        
        this.cachedPrice = currentPrice;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        console.log('✅ Ticket price fetched from database:', currentPrice);
        return currentPrice;
      } else {
        console.warn('⚠️ No pricing data found in database, using fallback');
        return this.FALLBACK_PRICE;
      }
    } catch (error) {
      console.error('❌ Error fetching price from database:', error);
      return this.FALLBACK_PRICE;
    }
  }

  /**
   * Calculate current price based on early bird logic
   */
  private calculateCurrentPrice(pricingData: PricingData): number {
    // Jika tidak ada tanggal early bird end, gunakan harga biasa
    if (!pricingData.early_bird_end) {
      return pricingData.price;
    }

    const now = new Date();
    const earlyBirdEnd = new Date(pricingData.early_bird_end);
    
    // Jika masih dalam periode early bird
    if (now <= earlyBirdEnd) {
      console.log('🎉 Early bird period active, using early bird price:', pricingData.price);
      return pricingData.price;
    } else {
      // Early bird sudah berakhir
      const normalPrice = pricingData.normal_price || Math.round(pricingData.price * 1.2); // Default: 20% lebih mahal
      console.log('⏰ Early bird period ended, using normal price:', normalPrice);
      return normalPrice;
    }
  }

  /**
   * Get pricing information with early bird status
   */
  async getPricingInfo(): Promise<{
    currentPrice: number;
    isEarlyBird: boolean;
    earlyBirdEnd: Date | null;
    normalPrice: number | null;
    label: string;
    promotionalText?: string;
  }> {
    try {
      const result = await postgresDb.executeQuery(
        'SELECT * FROM pricing ORDER BY id ASC LIMIT 1'
      );

      if (result && result.rows && result.rows.length > 0) {
        const pricingData = result.rows[0] as PricingData;
        const now = new Date();
        const earlyBirdEnd = pricingData.early_bird_end ? new Date(pricingData.early_bird_end) : null;
        const isEarlyBird = earlyBirdEnd ? now <= earlyBirdEnd : false;
        const currentPrice = this.calculateCurrentPrice(pricingData);
        const normalPrice = pricingData.normal_price || Math.round(pricingData.price * 1.2);

        return {
          currentPrice,
          isEarlyBird,
          earlyBirdEnd,
          normalPrice: isEarlyBird ? normalPrice : null,
          label: isEarlyBird ? pricingData.label : 'Regular Price',
          promotionalText: isEarlyBird && pricingData.promotional_text && pricingData.promotional_text.trim() ? pricingData.promotional_text : undefined
        };
      }
    } catch (error) {
      console.error('❌ Error fetching pricing info:', error);
    }

    return {
      currentPrice: this.FALLBACK_PRICE,
      isEarlyBird: false,
      earlyBirdEnd: null,
      normalPrice: null,
      label: 'Regular Price'
    };
  }

  /**
   * Get current price for API routes (client-side)
   */
  async getCurrentPriceFromAPI(): Promise<number> {
    try {
      const res = await fetch('/api/admin/pricing');
      const data = await res.json();
      
      if (data.success && Array.isArray(data.pricing) && data.pricing.length > 0) {
        const price = data.pricing[0].price;
        console.log('✅ Ticket price fetched from API:', price);
        return price;
      } else {
        console.warn('⚠️ No pricing data from API, using fallback');
        return this.FALLBACK_PRICE;
      }
    } catch (error) {
      console.error('❌ Error fetching price from API:', error);
      return this.FALLBACK_PRICE;
    }
  }

  /**
   * Calculate total amount for given quantity
   */
  async calculateTotal(quantity: number): Promise<number> {
    const price = await this.getCurrentPrice();
    return price * quantity;
  }

  /**
   * Calculate total amount for given quantity (client-side)
   */
  async calculateTotalFromAPI(quantity: number): Promise<number> {
    const price = await this.getCurrentPriceFromAPI();
    return price * quantity;
  }

  /**
   * Synchronous calculation when price is already known
   */
  calculateTotalSync(quantity: number, ticketPrice: number): number {
    return ticketPrice * quantity;
  }

  /**
   * Clear price cache (useful when price is updated in admin)
   */
  clearCache(): void {
    this.cachedPrice = null;
    this.cacheExpiry = 0;
    console.log('🔄 Pricing cache cleared');
  }

  /**
   * Format price according to Indonesian locale
   */
  formatPrice(amount: number): string {
    return amount.toLocaleString('id-ID');
  }

  /**
   * Get fallback price
   */
  getFallbackPrice(): number {
    return this.FALLBACK_PRICE;
  }
}

// Export singleton instance
export const pricingService = new PricingService();

// Export for backward compatibility
export const formatPrice = (amount: number): string => pricingService.formatPrice(amount);
export const getCurrentPrice = (): Promise<number> => pricingService.getCurrentPrice();
export const calculateTotal = (quantity: number): Promise<number> => pricingService.calculateTotal(quantity);
