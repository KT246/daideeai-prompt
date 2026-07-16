"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export function createClient() {
  if (!url || !key) throw new Error("Thiếu cấu hình Supabase phía client.");
  return createBrowserClient(url, key);
}
