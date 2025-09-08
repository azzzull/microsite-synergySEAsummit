# Email Service & Payment Callback Fix

## Masalah yang Diperbaiki:

1. **Email tidak terkirim di real case** - Database ticket tidak ter-populate dengan benar
2. **Database ticket schema tidak lengkap** - Kurang kolom participant data
3. **Stuck di success page DOKU** - Callback tidak redirect dengan benar
4. **Email status tidak terupdate** - UpdateTicket tidak handle emailSent field

## Perubahan yang Dibuat:

### 1. Database Schema Update
File: `database-schema-update.sql`
- Menambah kolom participant_name, participant_email, participant_phone
- Menambah kolom event_name, event_date, event_location  
- Menambah kolom email_sent, email_sent_at
- Menambah indexes untuk performa

### 2. Database Functions Update
File: `src/lib/postgresDatabase.ts`
- **createTicket()**: Sekarang menyimpan semua data participant dan event
- **updateTicket()**: Sekarang bisa update emailSent dan emailSentAt

### 3. Payment Callback Fix
File: `src/app/api/payment/callback/route.ts`
- **URL redirect dinamis**: Menggunakan environment variable untuk base URL
- **Production/Development detection**: Auto-detect environment untuk URL yang tepat
- **Better email logging**: Log yang lebih detail untuk debug email issues
- **Error handling**: Better handling untuk email send failures

### 4. Environment Variables
File: `.env.local`
- Menambah `NEXT_PUBLIC_PRODUCTION_URL` untuk production URL
- Base URL configuration yang lebih jelas

## Langkah-langkah Testing:

### 1. Update Database Schema
Jalankan script di Railway PostgreSQL console:
```sql
-- Copy paste isi dari database-schema-update.sql
```

### 2. Restart Development Server
```bash
npm run dev
```

### 3. Test Flow Lengkap:
1. **Registration** → Isi form dan submit
2. **Payment** → Klik payment button, test dengan virtual account
3. **Callback** → Setelah payment success, pastikan auto-redirect ke success page
4. **Email Check** → Check apakah email e-ticket terkirim
5. **Database Check** → Pastikan ticket record lengkap di database

### 4. Check Logs:
- Development console untuk error messages
- Database admin untuk ticket records
- Email inbox untuk e-ticket delivery

## Environment Variables untuk Vercel:

Saat deploy ke Vercel, tambahkan environment variables berikut:
- `NEXT_PUBLIC_PRODUCTION_URL=https://synergy-sea-summit2025.vercel.app`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=[YOUR_GMAIL_EMAIL]`
- `SMTP_PASS=[YOUR_GMAIL_APP_PASSWORD]`
- `SMTP_FROM=[YOUR_GMAIL_EMAIL]`
- Database URLs (Railway PostgreSQL)

**Note**: Ganti `[YOUR_GMAIL_EMAIL]` dan `[YOUR_GMAIL_APP_PASSWORD]` dengan nilai aktual saat deploy ke Vercel.

## Debug Checklist:

Jika masih ada masalah:

1. **Email tidak terkirim**:
   - Check SMTP credentials di Vercel env vars
   - Check logs di development console
   - Test email connection via admin panel

2. **Database ticket kosong**:
   - Pastikan schema sudah diupdate
   - Check logs untuk database errors
   - Verify Railway connection

3. **Redirect tidak working**:
   - Check callback URL di DOKU dashboard
   - Verify environment variables
   - Check logs untuk redirect URL

4. **Production vs Development**:
   - Local: `http://localhost:3000`
   - Production: `https://synergy-sea-summit2025.vercel.app`
   - Callback URL harus sesuai environment
