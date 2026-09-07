# poligami.my

Aplikasi web + Android (Capacitor) untuk pendaftaran, pengesahan e-mel, padanan, chat, dan feed.

## Alur pengguna

1. Daftar akaun (nama, e-mel, telefon)
2. Sahkan e-mel melalui pautan dari `noreply@poligami.my`
3. Maklumat asas, kata laluan, peranan, status perkahwinan, negeri
4. Panduan semak — satu halaman setiap item, buka seksyen, baca, tick, buka seterusnya
5. Muat naik MyKad (depan & belakang)
6. Pergi ke log masuk
7. Sesi kekal — tutup app tanpa log keluar, buka semula terus ke Feed

## Development

```bash
npm install
npm run dev
```

Tanpa Resend, skrin pengesahan menunjukkan **Buka pautan pengesahan** untuk teruskan secara tempatan.

## Deploy

### 1. Supabase

1. Cipta projek di [supabase.com](https://supabase.com)
2. SQL Editor → jalankan `supabase/schema.sql`
3. Settings → API: salin `URL` dan `service_role` key

### 2. Resend

1. Cipta domain `poligami.my` di [resend.com](https://resend.com)
2. Tambah `RESEND_API_KEY`
3. From: `Poligami <noreply@poligami.my>`

### 3. Vercel

Set environment variables:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=Poligami <noreply@poligami.my>
APP_URL=https://poligami.my
VITE_API_URL=https://poligami.my
```

### 4. Android APK

Set `VITE_API_URL` kepada origin Vercel sebelum `npm run build:apk`.
