import { supabase } from "../../../lib/supabase";

export async function GET(request: Request, { id }: { id: string }) {
  try {
    // Validasi ID format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid ID format. Must be a valid UUID.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Query data berdasarkan ID
    const { data, error } = await supabase
      .from("usaha_foto")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // Jika data tidak ditemukan
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data not found",
            id: id,
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

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
