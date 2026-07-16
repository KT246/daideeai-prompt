"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n-provider";

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  async function login() {
    if (!isSupabaseConfigured) { toast.error(t("login.missingConfig")); return; }
    setLoading(true); const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/account/history` } });
    if (error) { toast.error(t("login.failed")); setLoading(false); }
  }
  return <Button size="lg" disabled={loading} onClick={login}><LogIn className="size-4" />{loading ? t("login.redirecting") : t("login.google")}</Button>;
}
