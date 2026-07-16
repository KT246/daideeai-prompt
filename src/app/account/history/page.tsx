import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const { locale, t } = await getServerTranslator();
  const supabase = await createClient();
  if (!supabase) return <div className="mx-auto max-w-4xl px-4 py-10"><Card className="p-6">{t("account.missingConfig")}</Card></div>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: history } = await supabase.from("copy_logs").select("created_at,prompts(title,slug)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30);
  const { data: favorites } = await supabase.from("favorites").select("created_at,prompts(title,slug)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30);
  const { data: generated } = await supabase.from("generated_prompts").select("id,generator,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30);
  return <div className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-bold">{t("account.title")}</h1><p className="mt-2 text-[var(--muted)]">{user.email}</p><div className="mt-8 grid gap-6 md:grid-cols-3"><Card className="p-5"><h2 className="font-bold">{t("account.created")}</h2><div className="mt-4 grid gap-3">{generated?.length ? generated.map((item) => <p className="rounded-lg border p-3 text-sm" key={item.id}>{item.generator} · {new Date(item.created_at).toLocaleDateString(locale)}</p>) : <p className="text-sm text-[var(--muted)]">{t("account.noCreated")}</p>}</div></Card><Card className="p-5"><h2 className="font-bold">{t("account.copies")}</h2><div className="mt-4 grid gap-3">{history?.length ? history.map((item) => { const prompt = Array.isArray(item.prompts) ? item.prompts[0] : item.prompts; return <Link className="rounded-lg border p-3 text-sm hover:border-violet-400" href={prompt?.slug ? `/prompts/${prompt.slug}` : "/prompts"} key={item.created_at}>{prompt?.title ?? t("account.unavailable")}</Link>; }) : <p className="text-sm text-[var(--muted)]">{t("account.noCopies")}</p>}</div></Card><Card className="p-5"><h2 className="font-bold">{t("account.favorites")}</h2><div className="mt-4 grid gap-3">{favorites?.length ? favorites.map((item) => { const prompt = Array.isArray(item.prompts) ? item.prompts[0] : item.prompts; return <Link className="rounded-lg border p-3 text-sm hover:border-violet-400" href={prompt?.slug ? `/prompts/${prompt.slug}` : "/prompts"} key={item.created_at}>{prompt?.title ?? t("account.unavailable")}</Link>; }) : <p className="text-sm text-[var(--muted)]">{t("account.noFavorites")}</p>}</div></Card></div></div>;
}
