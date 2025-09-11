"use client";
import { useState, useEffect } from 'react';

interface PricingInfoProps {
  onPriceUpdate?: (price: number) => void;
}

export default function PricingInfo({ onPriceUpdate }: PricingInfoProps) {
  const [pricingInfo, setPricingInfo] = useState<{
    currentPrice: number;
    isEarlyBird: boolean;
    earlyBirdEnd: Date | null;
    normalPrice: number | null;
    label: string;
    promotionalText?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingInfo();
  }, []);

  const fetchPricingInfo = async () => {
    try {
      const response = await fetch('/api/pricing/info');
      const data = await response.json();
      
      if (data.success) {
        const info = {
          currentPrice: data.currentPrice,
          isEarlyBird: data.isEarlyBird,
          earlyBirdEnd: data.earlyBirdEnd ? new Date(data.earlyBirdEnd) : null,
          normalPrice: data.normalPrice,
          label: data.label,
          promotionalText: data.promotionalText
        };
        setPricingInfo(info);
        onPriceUpdate?.(info.currentPrice);
      }
    } catch (error) {
      console.error('Error fetching pricing info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!pricingInfo) {
    return (
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-red-400">Error loading pricing information</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{color: "var(--color-gold)"}}>
            Ticket Price
          </h3>
          <p className="text-sm text-gray-400">{pricingInfo.label}</p>
        </div>
        {pricingInfo.isEarlyBird && (
          <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            Early Bird Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{color: "var(--color-gold)"}}>
            {formatPrice(pricingInfo.currentPrice)}
          </span>
          <span className="text-sm text-gray-400">per ticket</span>
        </div>

        {pricingInfo.promotionalText && (
          <p className="text-sm text-blue-300 italic">
            {pricingInfo.promotionalText}
          </p>
        )}

        {pricingInfo.isEarlyBird && pricingInfo.earlyBirdEnd && (
          <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-300 text-sm font-medium">⏰ Early Bird Ends:</span>
            </div>
            <p className="text-orange-200 text-sm">
              {formatDate(pricingInfo.earlyBirdEnd)}
            </p>
            {getDaysRemaining(pricingInfo.earlyBirdEnd) > 0 && (
              <p className="text-orange-300 text-xs mt-1">
                {getDaysRemaining(pricingInfo.earlyBirdEnd)} days remaining
              </p>
            )}
            {pricingInfo.normalPrice && (
              <p className="text-gray-400 text-xs mt-2">
                Regular price: {formatPrice(pricingInfo.normalPrice)}
              </p>
            )}
          </div>
        )}

        {!pricingInfo.isEarlyBird && (
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              💰 This is the regular ticket price
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
