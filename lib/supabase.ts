import { createClient } from "@supabase/supabase-js";

// Validasi environment variables
const getEnvVar = (name: string, fallback?: string): string => {
  const value = process.env[name];
  if (!value && !fallback) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || fallback || "";
};

// Konfigurasi Supabase menggunakan environment variables
const supabaseUrl = getEnvVar(
  "EXPO_PUBLIC_SUPABASE_URL",
  "https://your-project-id.supabase.co"
);

const supabaseAnonKey = getEnvVar(
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "your-anon-key-here"
);

// DEBUG: Console log untuk debugging di build
console.log("🔍 DEBUG Environment Variables:");
console.log("📍 EXPO_PUBLIC_SUPABASE_URL:", supabaseUrl);
console.log("🔑 EXPO_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey?.substring(0, 20) + "...");

// Validasi URL format
if (
  !supabaseUrl.startsWith("https://") ||
  supabaseUrl.includes("your-project-id")
) {
  console.warn("⚠️  Supabase URL belum dikonfigurasi dengan benar!");
  console.warn("📝 Edit lib/supabase.ts atau setup environment variables:");
  console.warn(
    "   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
  );
  console.warn("   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here");
}

// Buat Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipe data untuk tabel usaha_foto
export interface UsahaFoto {
  id?: string;
  nama_penginput: string;
  nama_usaha: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  photo_url: string;
}

// Helper function untuk upload foto dan generate public URL
export const uploadPhotoToStorage = async (
  photoUri: string,
  fileName: string
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Upload foto
    const response = await fetch(photoUri);
    const blob = await response.blob();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from("fotos")
      .getPublicUrl(fileName);

    // Validasi URL
    if (!urlData.publicUrl) {
      return { url: null, error: "Failed to generate public URL" };
    }

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Helper function untuk test koneksi Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("usaha_foto")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Supabase connection test failed:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection error:", error);
    return false;
  }
};
