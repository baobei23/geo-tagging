# 📡 API Documentation - Geo-Tagging Database

API sederhana untuk mengakses data dari database Supabase menggunakan REST endpoints.

## 🚀 Base URL

Ketika aplikasi berjalan:

- **Development**: `http://localhost:8081/api` (atau port yang digunakan Expo)
- **Production**: `https://your-app-domain.com/api`

## 📋 Available Endpoints

### 1. Get All Data

**GET** `/api/data`

Mengembalikan semua data dari tabel `usaha_foto` diurutkan berdasarkan timestamp terbaru.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "nama_penginput": "John Doe",
      "nama_usaha": "Warung Makan Sederhana",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "latitude": -6.2,
      "longitude": 106.816666,
      "photo_url": "https://your-project.supabase.co/storage/v1/object/public/fotos/filename.jpg",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

### 2. Get Data by ID

**GET** `/api/data/{id}`

Mengembalikan data spesifik berdasarkan ID (UUID).

**Parameters:**

- `id` (string): UUID dari data yang ingin diambil

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "nama_penginput": "John Doe",
    "nama_usaha": "Warung Makan Sederhana",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "latitude": -6.2,
    "longitude": 106.816666,
    "photo_url": "https://your-project.supabase.co/storage/v1/object/public/fotos/filename.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

**Response (Not Found):**

```json
{
  "success": false,
  "error": "Data not found",
  "id": "invalid-uuid"
}
```

### 3. Get Statistics

**GET** `/api/stats`

Mengembalikan statistik dasar dari database.

**Response:**

```json
{
  "success": true,
  "stats": {
    "total_entries": 25,
    "recent_entries_7days": 5,
    "top_contributors": [
      {
        "nama_penginput": "John Doe",
        "total_entries": 8
      },
      {
        "nama_penginput": "Jane Smith",
        "total_entries": 6
      }
    ],
    "last_updated": "2024-01-15T12:00:00.000Z"
  },
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

## 🔧 Error Responses

Semua endpoint mengembalikan error dalam format standar:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information (optional)"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing API

### Using curl:

```bash
# Get all data
curl -X GET "http://localhost:8081/api/data"

# Get specific data
curl -X GET "http://localhost:8081/api/data/your-uuid-here"

# Get statistics
curl -X GET "http://localhost:8081/api/stats"
```

### Using Browser:

Buka browser dan kunjungi:

- `http://localhost:8081/api/data`
- `http://localhost:8081/api/stats`

### Using Postman/Insomnia:

Import collection dengan endpoints di atas untuk testing yang lebih mudah.

## 📊 Data Schema

```typescript
interface UsahaFoto {
  id: string; // UUID primary key
  nama_penginput: string; // Nama user yang input
  nama_usaha: string; // Nama bisnis/usaha
  timestamp: string; // ISO timestamp kapan foto diambil
  latitude: number; // Koordinat latitude
  longitude: number; // Koordinat longitude
  photo_url: string; // URL foto di Supabase Storage
  created_at: string; // ISO timestamp kapan record dibuat
}
```

## 🔒 Security Notes

- API ini menggunakan Supabase RLS (Row Level Security)
- Pastikan environment variables Supabase sudah dikonfigurasi dengan benar
- Untuk production, pertimbangkan menambahkan authentication/rate limiting

## 🚀 Running the API

1. Start aplikasi Expo:

   ```bash
   npx expo start
   ```

2. API akan tersedia di port yang sama dengan aplikasi Expo

3. Test endpoint menggunakan tools seperti curl, Postman, atau browser

## 📝 Notes

- API ini adalah MVP (Minimum Viable Product) untuk demonstrasi
- Data dikembalikan dalam format JSON standar
- Semua endpoint bersifat read-only (GET only)
- Error handling sudah diimplementasikan untuk kasus umum
