"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n-provider";

export function UsernameLoginForm() {
  const [busy, setBusy] = useState(false);
  const { t } = useI18n();
  async function signIn(data: FormData) {
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) { toast.error(t("login.invalidUsername")); return; }
    if (!isSupabaseConfigured) { toast.error(t("login.missingConfig")); return; }
    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({ email: `${username.toLowerCase()}@bootstrap.daideeai.local`, password });
    setBusy(false);
    if (error) { toast.error(t("login.invalidCredentials")); return; }
    window.location.assign("/admin");
  }
  return <form action={signIn} className="grid gap-3 text-left"><Input required name="username" autoComplete="username" placeholder={t("login.username")} /><Input required name="password" type="password" autoComplete="current-password" placeholder={t("login.password")} /><Button disabled={busy} type="submit">{busy ? t("login.submitting") : t("login.submit")}</Button></form>;
}
