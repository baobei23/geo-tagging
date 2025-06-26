import { supabase } from "../../lib/supabase";

export async function GET(request: Request) {
  try {
    // Query untuk mendapatkan statistik dasar
    const [totalResult, recentResult, topUsersResult] = await Promise.all([
      // Total entries
      supabase.from("usaha_foto").select("*", { count: "exact", head: true }),

      // Data terbaru (7 hari terakhir)
      supabase
        .from("usaha_foto")
        .select("*", { count: "exact", head: true })
        .gte(
          "timestamp",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ),

      // Top users berdasarkan jumlah entry
      supabase.from("usaha_foto").select("nama_penginput"),
    ]);

    if (totalResult.error || recentResult.error || topUsersResult.error) {
      const error =
        totalResult.error || recentResult.error || topUsersResult.error;
      return new Response(
        JSON.stringify({
          success: false,
          error: error?.message || "Error fetching statistics",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Process top users data
    const userCounts: { [key: string]: number } = {};
    topUsersResult.data?.forEach((entry) => {
      userCounts[entry.nama_penginput] =
        (userCounts[entry.nama_penginput] || 0) + 1;
    });

    const topUsers = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nama, count]) => ({ nama_penginput: nama, total_entries: count }));

    // Return statistik sebagai JSON
    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_entries: totalResult.count || 0,
          recent_entries_7days: recentResult.count || 0,
          top_contributors: topUsers,
          last_updated: new Date().toISOString(),
        },
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
