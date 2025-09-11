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

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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
    const result = await pool.query(
      `SELECT * FROM vouchers WHERE code = $1`,
      [voucherCode]
    );
    const voucher = result.rows[0];

    // Check if voucher exists
    if (!voucher) {
      return NextResponse.json({
        success: false,
        error: 'Invalid voucher code'
      }, { status: 404 });
    }

    // Check if voucher is active
    if (!voucher.is_active) {
      return NextResponse.json({
        success: false,
        error: 'This voucher is no longer active'
      }, { status: 400 });
    }

    // Check expiry date
    if (voucher.expiry_date) {
      const expiryDate = new Date(voucher.expiry_date);
      const now = new Date();
      if (now > expiryDate) {
        return NextResponse.json({
          success: false,
          error: 'This voucher has expired'
        }, { status: 400 });
      }
    }

    // Check minimum purchase requirement
    if (voucher.min_purchase && subtotal < voucher.min_purchase) {
      return NextResponse.json({
        success: false,
        error: `Minimum purchase of Rp ${voucher.min_purchase.toLocaleString('id-ID')} required for this voucher`
      }, { status: 400 });
    }

    // Check usage limit (if implemented)
    if (voucher.usage_limit && voucher.used_count && voucher.used_count >= voucher.usage_limit) {
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
      if (voucher.max_discount && discountAmount > voucher.max_discount) {
        discountAmount = voucher.max_discount;
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
