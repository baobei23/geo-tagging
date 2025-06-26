import { supabase } from "../../lib/supabase";

export async function GET(request: Request) {
  try {
    // Query semua data dari tabel usaha_foto
    const { data, error } = await supabase
      .from("usaha_foto")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Return data sebagai JSON
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        total: data?.length || 0,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
