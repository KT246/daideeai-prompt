"use client";

import Link from "next/link";
import { Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import type { PromptSummary } from "@/types/prompt";
import { useI18n } from "@/components/i18n-provider";
import { categoryLabels, type PromptCategory } from "@/lib/site";

export function PromptCard({ prompt }: { prompt: PromptSummary }) {
  const { locale, t } = useI18n();
  async function copyPrompt() {
    if (!prompt.content) { toast.error(t("toast.contentUnavailable")); return; }
    await navigator.clipboard.writeText(prompt.content);
    void fetch(`/api/prompts/${prompt.id}/copy`, { method: "POST" });
    toast.success(t("toast.copied"));
  }
  const category = categoryLabels[locale][prompt.category as PromptCategory] ?? prompt.category;
  return <article className="flex h-full flex-col rounded-2xl border bg-[var(--card)] p-5"><div className="flex items-start justify-between gap-3"><Badge>{category}</Badge><span className="text-xs font-semibold text-violet-600 dark:text-violet-300">{prompt.access === "pro" ? t("library.pro") : t("card.free")}</span></div><h3 className="mt-4 text-lg font-semibold">{prompt.title}</h3><p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{prompt.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{prompt.technologies.map((item) => <Badge className="bg-black/5 text-[var(--muted)] dark:bg-white/5" key={item}>{item}</Badge>)}</div><div className="mt-auto pt-5 text-xs text-[var(--muted)]"><span className="flex items-center gap-1"><Copy className="size-3" />{formatNumber(prompt.copyCount, locale)}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" asChild><Link href={`/prompts/${prompt.slug}`}><Eye className="size-4" />{t("card.view")}</Link></Button><Button onClick={copyPrompt}><Copy className="size-4" />{t("card.copy")}</Button></div></article>;
}
