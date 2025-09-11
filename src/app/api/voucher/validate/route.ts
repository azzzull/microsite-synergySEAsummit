import { NextRequest, NextResponse } from 'next/server';

interface VoucherData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minPurchase?: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
}

// Mock voucher database - in production, this should be in a real database
const VOUCHERS: Record<string, VoucherData> = {
  'WELCOME10': {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: '10% discount for new members',
    minPurchase: 0,
    maxDiscount: 50000, // Max Rp 50,000 discount
    isActive: true
  },
  'SAVE25K': {
    code: 'SAVE25K',
    type: 'fixed',
    value: 25000,
    description: 'Rp 25,000 off your order',
    minPurchase: 100000, // Min Rp 100,000 purchase
    isActive: true
  },
  'EARLYBIRD': {
    code: 'EARLYBIRD',
    type: 'percentage',
    value: 15,
    description: '15% early bird discount',
    minPurchase: 0,
    maxDiscount: 75000, // Max Rp 75,000 discount
    expiryDate: '2025-10-01',
    isActive: true
  },
  'STUDENT20': {
    code: 'STUDENT20',
    type: 'percentage',
    value: 20,
    description: '20% student discount',
    minPurchase: 0,
    maxDiscount: 100000, // Max Rp 100,000 discount
    isActive: true
  },
  'BULK50K': {
    code: 'BULK50K',
    type: 'fixed',
    value: 50000,
    description: 'Rp 50,000 off for bulk orders',
    minPurchase: 500000, // Min Rp 500,000 (2+ tickets)
    isActive: true
  }
};

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Voucher code is required'
      }, { status: 400 });
    }

    if (!subtotal || typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid subtotal is required'
      }, { status: 400 });
    }

    const voucherCode = code.toUpperCase().trim();
    const voucher = VOUCHERS[voucherCode];

    // Check if voucher exists
    if (!voucher) {
      return NextResponse.json({
        success: false,
        error: 'Invalid voucher code'
      }, { status: 404 });
    }

    // Check if voucher is active
    if (!voucher.isActive) {
      return NextResponse.json({
        success: false,
        error: 'This voucher is no longer active'
      }, { status: 400 });
    }

    // Check expiry date
    if (voucher.expiryDate) {
      const expiryDate = new Date(voucher.expiryDate);
      const now = new Date();
      if (now > expiryDate) {
        return NextResponse.json({
          success: false,
          error: 'This voucher has expired'
        }, { status: 400 });
      }
    }

    // Check minimum purchase requirement
    if (voucher.minPurchase && subtotal < voucher.minPurchase) {
      return NextResponse.json({
        success: false,
        error: `Minimum purchase of Rp ${voucher.minPurchase.toLocaleString('id-ID')} required for this voucher`
      }, { status: 400 });
    }

    // Check usage limit (if implemented)
    if (voucher.usageLimit && voucher.usedCount && voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json({
        success: false,
        error: 'This voucher has reached its usage limit'
      }, { status: 400 });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.type === 'percentage') {
      discountAmount = subtotal * (voucher.value / 100);
      // Apply max discount limit for percentage vouchers
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else {
      // Fixed amount discount
      discountAmount = Math.min(voucher.value, subtotal); // Can't discount more than subtotal
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        description: voucher.description,
        discountAmount: Math.round(discountAmount)
      }
    });

  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
