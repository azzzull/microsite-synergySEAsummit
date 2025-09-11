# Voucher System Documentation

## Overview
The Synergy SEA Summit 2025 registration system now includes a comprehensive voucher/discount system. Users can apply voucher codes during the order review process to receive discounts on their ticket purchases.

## System Architecture

### 1. Registration Flow
1. **Registration Form** (`/register`) - Users fill their information and select ticket quantity
2. **Review Order** (`/review-order`) - Users review details, can modify ticket quantity, and apply vouchers
3. **Payment** - Users proceed to payment with applied discounts

### 2. Voucher Types
- **Percentage Discount**: Reduces total by a percentage (e.g., 10% off)
- **Fixed Amount**: Reduces total by a fixed amount (e.g., Rp 25,000 off)

### 3. Voucher Validation Rules
- **Active Status**: Voucher must be active
- **Expiry Date**: Voucher must not be expired
- **Minimum Purchase**: Order must meet minimum purchase requirement
- **Maximum Discount**: Percentage vouchers respect maximum discount limits
- **Usage Limit**: Vouchers can have usage limits (if implemented)

## Available Vouchers

### Development/Sandbox Vouchers

| Code | Type | Value | Description | Min Purchase | Max Discount |
|------|------|-------|-------------|--------------|--------------|
| `WELCOME10` | Percentage | 10% | 10% discount for new members | Rp 0 | Rp 50,000 |
| `SAVE25K` | Fixed | Rp 25,000 | Rp 25,000 off your order | Rp 100,000 | - |
| `EARLYBIRD` | Percentage | 15% | 15% early bird discount | Rp 0 | Rp 75,000 |
| `STUDENT20` | Percentage | 20% | 20% student discount | Rp 0 | Rp 100,000 |
| `BULK50K` | Fixed | Rp 50,000 | Rp 50,000 off for bulk orders | Rp 500,000 | - |

## API Endpoints

### Voucher Validation
```
POST /api/voucher/validate
```

**Request Body:**
```json
{
  "code": "WELCOME10",
  "subtotal": 250000
}
```

**Response (Success):**
```json
{
  "success": true,
  "voucher": {
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10,
    "description": "10% discount for new members",
    "discountAmount": 25000
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid voucher code"
}
```

### Payment with Voucher
```
POST /api/payment
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+628123456789",
  "email": "john@example.com",
  "dob": "1990-01-01",
  "address": "Jakarta, Indonesia",
  "country": "Indonesia",
  "memberId": "123456",
  "ticketQuantity": 1,
  "voucher": {
    "code": "WELCOME10",
    "discountAmount": 25000
  }
}
```

## Database Schema

### Registrations Table Updates
```sql
ALTER TABLE registrations 
ADD COLUMN voucher_code VARCHAR(50),
ADD COLUMN original_amount DECIMAL(12,2),
ADD COLUMN discount_amount DECIMAL(12,2) DEFAULT 0;
```

### New Vouchers Table
```sql
CREATE TABLE vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(12,2) NOT NULL,
    description TEXT,
    min_purchase DECIMAL(12,2) DEFAULT 0,
    max_discount DECIMAL(12,2),
    expiry_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Voucher Usage Tracking
```sql
CREATE TABLE voucher_usage (
    id SERIAL PRIMARY KEY,
    voucher_code VARCHAR(50) NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    discount_amount DECIMAL(12,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend Components

### Review Order Page (`/review-order`)
- **Features**:
  - Display registration details with edit option
  - Ticket quantity counter with +/- buttons
  - Voucher code input and validation
  - Real-time price calculation with discounts
  - Order summary with breakdown
  - Proceed to payment button

### Key Functions
- `handleQuantityChange()` - Update ticket quantity
- `handleApplyVoucher()` - Validate and apply voucher
- `handleRemoveVoucher()` - Remove applied voucher
- `handleProceedToPayment()` - Process payment with voucher

## Configuration

### Voucher Management
Vouchers are currently configured in:
- **API**: `/src/app/api/voucher/validate/route.ts`
- **Database**: Use SQL scripts to add/modify vouchers

### Adding New Vouchers
1. **Via Database**:
   ```sql
   INSERT INTO vouchers (code, type, value, description, min_purchase, max_discount, is_active)
   VALUES ('NEWCODE', 'percentage', 15, 'New voucher description', 0, 50000, true);
   ```

2. **Via API** (for development):
   Update the `VOUCHERS` object in `/src/app/api/voucher/validate/route.ts`

## Testing

### Test Scenarios
1. **Valid Voucher**: Apply `WELCOME10` to order ≥ Rp 250,000
2. **Invalid Code**: Try `INVALID123`
3. **Minimum Purchase**: Apply `SAVE25K` to order < Rp 100,000
4. **Maximum Discount**: Apply `WELCOME10` to large order
5. **Fixed Amount**: Apply `SAVE25K` to valid order
6. **Bulk Discount**: Apply `BULK50K` to 2+ tickets

### Test Data
- **Ticket Price**: Rp 250,000 (configured in `/src/config/pricing.ts`)
- **Sample Orders**:
  - 1 ticket = Rp 250,000
  - 2 tickets = Rp 500,000
  - 3 tickets = Rp 750,000

## Error Handling

### Common Error Messages
- "Invalid voucher code" - Code doesn't exist
- "This voucher has expired" - Past expiry date
- "Minimum purchase of Rp X required" - Below min purchase
- "This voucher is no longer active" - Deactivated voucher
- "This voucher has reached its usage limit" - Usage limit exceeded

## Production Deployment

### Database Migration
1. Run `database-voucher-update.sql` on production database
2. Verify voucher table creation and sample data
3. Test voucher validation API

### Environment Variables
No additional environment variables required for voucher system.

### Monitoring
- Track voucher usage via `voucher_usage` table
- Monitor discount amounts in `registrations` table
- Check voucher validation API performance

## Future Enhancements

### Potential Features
1. **Admin Panel for Vouchers**: Manage vouchers via web interface
2. **User-Specific Vouchers**: Vouchers tied to specific users/emails
3. **Bulk Voucher Generation**: Generate multiple vouchers automatically
4. **Voucher Analytics**: Usage statistics and reporting
5. **Time-Limited Vouchers**: Flash sales and time-based discounts
6. **Category-Based Vouchers**: Different vouchers for different ticket types

### Advanced Rules
1. **First-Time User**: Vouchers only for new customers
2. **Loyalty Points**: Vouchers based on previous purchases
3. **Referral Vouchers**: Discounts for referring friends
4. **Geographic Vouchers**: Location-based discounts

## Security Considerations

### Voucher Code Protection
- Codes are case-insensitive but stored uppercase
- Prevent brute force attacks on voucher validation
- Rate limiting on voucher API endpoints
- Audit trail of voucher usage

### Discount Validation
- Server-side validation of all discounts
- Prevent manipulation of discount amounts
- Validate minimum purchase requirements
- Ensure total amount never goes negative

## Support & Troubleshooting

### Common Issues
1. **Voucher Not Working**: Check active status and expiry
2. **Discount Too Low**: Check maximum discount limits
3. **Can't Apply**: Verify minimum purchase requirements
4. **API Errors**: Check database connection and voucher table

### Debug Steps
1. Check voucher exists in database/API
2. Verify order meets minimum requirements
3. Check voucher active status and expiry
4. Validate discount calculation logic
5. Review API error logs and responses
