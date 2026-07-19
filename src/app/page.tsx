import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPrompts } from "@/lib/prompts";
import { getServerTranslator } from "@/i18n/server";

export default async function HomePage() {
  const { t } = await getServerTranslator();
  const { prompts } = await getPrompts({ sort: "newest" });
  return <div className="motion-page"><section className="border-b bg-[radial-gradient(circle_at_top,rgba(124,92,246,.2),transparent_45%)]"><div className="mx-auto max-w-7xl px-4 py-20 text-center md:py-28"><div className="motion-hero mx-auto max-w-3xl"><p className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-violet-600 dark:text-violet-300"><Sparkles className="size-4" />{t("home.eyebrow")}</p><h1 className="text-4xl font-bold tracking-tight md:text-6xl">{t("home.title")}</h1><p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">{t("home.description")}</p><div className="mt-8"><Button size="lg" asChild><Link href="/prompts">{t("home.explore")} <ArrowRight className="size-4" /></Link></Button></div></div></div></section><section className="mx-auto max-w-7xl px-4 py-16"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{t("library.eyebrow")}</p><h2 className="mt-2 text-3xl font-bold">{t("home.popular")}</h2></div><Link className="motion-link text-sm font-semibold text-violet-600 dark:text-violet-300" href="/prompts">{t("home.viewAll")}</Link></div>{prompts.length > 0 ? <div className="motion-stagger mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{prompts.slice(0, 6).map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}</div> : <Card className="motion-empty mt-7 p-8 text-center text-sm text-[var(--muted)]">{t("home.emptyPrompts")}</Card>}</section></div>;
}
