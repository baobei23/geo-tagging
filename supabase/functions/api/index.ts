// Edge Function untuk API geo-tagging data
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface UsahaFoto {
  id: string;
  nama_penginput: string;
  nama_usaha: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  photo_url: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inisialisasi Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Parse URL parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const namaUsaha = url.searchParams.get('nama_usaha');

    // Build query
    let query = supabase
      .from('usaha_foto')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filter jika ada parameter nama_usaha
    if (namaUsaha) {
      query = query.ilike('nama_usaha', `%${namaUsaha}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Hitung total data untuk pagination
    let countQuery = supabase
      .from('usaha_foto')
      .select('*', { count: 'exact', head: true });

    if (namaUsaha) {
      countQuery = countQuery.ilike('nama_usaha', `%${namaUsaha}%`);
    }

    const { count } = await countQuery;

    // Return response JSON
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data berhasil diambil',
        pagination: {
          limit,
          offset,
          total: count || 0,
          has_more: (offset + limit) < (count || 0)
        },
        filters: {
          nama_usaha: namaUsaha
        },
        data: data as UsahaFoto[]
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Gagal mengambil data dari database',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      }
    );
  }
}); 