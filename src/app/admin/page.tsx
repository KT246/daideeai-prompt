import { redirect } from "next/navigation";
import { AdminPromptList } from "@/components/admin-prompt-list";
import { Card } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const { t } = await getServerTranslator();
  const supabase = await createClient();
  if (!supabase) return <div className="mx-auto max-w-6xl px-4 py-10"><Card className="p-6">{t("admin.missingConfig")}</Card></div>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: allowed } = await supabase.rpc("is_admin");
  if (!allowed) redirect("/");
  const { data } = await supabase.from("prompts").select("id,title,status,copy_count,created_at").order("updated_at", { ascending: false });
  return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{t("admin.eyebrow")}</p><h1 className="mt-2 text-3xl font-bold">{t("admin.title")}</h1><p className="mt-2 text-[var(--muted)]">{t("admin.description")}</p><Card className="mt-7 p-3"><AdminPromptList initialPrompts={data ?? []} /></Card></div>;
}
