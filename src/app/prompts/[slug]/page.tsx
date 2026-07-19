import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Copy } from "lucide-react";
import { PromptDetailActions } from "@/components/prompt-detail-actions";
import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
import { getPromptBySlug, getRelatedPrompts } from "@/lib/prompts";
import { categoryLabels, type PromptCategory } from "@/lib/site";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const [prompt, { t }] = await Promise.all([getPromptBySlug((await params).slug), getServerTranslator()]); return { title: prompt?.title ?? t("prompt.complete") }; }
export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { locale, t } = await getServerTranslator();
  const prompt = await getPromptBySlug((await params).slug);
  if (!prompt) notFound();
  const related = await getRelatedPrompts(prompt.category, prompt.id);
  const category = categoryLabels[locale][prompt.category as PromptCategory] ?? prompt.category;
  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"><article><Badge>{category}</Badge><h1 className="mt-4 text-4xl font-bold">{prompt.title}</h1><p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">{prompt.description}</p><div className="mt-6 flex flex-wrap gap-2">{prompt.technologies.map((item) => <Badge key={item}>{item}</Badge>)}</div><div className="mt-6 text-sm text-[var(--muted)]"><span className="flex items-center gap-1"><Copy className="size-4" />{formatNumber(prompt.copyCount, locale)} {t("detail.copies")}</span></div><section className="mt-10 grid gap-6"><div><h2 className="text-xl font-bold">{t("detail.useCase")}</h2><p className="mt-2 whitespace-pre-line text-[var(--muted)]">{prompt.useCase}</p></div><div><h2 className="text-xl font-bold">{t("detail.instructions")}</h2><p className="mt-2 whitespace-pre-line text-[var(--muted)]">{prompt.instructions}</p></div></section></article><aside className="min-w-0"><Card className="mb-4 border-amber-400/50 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">{t("detail.warning")}</Card><PromptDetailActions promptId={prompt.id} content={prompt.content} /></aside></div>{related.length > 0 && <section className="mt-14"><h2 className="text-2xl font-bold">{t("detail.related")}</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((item) => <PromptCard key={item.id} prompt={item} />)}</div></section>}</div>;
}
