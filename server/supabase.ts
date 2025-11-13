import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

export async function initializeSupabase() {
  try {
    const client = getSupabaseClient();
    
    // Test connection
    const { data, error } = await client.from("config").select("*").limit(1);
    
    if (error) {
      console.warn("[Supabase] Connection test failed:", error.message);
      return false;
    }
    
    console.log("[Supabase] Connected successfully");
    return true;
  } catch (error) {
    console.error("[Supabase] Initialization failed:", error);
    return false;
  }
}
