# 📱 Panduan Membuat APK Tanpa Android Studio

## 🎯 Tujuan

Membuat file APK dari proyek React Native/Expo **tanpa** menginstall Android Studio dan **tanpa** publish ke Play Store.

## ✅ Prerequisites

- ✅ Node.js sudah terinstall
- ✅ Proyek Expo/React Native sudah jalan
- ✅ Koneksi internet stabil
- ❌ **TIDAK PERLU** Android Studio
- ❌ **TIDAK PERLU** Android SDK

## 🚀 Metode: EAS Build (Cloud Build)

EAS Build adalah layanan cloud dari Expo yang membantu build APK di server mereka, jadi kita tidak perlu setup environment Android di komputer lokal.

### Keunggulan:

- 🔥 Tidak perlu Android Studio
- ⚡ Build di cloud (tidak beban komputer)
- 🆓 **Gratis** untuk personal project
- 📦 Langsung dapat APK siap install
- 🔒 Signing otomatis

---

## 📋 Step-by-Step Guide

### 1. Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

**Verifikasi instalasi:**

```bash
eas --version
```

### 2. Login ke Expo

```bash
eas login
```

**Jika belum punya akun Expo:**

- Daftar di [expo.dev](https://expo.dev)
- Atau buat akun lewat CLI: `eas register`

### 3. Inisialisasi EAS Build

Di folder proyek, jalankan:

```bash
eas build:configure
```

Perintah ini akan:

- Membuat file `eas.json`
- Setup konfigurasi build untuk Android & iOS

### 4. Konfigurasi Build Profile

Edit file `eas.json` yang baru dibuat:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 5. Build APK

**Untuk APK testing (recommended):**

```bash
eas build --platform android --profile preview
```

**Atau untuk production APK:**

```bash
eas build --platform android --profile production
```

### 6. Monitoring Build

- Build berjalan di cloud (~15-30 menit)
- Anda bisa lihat progress di terminal
- Atau cek di dashboard: [expo.dev/builds](https://expo.dev/builds)

### 7. Download APK

Setelah build selesai:

- Link download APK akan muncul di terminal
- Atau download dari dashboard Expo
- APK siap untuk di-install ke device Android

---

## 🔧 Build Profiles Explained

### **Preview Profile** (Untuk Testing)

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

- ✅ Generate APK file
- ✅ Bisa install langsung ke HP
- ✅ Cocok untuk testing/demo
- ❌ Tidak bisa upload ke Play Store

### **Production Profile** (Untuk Production)

```json
"production": {
  "android": {
    "buildType": "aab"
  }
}
```

- ✅ Generate AAB file (lebih optimal)
- ✅ Bisa upload ke Play Store
- ❌ Tidak bisa install langsung (perlu konversi)

---

## 🛠 Troubleshooting

### Error: "Expo CLI not found"

```bash
npm install -g @expo/eas-cli
# Restart terminal
```

### Error: "Project not configured"

```bash
eas build:configure
```

### Error: "Build failed - Missing permissions"

Pastikan di `app.json` ada permissions:

```json
"android": {
  "permissions": [
    "android.permission.CAMERA",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.READ_EXTERNAL_STORAGE"
  ]
}
```

### Build Stuck/Slow

- Build di cloud bisa 15-30 menit
- Cek status di: https://expo.dev/builds
- Batal dan ulangi jika stuck >1 jam

### APK Tidak Bisa Install

- Enable "Install from Unknown Sources" di Android
- APK dari preview profile sudah di-sign otomatis

---

## 📊 Build Commands Cheat Sheet

```bash
# Build APK untuk testing
eas build --platform android --profile preview

# Build untuk production
eas build --platform android --profile production

# Build untuk iOS (jika perlu)
eas build --platform ios --profile preview

# Cek status build
eas build:list

# Cancel build yang sedang jalan
eas build:cancel [build-id]
```

---

## 💡 Tips & Best Practices

### 1. **Gunakan Preview Profile untuk Testing**

- Lebih cepat build
- APK langsung bisa install
- Cocok untuk demo ke client

### 2. **Optimize Build Time**

- Build hanya platform yang dibutuhkan
- Gunakan cache jika available
- Avoid build unnecessary dependencies

### 3. **Testing APK**

- Test di device fisik, bukan emulator
- Test di berbagai versi Android
- Check permissions saat pertama install

### 4. **Distribusi APK**

- Share link download dari Expo
- Atau download dan share file APK
- Pastikan recipients enable "Unknown Sources"

---

## 🎉 Hasil Akhir

Setelah mengikuti panduan ini, Anda akan mendapat:

1. ✅ **File APK** siap install ke HP Android
2. ✅ **Link download** yang bisa dibagikan
3. ✅ **Build logs** untuk debugging
4. ✅ **Dashboard monitoring** di Expo

**File APK bisa di-install langsung tanpa Play Store!**

---

## 🆘 Need Help?

- 📖 [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- 💬 [Expo Discord Community](https://discord.gg/expo)
- 🐛 [GitHub Issues](https://github.com/expo/expo/issues)

---

## 📝 Notes

- Build pertama mungkin lebih lama (~30-45 menit)
- Build selanjutnya lebih cepat karena cache
- EAS Build gratis untuk personal projects
- APK size biasanya 20-50MB tergantung dependencies
