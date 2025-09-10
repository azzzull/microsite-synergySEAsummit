# Admin Panel & Multiple Tickets Guide

## Admin Panel Updates

### New Columns Added:
1. **Member ID** - 6+ digit member identifier
2. **Qty** - Number of tickets purchased (ticket quantity)

### Column Layout:
```
Order ID | Name | Email | Phone | Member ID | Qty | Amount | Status | Created
```

## Multiple Tickets System

### How It Works:
- User purchases multiple tickets (e.g., 3 tickets)
- System generates 3 separate tickets with unique IDs
- Each ticket gets individual QR code
- All tickets sent in one email

### Ticket ID Format:
**New Format**: `TICKET-{orderId}-{ticketNumber}-{timestamp}-{randomString}`

**Example**:
```
TICKET-SSS2025-1736502345-abc123-01-1736502345678-x7k9m2
TICKET-SSS2025-1736502345-abc123-02-1736502345678-p4n8q1
TICKET-SSS2025-1736502345-abc123-03-1736502345678-z2v5c9
```

**Components**:
- `SSS2025-1736502345-abc123` = Order ID
- `01`, `02`, `03` = Ticket number (padded with zeros)
- `1736502345678` = Timestamp
- `x7k9m2` = Random string for uniqueness

### Old vs New Format:
- **Old**: `TICKET-{orderId}-{i}-{Date.now()}` → Could create "1x61x2" format
- **New**: More structured with proper padding and random suffix

## Troubleshooting

### "1x61x2" Format Issue:
This was caused by:
1. **Timestamp collision** - Multiple tickets created at same millisecond
2. **URL encoding** - QR code URLs encoding dash characters
3. **Display formatting** - String concatenation issues

### Fixed By:
1. **Unique timestamps** - Each ticket gets fresh timestamp
2. **Random suffix** - Added 6-character random string
3. **Padded numbers** - Ticket numbers padded with zeros (01, 02, 03)
4. **Better formatting** - Cleaner string construction

## Database Structure

### registrations table:
```sql
- order_id (VARCHAR)
- full_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- member_id (VARCHAR) -- New field
- ticket_quantity (INTEGER) -- New field
- amount (INTEGER)
- status (VARCHAR)
- created_at (TIMESTAMP)
```

### tickets table:
```sql
- id (SERIAL)
- order_id (VARCHAR)
- ticket_code (VARCHAR) -- The full ticket ID
- qr_code (TEXT)
- status (VARCHAR)
- issued_at (TIMESTAMP)
```

## Admin Panel Features

### Registration Management:
- View all registrations with member ID and quantity
- Filter by status, date, member ID
- Export registration data
- Monitor payment status

### Ticket Management:
- View all individual tickets
- Track email delivery status
- Monitor QR code generation
- Check ticket usage at event

### Multiple Tickets Display:
- Shows total quantity per order
- Individual ticket tracking
- Batch email status
- Group ticket management

## Email System

### Single Ticket (Qty = 1):
- Standard ticket email template
- One QR code attachment
- Individual ticket instructions

### Multiple Tickets (Qty > 1):
- Enhanced email template
- Order summary section
- Multiple QR codes in single email
- Group ticket instructions
- Clear numbering (Ticket 1 of 3, etc.)

## Usage Examples

### User Buys 1 Ticket:
```
Registration: member_id=123456, ticket_quantity=1
Generated: 1 ticket with unique ID
Email: Single ticket template
Admin View: Qty=1, 1 ticket record
```

### User Buys 5 Tickets:
```
Registration: member_id=789012, ticket_quantity=5
Generated: 5 tickets with unique IDs
Email: Multiple tickets template with all 5 QR codes
Admin View: Qty=5, 5 ticket records
```

## Production Notes

### Performance:
- Each ticket is individual database record
- QR codes generated on-demand
- Email batching for multiple tickets
- Efficient database queries

### Scalability:
- Supports unlimited ticket quantity
- Individual ticket tracking
- Proper indexing on member_id
- Optimized for event check-in

### Security:
- Unique ticket IDs prevent duplication
- QR codes contain full ticket information
- Member ID validation (6+ digits)
- Secure ticket verification system
