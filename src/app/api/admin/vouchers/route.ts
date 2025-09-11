import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// GET - List all vouchers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = `
      SELECT 
        id, code, type, value, description, min_purchase, max_discount,
        expiry_date, usage_limit, used_count, is_active, created_at, updated_at
      FROM vouchers 
    `;
    
    const params: any[] = [];
    if (active !== null) {
      query += ` WHERE is_active = $1`;
      params.push(active === 'true');
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      success: true,
      vouchers: result.rows
    });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vouchers'
    }, { status: 500 });
  }
}

// POST - Create new voucher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      code, type, value, description, 
      min_purchase = 0, max_discount = null, 
      expiry_date = null, usage_limit = null, 
      is_active = true 
    } = body;

    // Validation
    if (!code || !type || !value || !description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: code, type, value, description'
      }, { status: 400 });
    }

    if (!['percentage', 'fixed'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Type must be either "percentage" or "fixed"'
      }, { status: 400 });
    }

    // Check if voucher code already exists
    const existingCheck = await pool.query(
      'SELECT id FROM vouchers WHERE code = $1',
      [code.toUpperCase()]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Voucher code already exists'
      }, { status: 400 });
    }

    // Create voucher
    const result = await pool.query(`
      INSERT INTO vouchers (
        code, type, value, description, min_purchase, max_discount,
        expiry_date, usage_limit, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      code.toUpperCase(), type, value, description,
      min_purchase, max_discount, expiry_date, usage_limit, is_active
    ]);

    return NextResponse.json({
      success: true,
      voucher: result.rows[0],
      message: 'Voucher created successfully'
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create voucher'
    }, { status: 500 });
  }
}

// PUT - Update voucher
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      code, type, value, description, 
      min_purchase, max_discount, expiry_date, 
      usage_limit, is_active 
    } = body;

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Voucher code is required'
      }, { status: 400 });
    }

    // Build dynamic update query
    const updateFields = [];
    const params = [];
    let paramIndex = 1;

    if (type !== undefined) {
      updateFields.push(`type = $${paramIndex++}`);
      params.push(type);
    }
    if (value !== undefined) {
      updateFields.push(`value = $${paramIndex++}`);
      params.push(value);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    if (min_purchase !== undefined) {
      updateFields.push(`min_purchase = $${paramIndex++}`);
      params.push(min_purchase);
    }
    if (max_discount !== undefined) {
      updateFields.push(`max_discount = $${paramIndex++}`);
      params.push(max_discount);
    }
    if (expiry_date !== undefined) {
      updateFields.push(`expiry_date = $${paramIndex++}`);
      params.push(expiry_date);
    }
    if (usage_limit !== undefined) {
      updateFields.push(`usage_limit = $${paramIndex++}`);
      params.push(usage_limit);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      params.push(is_active);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No fields to update'
      }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(code.toUpperCase());

    const query = `
      UPDATE vouchers 
      SET ${updateFields.join(', ')}
      WHERE code = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Voucher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      voucher: result.rows[0],
      message: 'Voucher updated successfully'
    });
  } catch (error) {
    console.error('Error updating voucher:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update voucher'
    }, { status: 500 });
  }
}

// DELETE - Deactivate voucher
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Voucher code is required'
      }, { status: 400 });
    }

    const result = await pool.query(`
      UPDATE vouchers 
      SET is_active = false, updated_at = NOW()
      WHERE code = $1
      RETURNING *
    `, [code.toUpperCase()]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Voucher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      voucher: result.rows[0],
      message: 'Voucher deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating voucher:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to deactivate voucher'
    }, { status: 500 });
  }
}
