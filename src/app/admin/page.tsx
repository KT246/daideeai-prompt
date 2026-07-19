import { redirect } from "next/navigation";
import { AdminPromptList, type AdminPrompt } from "@/components/admin-prompt-list";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) return <div className="mx-auto max-w-6xl px-4 py-10"><Card className="p-6">Supabase is not configured.</Card></div>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: allowed } = await supabase.rpc("is_admin");
  if (!allowed) redirect("/");
  const { data } = await supabase.from("prompts").select("id,slug,title,description,category,technologies,use_case,instructions,content,access,status,copy_count,created_at").order("updated_at", { ascending: false });
  return <div className="mx-auto max-w-7xl px-4 py-10"><p className="text-sm font-semibold text-violet-600 dark:text-violet-300">ADMIN</p><h1 className="mt-2 text-3xl font-bold">Prompt management</h1><p className="mt-2 text-[var(--muted)]">Create and publish the only prompts shown to visitors.</p><div className="mt-7"><AdminPromptList initialPrompts={(data ?? []) as AdminPrompt[]} /></div></div>;
}
