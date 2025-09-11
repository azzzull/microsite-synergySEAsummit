# Voucher Testing Guide

## Quick Test URLs

Visit these URLs in your browser after starting the dev server:

### 1. Main Registration Flow
- **Start Registration**: http://localhost:3000/register
- **Review Order**: http://localhost:3000/review-order (after filling registration)

### 2. Test Voucher Codes
Use these codes in the Review Order page:

#### Valid Vouchers:
- **WELCOME10** - 10% discount (max Rp 50,000)
- **SAVE25K** - Rp 25,000 off (min purchase Rp 100,000)
- **EARLYBIRD** - 15% discount (max Rp 75,000)
- **STUDENT20** - 20% discount (max Rp 100,000)
- **BULK50K** - Rp 50,000 off (min purchase Rp 500,000)

#### Invalid Vouchers (for error testing):
- **INVALID123** - Should show "Invalid voucher code"
- **EXPIRED** - Should show error
- **FAKE** - Should show error

### 3. Test Scenarios

#### Scenario 1: Single Ticket (Rp 250,000)
1. Fill registration form with 1 ticket
2. Go to review order
3. Try voucher **WELCOME10** → Should get Rp 25,000 discount
4. Final amount: Rp 225,000

#### Scenario 2: Bulk Order (2 tickets = Rp 500,000)
1. Fill registration form with 2 tickets
2. Go to review order
3. Try voucher **BULK50K** → Should get Rp 50,000 discount
4. Final amount: Rp 450,000

#### Scenario 3: Minimum Purchase Test
1. Fill registration form with 1 ticket (Rp 250,000)
2. Go to review order
3. Try voucher **SAVE25K** → Should work (min purchase Rp 100,000)
4. Final amount: Rp 225,000

### 4. Form Test Data

Use this sample data for quick testing:
- **Full Name**: Test User
- **Member ID**: 123456
- **Email**: test@example.com
- **Phone**: +628123456789
- **Date of Birth**: 1990-01-01
- **Address**: Jakarta, Indonesia
- **Country**: Indonesia

### 5. Expected Behavior

#### Registration Page:
- No total amount shown ✓
- Review Order button instead of "Register & Pay" ✓
- Form saves data to sessionStorage ✓

#### Review Order Page:
- Shows all registration details ✓
- Has ticket quantity +/- buttons ✓
- Has voucher input field ✓
- Shows price breakdown with discount ✓
- "Proceed to Payment" button ✓

### 6. API Testing (Manual)

If you want to test the API directly, use these curl commands:

```bash
# Test valid voucher
curl -X POST http://localhost:3000/api/voucher/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10","subtotal":250000}'

# Expected response:
# {
#   "success": true,
#   "voucher": {
#     "code": "WELCOME10",
#     "type": "percentage", 
#     "value": 10,
#     "description": "10% discount for new members",
#     "discountAmount": 25000
#   }
# }

# Test invalid voucher
curl -X POST http://localhost:3000/api/voucher/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"INVALID123","subtotal":250000}'

# Expected response:
# {
#   "success": false,
#   "error": "Invalid voucher code"
# }
```

### 7. Troubleshooting

If something doesn't work:
1. Check browser console for errors
2. Check server terminal for logs
3. Verify sessionStorage has registration data
4. Check if voucher codes are typed correctly (case-insensitive)
5. Ensure minimum purchase requirements are met
