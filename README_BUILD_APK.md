# 📱 Panduan Build APK Preview Android

Panduan singkat untuk membuat APK preview aplikasi Geo-Tagging menggunakan EAS Build dari Expo.

## 🎯 Tujuan

Membuat file APK Android yang bisa langsung di-install untuk testing **tanpa** perlu Android Studio.

## ✅ Prerequisites

- Node.js sudah terinstall
- Proyek Expo sudah berjalan (`npx expo start`)
- Koneksi internet stabil
- Akun Expo (gratis)

## 🚀 Langkah-Langkah

### 1. Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

Verifikasi instalasi:

```bash
eas --version
```

### 2. Login ke Expo

```bash
eas login
```

Jika belum punya akun:

- Daftar di [expo.dev](https://expo.dev)
- Atau buat lewat CLI: `eas register`

### 3. Konfigurasi EAS Build

```bash
eas build:configure
```

Perintah ini akan membuat file `eas.json` dengan konfigurasi build.

### 4. Set Environment Variables

Setting environment variables untuk Supabase di EAS Cloud:

```bash
# Set Supabase URL
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project-id.supabase.co"

# Set Supabase Anon Key
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key-here"
```

**Verifikasi environment variables:**

```bash
eas env:list
```

### 5. Build APK Preview

```bash
eas build --platform android --profile preview
```

### 6. Tunggu dan Download

- Proses build berjalan di cloud (~15-30 menit)
- Setelah selesai, link download APK akan muncul
- Download APK dan install ke device Android

## 🔧 Build Profiles

### Preview Profile (Untuk Testing)

- ✅ Generate APK file
- ✅ Bisa install langsung ke HP
- ✅ Cocok untuk testing/demo
- ❌ Tidak bisa upload ke Play Store

### Production Profile (Untuk Production)

- ✅ Generate AAB file
- ✅ Bisa upload ke Play Store
- ❌ Tidak bisa install langsung

## 🛠 Troubleshooting

### Environment Variables Tidak Diset

Jika aplikasi tidak bisa connect ke Supabase:

```bash
# Cek apakah env vars sudah diset
eas env:list

# Jika belum ada, set dengan:
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url"
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
```

### Build Gagal - Missing Permissions

Pastikan `app.json` memiliki permissions yang diperlukan:

```json
"android": {
  "permissions": [
    "android.permission.CAMERA",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE"
  ]
}
```

### Build Stuck/Lambat

- Build di cloud bisa memakan waktu 15-30 menit
- Cek status di: https://expo.dev/builds
- Cancel dan ulangi jika stuck >1 jam

### APK Tidak Bisa Install

- Pastikan "Install from Unknown Sources" sudah diaktifkan
- APK dari preview profile sudah di-sign otomatis oleh Expo

## 📊 Commands Cheat Sheet

```bash
# Setup initial
eas build:configure

# Set environment variables
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url"
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
eas env:list

# Build APK untuk testing
eas build --platform android --profile preview

# Cek status build
eas build:list

# Cancel build yang sedang jalan
eas build:cancel [build-id]

# Login ulang jika ada masalah auth
eas login

# Update EAS CLI
npm install -g @expo/eas-cli@latest
```

## 💡 Tips

1. **Gunakan Preview Profile** untuk testing harian
2. **Test di device fisik** untuk hasil yang akurat
3. **Build ulang** jika ada perubahan kode atau dependencies
4. **Simpan link download** untuk sharing ke tim
5. **Monitor build progress** di dashboard Expo

## 🔗 Links Berguna

- [Expo Dashboard](https://expo.dev/builds) - Monitor build progress
- [EAS Build Docs](https://docs.expo.dev/build/introduction/) - Dokumentasi lengkap
- [Expo Status](https://status.expo.dev/) - Cek status layanan Expo

---

**Catatan:** Setiap kali ada perubahan kode, dependencies, atau konfigurasi, Anda perlu rebuild APK untuk mendapatkan versi terbaru.
