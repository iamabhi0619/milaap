import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if Supabase connection is properly configured and working
 * @returns Promise with connection status and details
 */
export async function checkSupabaseConnection() {
  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        connected: false,
        error: "Missing Supabase environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!supabaseAnonKey,
        },
      };
    }

    // Test the connection by making a simple query
    const { error } = await supabase.from("_healthcheck").select("*").limit(1);

    // If table doesn't exist, try auth endpoint instead
    if (error?.code === "42P01") {
      // Table not found - try auth endpoint
      const { error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        return {
          connected: false,
          error: "Failed to connect to Supabase",
          details: authError,
        };
      }

      return {
        connected: true,
        message: "Supabase connection successful",
        details: {
          url: supabaseUrl,
          authReachable: true,
        },
      };
    }

    if (error) {
      return {
        connected: false,
        error: "Supabase query failed",
        details: error,
      };
    }

    return {
      connected: true,
      message: "Supabase connection successful",
      details: {
        url: supabaseUrl,
      },
    };
  } catch (error) {
    return {
      connected: false,
      error: "Failed to connect to Supabase",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Simple connection test - throws error if connection fails
 */
export async function testSupabaseConnection(): Promise<boolean> {
  const result = await checkSupabaseConnection();
  if (!result.connected) {
    console.error("Supabase connection failed:", result.error, result.details);
    return false;
  }
  console.log("✅ Supabase connected successfully");
  return true;
}
