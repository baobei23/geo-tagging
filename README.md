# 📸 Aplikasi Geo-Tagging Usaha

Aplikasi React Native berbasis Expo untuk mengambil foto usaha dengan metadata lokasi dan menyimpannya ke Supabase.

## ✨ Fitur Utama

- 📷 **Kamera**: Ambil foto menggunakan kamera device
- 📍 **Geo-Tagging**: Otomatis menangkap koordinat lokasi saat foto diambil
- 📝 **Form Input**: Input nama penginput dan nama usaha
- ☁️ **Cloud Storage**: Upload foto ke Supabase Storage
- 💾 **Database**: Simpan metadata ke Supabase Database
- 📱 **Galeri**: Lihat daftar foto yang sudah diupload
- 🗺️ **Maps Integration**: Buka lokasi foto di Google Maps

## 🚀 Quick Start

### 1. Setup Supabase

Ikuti panduan lengkap di file `SETUP_SUPABASE.md`

**Ringkasan:**

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan SQL untuk membuat table `usaha_foto`
3. Buat storage bucket bernama `fotos`
4. Setup policies untuk database dan storage
5. Copy Project URL dan Anon Key

### 2. Konfigurasi Aplikasi

**Opsi A: Environment Variables (Recommended)**

```bash
cp .env.example .env
# Edit .env dan isi dengan credentials Supabase Anda
```

### 3. Install Dependencies

```bash
npm install
```

Dependencies sudah include:

- `expo-camera` - Akses kamera
- `expo-location` - Geo-location
- `@supabase/supabase-js` - Supabase client
- `expo-media-library` - Simpan foto ke galeri

### 4. Jalankan Aplikasi

```bash
npx expo start
```

Pilih platform:

- `i` - iOS Simulator
- `a` - Android Emulator
- `w` - Web Browser
- Scan QR code - Physical device

## 📱 Cara Penggunaan

### Tab Kamera

1. Buka aplikasi → Kamera otomatis aktif
2. Tekan tombol kamera untuk ambil foto
3. Form input akan muncul
4. Isi "Nama Penginput" dan "Nama Usaha"
5. Tekan "Simpan"
6. Foto dan data tersimpan ke Supabase + galeri device

### Tab Galeri

1. Lihat semua foto yang sudah diupload
2. Pull-to-refresh untuk update data
3. Tap koordinat untuk buka lokasi di Google Maps
4. Scroll untuk lihat foto lebih lama

## 🛠 Teknologi yang Digunakan

- **Framework**: React Native + Expo
- **Backend**: Supabase (Database + Storage)
- **Camera**: Expo Camera API
- **Location**: Expo Location API
- **Navigation**: Expo Router (tabs)
- **Language**: TypeScript

## 📊 Database Schema

```sql
Table: usaha_foto
┌─────────────────┬─────────────┬─────────────────────────┐
│ Column          │ Type        │ Description             │
├─────────────────┼─────────────┼─────────────────────────┤
│ id              │ UUID        │ Primary key (auto)      │
│ nama_penginput  │ TEXT        │ Nama user               │
│ nama_usaha      │ TEXT        │ Nama bisnis             │
│ timestamp       │ TIMESTAMPTZ │ Waktu foto diambil      │
│ latitude        │ FLOAT8      │ Koordinat latitude      │
│ longitude       │ FLOAT8      │ Koordinat longitude     │
│ photo_url       │ TEXT        │ URL foto di storage     │
│ created_at      │ TIMESTAMPTZ │ Auto timestamp          │
└─────────────────┴─────────────┴─────────────────────────┘
```

## 🔧 Development

### Project Structure

```
geo-tagging/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Tab Kamera
│   │   └── explore.tsx        # Tab Galeri
│   └── _layout.tsx
├── components/
│   └── CameraScreen.tsx       # Komponen utama kamera
├── lib/
│   └── supabase.ts           # Konfigurasi Supabase
├── app.json                  # Permissions & config
└── SETUP_SUPABASE.md        # Panduan setup Supabase
```

### Permissions (sudah dikonfigurasi)

- ✅ Camera access
- ✅ Location access
- ✅ Media library access

### Testing

Untuk test fitur kamera dan lokasi, gunakan **physical device** karena simulator/emulator tidak memiliki kamera.

## 🐛 Troubleshooting

### "Camera permission denied"

- Pastikan izin kamera sudah diberikan di settings device
- Restart aplikasi setelah memberikan permission

### "Location not available"

- Pastikan GPS/Location Services aktif
- Test di outdoor untuk signal GPS yang lebih baik
- Pastikan permission lokasi sudah granted

### "Failed to upload to Supabase"

- Cek koneksi internet
- Verifikasi credentials Supabase di `lib/supabase.ts`
- Pastikan Storage bucket dan policies sudah setup

### "Table doesn't exist"

- Jalankan SQL query setup table di Supabase
- Pastikan nama table `usaha_foto` (underscore, bukan dash)

## 📞 Support

Jika mengalami masalah:

1. Baca file `SETUP_SUPABASE.md` untuk setup lengkap
2. Cek console log di Expo untuk error details
3. Verifikasi setup Supabase di dashboard
4. Test permissions di device settings

## 🚀 Next Steps (Optional)

Fitur yang bisa ditambahkan:

- Authentication user
- Edit/delete foto
- Filter dan search
- Export data ke Excel
- Offline mode dengan sync
- Multiple photo capture
- Photo compression
- Dark mode

---
