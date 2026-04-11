import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables not configured");
    // Return a mock client that will fail gracefully
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error("Supabase not configured") }),
        signUp: async () => ({ error: new Error("Supabase not configured"), data: { user: null } }),
        signInWithOAuth: async () => ({ error: new Error("Supabase not configured"), data: { url: null } }),
        signOut: async () => ({ error: null }),
        exchangeCodeForSession: async () => ({ error: new Error("Supabase not configured") }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error("Supabase not configured") }) }) }),
      }),
    } as any;
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
