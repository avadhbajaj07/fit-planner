import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

/**
 * Health check helper
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; count?: number }> {
  if (!supabase) {
    return { ok: false, message: "Supabase environment variables not configured." };
  }
  try {
    const { count, error } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true });

    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: "Connected successfully to live Supabase project.", count: count || 0 };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Unknown error connecting to Supabase." };
  }
}
