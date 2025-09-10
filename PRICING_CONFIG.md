# Pricing Configuration Guide

## Overview
Harga tiket dalam aplikasi ini telah dikonfigurasi untuk mudah diubah tanpa perlu mengubah kode di banyak tempat.

## File Konfigurasi
File utama untuk mengatur harga: `src/config/pricing.ts`

## Current Strategy
**Sandbox Testing**: Menggunakan harga early bird sebenarnya (Rp 250.000) untuk testing yang realistis dengan DOKU sandbox environment.

## Cara Mengubah Harga

### 1. Current - Sandbox Testing (Realistic Price)
```typescript
export const PRICING_CONFIG = {
  TICKET_PRICE: 250000, // IDR 250,000 - Early bird price for sandbox testing
  PRICE_LABEL: "Early Bird Price",
  // ...
};
```

### 2. Production - Early Bird (Same Price)
```typescript
export const PRICING_CONFIG = {
  TICKET_PRICE: 250000, // IDR 250,000 - Real early bird price
  PRICE_LABEL: "Early Bird Price",
  // ...
};
```

### 3. Production - Regular Price (After Early Bird Period)
```typescript
export const PRICING_CONFIG = {
  TICKET_PRICE: 350000, // IDR 350,000 regular price
  PRICE_LABEL: "Regular Price",
  PROMOTIONAL_TEXT: "*Early bird period has ended",
  // ...
};
```

### 4. Production - Last Minute Price
```typescript
export const PRICING_CONFIG = {
  TICKET_PRICE: 400000, // IDR 400,000 last minute price
  PRICE_LABEL: "Last Minute Price",
  PROMOTIONAL_TEXT: "*Limited seats available",
  // ...
};
```

## File yang Terpengaruh
Ketika mengubah `src/config/pricing.ts`, file-file berikut akan otomatis menggunakan harga baru:

1. `src/app/register/page.tsx` - Form registrasi dan display harga
2. `src/app/api/payment/route.ts` - Payment processing
3. Semua perhitungan total amount otomatis terupdate

## Validasi
- Minimum quantity: Diatur di `PRICING_CONFIG.MIN_QUANTITY`
- Maximum quantity: Tidak ada batas (sesuai permintaan user)

## Format Currency
- Locale: Indonesian (id-ID)
- Currency: IDR
- Format: Rp 10.000 (dengan titik sebagai thousand separator)

## Testing Strategy
**Sandbox Environment**: Menggunakan harga early bird sebenarnya (Rp 250.000) untuk:
- Testing pembayaran DOKU sandbox yang realistis
- Memastikan flow pembayaran berjalan dengan baik
- User experience yang sama dengan production

**Production Environment**: Tinggal ubah environment variables DOKU dari sandbox ke production, harga tetap sama.

## Production Deployment
Untuk migrasi ke production:
1. **Environment**: Ubah DOKU API dari sandbox ke production
2. **Database**: Migrate existing data atau mulai fresh
3. **Pricing**: Harga sudah sesuai (Rp 250.000 early bird)
4. **Monitoring**: Monitor payment success rate

## Future Price Changes
Ketika ingin mengubah harga (misal setelah periode early bird):
1. Edit `TICKET_PRICE` di `src/config/pricing.ts`
2. Update `PRICE_LABEL` dan `PROMOTIONAL_TEXT` sesuai periode
3. Deploy aplikasi - semua harga otomatis terupdate
