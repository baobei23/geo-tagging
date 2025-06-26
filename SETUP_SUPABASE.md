# 🚀 Setup Supabase untuk Aplikasi Geo-Tagging

## 📋 Persiapan Supabase

### 1. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Buat akun atau login
3. Klik "New Project"
4. Isi nama project: `geo-tagging`
5. Pilih region terdekat (Southeast Asia - Singapore)
6. Buat password database yang kuat
7. Tunggu project selesai dibuat (~2 menit)

### 2. Setup Database Table

Buka **SQL Editor** di dashboard Supabase dan jalankan query berikut:

```sql
-- Buat table usaha_foto
CREATE TABLE usaha_foto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_penginput TEXT NOT NULL,
  nama_usaha TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat index untuk performa query
CREATE INDEX idx_usaha_foto_timestamp ON usaha_foto(timestamp);
CREATE INDEX idx_usaha_foto_nama_usaha ON usaha_foto(nama_usaha);

-- Enable Row Level Security (RLS)
ALTER TABLE usaha_foto ENABLE ROW LEVEL SECURITY;

-- Buat policy untuk allow insert/select (untuk development)
CREATE POLICY "Allow all operations" ON usaha_foto
FOR ALL USING (true)
WITH CHECK (true);
```

### 3. Setup Storage Bucket

1. Buka **Storage** di sidebar Supabase
2. Klik "Create bucket"
3. Nama bucket: `fotos`
4. **Pilih "Public bucket"** ✅ (untuk akses langsung)
5. Klik "Create bucket"

### 4. Setup Storage Policy

Di **Storage > fotos > Policies**, buat policy baru:

```sql
-- Policy untuk public bucket (lebih sederhana)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'fotos');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'fotos');

-- Jika ingin semua orang bisa upload (tidak recommended):
-- CREATE POLICY "Public Upload" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'fotos');
```

### 5. Dapatkan Credentials

1. Buka **Settings > API**
2. Copy:
   - **Project URL** (misal: `https://abc123.supabase.co`)
   - **Anon public key** (key yang panjang)

### 6. Konfigurasi Credentials Aplikasi

Ada 2 cara untuk mengkonfigurasi credentials Supabase:

#### **Opsi A: Environment Variables (Recommended)**

1. Copy file `.env.example` ke `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` dan isi dengan credentials Anda:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### **Opsi B: Edit Langsung di Code**

Edit file `lib/supabase.ts` dan ganti fallback values:

```typescript
const supabaseUrl = getEnvVar(
  "EXPO_PUBLIC_SUPABASE_URL",
  "https://YOUR_PROJECT_ID.supabase.co" // <- Ganti ini
);

const supabaseAnonKey = getEnvVar(
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "YOUR_ANON_KEY_HERE" // <- Ganti ini
);
```

**💡 Tip:** Environment variables lebih aman karena credentials tidak ter-commit ke git.

## 🔧 Development Setup

### Install Dependencies

```bash
npm install expo-camera expo-location @supabase/supabase-js expo-media-library
```

### Update Permissions (sudah dikonfigurasi di app.json)

✅ Camera permission
✅ Location permission  
✅ Media library permission

## 🎯 Testing

### 1. Jalankan Aplikasi

```bash
npx expo start
```

### 2. Test Flow

1. Buka aplikasi → Kamera muncul
2. Ambil foto → Form input muncul
3. Isi "Nama Penginput" dan "Nama Usaha"
4. Klik "Simpan" → Data tersimpan

### 3. Verifikasi Data

**Database:**

- Buka **Table Editor > usaha_foto**
- Data baru harus muncul dengan semua field terisi

**Storage:**

- Buka **Storage > fotos**
- File foto baru harus tersimpan

## 🛠 Troubleshooting

### Error "Invalid API key"

- Pastikan `supabaseUrl` dan `supabaseAnonKey` benar
- Pastikan tidak ada trailing spaces

### Error "Table doesn't exist"

- Jalankan ulang SQL query pembuatan table
- Pastikan nama table `usaha_foto` (dengan underscore)

### Error "Storage bucket doesn't exist"

- Pastikan bucket bernama `fotos` sudah dibuat
- Pastikan policy storage sudah dikonfigurasi

### Error Permission Denied

- Pastikan RLS policy sudah dibuat
- Untuk development, gunakan policy yang permissive

### Foto tidak tersimpan ke galeri

- Pastikan permission media library sudah granted
- Test di device fisik, bukan simulator

## 📊 Database Schema

```sql
Table: usaha_foto
┌─────────────────┬─────────────┬─────────────┐
│ Column          │ Type        │ Description │
├─────────────────┼─────────────┼─────────────┤
│ id              │ UUID        │ Primary key │
│ nama_penginput  │ TEXT        │ Nama user   │
│ nama_usaha      │ TEXT        │ Nama bisnis │
│ timestamp       │ TIMESTAMPTZ │ Waktu foto  │
│ latitude        │ FLOAT8      │ Koordinat   │
│ longitude       │ FLOAT8      │ Koordinat   │
│ photo_url       │ TEXT        │ URL foto    │
│ created_at      │ TIMESTAMPTZ │ Auto        │
└─────────────────┴─────────────┴─────────────┘
```

## 🚀 Production Deployment

### 1. Security

- Update RLS policies untuk production
- Gunakan environment variables untuk credentials
- Enable 2FA di akun Supabase

### 2. Performance

- Setup CDN untuk storage
- Optimize image compression
- Add database indexes sesuai kebutuhan

### 3. Monitoring

- Setup logging di Supabase
- Monitor storage usage
- Track API usage

## 📞 Support

Jika ada masalah:

1. Cek console log di Expo
2. Cek logs di Supabase dashboard
3. Verifikasi permissions di device
4. Test di device fisik untuk fitur kamera/lokasi
