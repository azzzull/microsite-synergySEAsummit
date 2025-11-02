import { NextRequest, NextResponse } from 'next/server';
import { postgresDb } from '@/lib/postgresDatabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting validation schema application...');

    // Step 1: Add validation tracking columns
    console.log('📝 Adding validation tracking columns...');
    await postgresDb.executeQuery(`
      ALTER TABLE tickets 
      ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS used_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS validation_status VARCHAR(50) DEFAULT 'unused';
    `);
    console.log('✅ Columns added successfully');

    // Step 2: Create indexes
    console.log('📝 Creating indexes...');
    await postgresDb.executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_tickets_validated_at ON tickets(validated_at);
    `);
    await postgresDb.executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_tickets_validation_status ON tickets(validation_status);
    `);
    console.log('✅ Indexes created successfully');

    // Step 3: Update existing tickets
    console.log('📝 Updating existing tickets...');
    const updateResult = await postgresDb.executeQuery(`
      UPDATE tickets 
      SET validation_status = 'unused', used_count = 0 
      WHERE validation_status IS NULL OR validation_status = '';
    `);
    console.log(`✅ Updated ${updateResult.rowCount} tickets`);

    // Step 4: Verify schema
    console.log('📝 Verifying schema...');
    const schemaCheck = await postgresDb.executeQuery(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tickets' 
      AND column_name IN ('validated_at', 'used_count', 'validation_status')
      ORDER BY ordinal_position;
    `);
    
    console.log('✅ Schema verification:', schemaCheck.rows);

    return NextResponse.json({
      success: true,
      message: 'Validation schema applied successfully',
      updatedTickets: updateResult.rowCount,
      schema: schemaCheck.rows
    });

  } catch (error: any) {
    console.error('❌ Error applying validation schema:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to apply validation schema'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if columns exist
    const schemaCheck = await postgresDb.executeQuery(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tickets' 
      AND column_name IN ('validated_at', 'used_count', 'validation_status')
      ORDER BY ordinal_position;
    `);

    const hasAllColumns = schemaCheck.rows.length === 3;

    return NextResponse.json({
      schemaApplied: hasAllColumns,
      columns: schemaCheck.rows,
      message: hasAllColumns 
        ? 'Validation schema is already applied' 
        : 'Validation schema needs to be applied (POST to this endpoint)'
    });
  } catch (error: any) {
    console.error('❌ Error checking validation schema:', error);
    return NextResponse.json({
      error: error.message || 'Failed to check validation schema'
    }, { status: 500 });
  }
}
