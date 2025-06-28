# 🚀 Setup API Supabase untuk Geo-Tagging

Panduan lengkap untuk setup dan deploy API Supabase Edge Functions untuk aplikasi Geo-Tagging.

## 🎯 Tujuan

Membuat API endpoints menggunakan Supabase Edge Functions untuk:

- Mengambil data foto geo-tagging
- Filtering dan pagination data
- Akses data via REST API

## ✅ Prerequisites

- Project Supabase sudah dibuat
- Database table `usaha_foto` sudah setup
- Supabase CLI sudah terinstall
- Node.js dan npm/yarn

## 🛠 Setup Langkah-Demi-Langkah

### 1. Install Supabase CLI

```bash
# Install Supabase CLI global
npm install -g @supabase/supabase-js

# Verifikasi instalasi
npx supabase --version
```

### 2. Login ke Supabase

```bash
npx supabase login
```

Akan membuka browser untuk authentication ke akun Supabase Anda.

### 3. Link Project ke Local

```bash
# Dapatkan project ref dari dashboard Supabase
# Project ref ada di Settings > General > Reference ID

npx supabase link --project-ref "link-project"
```

**Cara dapatkan Project Reference ID:**

1. Buka [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Settings > General > Reference ID

### 4. Deploy Edge Functions

```bash
# Deploy semua functions sekaligus
supabase functions deploy

# Atau deploy satu per satu
supabase functions deploy api
supabase functions deploy get-data
```

### 5. Matikan Enforce JWT Verification (Penting!)

Agar API bisa diakses tanpa header authentication:

1. Buka [Dashboard Supabase](https://supabase.com/dashboard)
2. Pilih project Anda
3. Masuk ke **Settings** > **API**
4. Scroll ke bawah ke bagian **"JWT Settings"**
5. **Matikan/Disable** toggle **"Enforce JWT on server-side"**
6. Klik **Save**

![JWT Settings](https://i.imgur.com/example.png)

**Kenapa perlu dimatikan?**

- Edge Functions default memerlukan JWT token di header
- Dengan mematikan ini, API bisa diakses publik tanpa authentication
- Cocok untuk API yang tidak memerlukan user authentication

**Alternative (jika ingin tetap secure):**

```javascript
// Jika tetap ingin pakai JWT, tambahkan header:
fetch("your-api-url", {
  headers: {
    Authorization: `Bearer ${supabaseAnonKey}`,
    apikey: supabaseAnonKey,
  },
});
```

### 6. Test API Endpoints

Setelah deploy berhasil, test API:

```bash
# Test endpoint utama
curl https://your-project-id.supabase.co/functions/v1/api

# Test dengan parameter
curl "https://your-project-id.supabase.co/functions/v1/api?limit=5&offset=0"
```

## 📋 API Endpoints yang Tersedia

### 1. Main API Endpoint (`/api`)

**URL:** `https://your-project-id.supabase.co/functions/v1/api`

**Method:** GET

**Parameters:**

- `limit` (number): Jumlah data (default: 10)
- `offset` (number): Offset pagination (default: 0)
- `nama_usaha` (string): Filter nama usaha

**Response:**

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 50,
    "has_more": true
  },
  "data": [...]
}
```

### 2. Simple Data Endpoint (`/get-data`)

**URL:** `https://your-project-id.supabase.co/functions/v1/api`

**Method:** GET

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

## 🔧 Struktur Data Response

```json
{
  "id": "uuid",
  "nama_penginput": "John Doe",
  "nama_usaha": "Warung Makan Enak",
  "timestamp": "2024-01-01T10:00:00Z",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "photo_url": "https://supabase.co/storage/v1/object/public/fotos/image.jpg",
  "created_at": "2024-01-01T10:00:00Z"
}
```

## 💻 Contoh Penggunaan

### JavaScript/TypeScript

```javascript
// Fetch basic data
const response = await fetch(
  "https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api"
);
const data = await response.json();

// Dengan pagination
const paginated = await fetch(
  "https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api?limit=20&offset=0"
);

// Dengan filter
const filtered = await fetch(
  "https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api?nama_usaha=warung"
);
```

### cURL

```bash
# Basic request
curl https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api

# Dengan pagination
curl "https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api?limit=5&offset=10"

# Dengan filter nama usaha
curl "https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api?nama_usaha=warung"
```

### Python

```python
import requests

# Basic request
response = requests.get('https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api')
data = response.json()

# Dengan parameter
params = {'limit': 20, 'offset': 0, 'nama_usaha': 'warung'}
response = requests.get(
    'https://bcmoybjzgpgoxlepqgve.supabase.co/functions/v1/api',
    params=params
)
```

## 🛠 Troubleshooting

### Error: "Authentication required"

```bash
supabase login
```

### Error: "Project not linked"

```bash
supabase link --project-ref your-project-id
```

### Error: "Functions not deployed"

```bash
# Deploy ulang
supabase functions deploy
```

### Error: "CORS issues"

Edge Functions sudah dikonfigurasi CORS, tapi jika masih ada masalah:

- Pastikan menggunakan HTTPS
- Check headers yang dikirim

### Error: "Database connection failed"

```bash
# Set ulang secrets
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## 📊 Commands Cheat Sheet

```bash
# Setup
supabase login
supabase link --project-ref your-project-id

# Environment
supabase secrets set KEY=value
supabase secrets list

# Deploy
supabase functions deploy
supabase functions deploy api

# Monitor
supabase functions list
supabase logs --tail
```

## 🔒 Security & Best Practices

1. \*\*Gun
