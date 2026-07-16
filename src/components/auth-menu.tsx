"use client";

import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n-provider";

export function AuthMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const { t } = useI18n();
  useEffect(() => { if (!isSupabaseConfigured) return; const supabase = createClient(); void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)); const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setEmail(session?.user.email ?? null)); return () => listener.subscription.unsubscribe(); }, []);
  if (!email) return <Button asChild size="sm"><Link href="/login"><LogIn className="size-4" />{t("nav.login")}</Link></Button>;
  return <Button asChild variant="secondary" size="sm" title={email}><Link href="/account/history"><UserRound className="size-4" /><span className="hidden sm:inline">{t("nav.account")}</span></Link></Button>;
}
