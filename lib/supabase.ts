import { createClient } from "@supabase/supabase-js";

// Konfigurasi Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in .env file");
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

// Helper function untuk upload foto
export const uploadPhotoToStorage = async (
  photoUri: string,
  fileName: string
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Konversi URI ke blob
    const response = await fetch(photoUri);
    const blob = await response.blob();

    // Upload ke Supabase storage
    const { data, error } = await supabase.storage
      .from("fotos")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Dapatkan public URL
    const { data: urlData } = supabase.storage
      .from("fotos")
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : "Upload gagal",
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
