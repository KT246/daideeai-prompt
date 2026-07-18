"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function UsernameLoginForm() {
  const [busy, setBusy] = useState(false);
  async function signIn(data: FormData) {
    const username = String(data.get("username") ?? "").trim(); const password = String(data.get("password") ?? "");
    if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) { toast.error("Username không hợp lệ."); return; }
    if (!isSupabaseConfigured) { toast.error("Supabase chưa được cấu hình."); return; }
    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({ email: `${username.toLowerCase()}@bootstrap.daideeai.local`, password });
    setBusy(false);
    if (error) { toast.error("Username hoặc mật khẩu không đúng."); return; }
    window.location.assign("/dashboard");
  }
  return <form action={signIn} className="grid gap-3 text-left"><Input required name="username" autoComplete="username" placeholder="Username" /><Input required name="password" type="password" autoComplete="current-password" placeholder="Mật khẩu" /><Button disabled={busy} type="submit">{busy ? "Đang đăng nhập..." : "Đăng nhập bằng username"}</Button></form>;
}
