# 🚀 Supabase Edge Functions API

## Edge Functions yang Tersedia

### 1. `/api` - Main API Endpoint

API utama untuk mengambil data dari database geo-tagging.

#### Endpoint

```
GET /api
```

#### Parameters (Optional)

- `limit` (number): Jumlah data yang dikembalikan (default: 10)
- `offset` (number): Offset untuk pagination (default: 0)
- `nama_usaha` (string): Filter berdasarkan nama usaha (case-insensitive)

#### Response Format

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
  "filters": {
    "nama_usaha": null
  },
  "data": [
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
  ]
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Gagal mengambil data dari database",
  "error": "Error message"
}
```

### 2. `/get-data` - Simple Data Endpoint

API sederhana untuk mengambil semua data tanpa filter.

#### Endpoint

```
GET /get-data
```

#### Response Format

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "count": 10,
  "data": [...]
}
```

## 🔧 Deploy Edge Functions

### 1. Install Supabase CLI

```bash
npm install @supabase/supabase-js
```

### 2. Login ke Supabase

```bash
npx supabase login
```

### 3. Link Project

```bash
npx supabase link --project-ref YOUR_PROJECT_ID
```

### 4. Deploy Functions

```bash
# Deploy semua functions
npx supabase functions deploy

# Deploy function tertentu
npx supabase functions deploy api
npx supabase functions deploy get-data
```

## 🌐 Usage Examples

### JavaScript/TypeScript

```javascript
// Ambil data dengan pagination
const response = await fetch(
  "https://your-project-id.supabase.co/functions/v1/api?limit=5&offset=0"
);
const result = await response.json();

// Filter berdasarkan nama usaha
const filtered = await fetch(
  "https://your-project-id.supabase.co/functions/v1/api?nama_usaha=warung"
);
const filteredResult = await filtered.json();
```

### cURL

```bash
# Ambil data basic
curl https://your-project-id.supabase.co/functions/v1/api

# Dengan pagination
curl "https://your-project-id.supabase.co/functions/v1/api?limit=20&offset=0"

# Dengan filter
curl "https://your-project-id.supabase.co/functions/v1/api?nama_usaha=warung&limit=10"
```

## 🔒 Security Notes

- Functions menggunakan `SUPABASE_SERVICE_ROLE_KEY` untuk akses database
- CORS telah dikonfigurasi untuk akses dari browser
- Data dikembalikan sesuai dengan RLS policies yang sudah diatur

## 📊 Performance Tips

1. Gunakan pagination dengan `limit` dan `offset`
2. Filter data dengan parameter yang tersedia
3. Monitor usage di Supabase dashboard
