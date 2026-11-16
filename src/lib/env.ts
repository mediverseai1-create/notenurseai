export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
export const aiConfigured = Boolean(process.env.GEMINI_API_KEY);
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
