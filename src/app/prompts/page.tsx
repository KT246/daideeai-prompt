import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getServerTranslator } from "@/i18n/server";
import { getPrompts } from "@/lib/prompts";
import { categoryLabels, promptCategories } from "@/lib/site";

export const metadata: Metadata = { title: "Prompt Library" };
type SearchParams = Promise<{ q?: string; category?: string; technology?: string; access?: "free" | "pro"; sort?: "newest" | "popular"; page?: string }>;

export default async function PromptsPage({ searchParams }: { searchParams: SearchParams }) {
  const { locale, t } = await getServerTranslator();
  const input = await searchParams;
  const page = Number(input.page ?? "1");
  const { prompts, total } = await getPrompts({ query: input.q, category: input.category, technology: input.technology, access: input.access, sort: input.sort, page });
  const hasNext = page * 12 < total;
  const paginationQuery = (targetPage: number) => {
    const query = new URLSearchParams();
    if (input.q) query.set("q", input.q); if (input.category) query.set("category", input.category); if (input.technology) query.set("technology", input.technology); if (input.access) query.set("access", input.access); if (input.sort) query.set("sort", input.sort); query.set("page", String(targetPage));
    return query.toString();
  };
  return <div className="mx-auto max-w-7xl px-4 py-10"><div><p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{t("library.eyebrow")}</p><h1 className="mt-2 text-3xl font-bold">{t("library.title")}</h1><p className="mt-2 text-[var(--muted)]">{t("library.description")}</p></div><Card className="mt-7 p-4"><form className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]"><label className="relative"><Search className="absolute left-3 top-3 size-4 text-[var(--muted)]" /><Input className="pl-9" defaultValue={input.q} name="q" placeholder={t("library.search")} /></label><select className="h-10 rounded-xl border bg-transparent px-3 text-sm" defaultValue={input.category} name="category"><option value="">{t("library.allCategories")}</option>{promptCategories.map((item) => <option key={item} value={item}>{categoryLabels[locale][item]}</option>)}</select><Input defaultValue={input.technology} name="technology" placeholder={t("library.technology")} /><select className="h-10 rounded-xl border bg-transparent px-3 text-sm" defaultValue={input.access} name="access"><option value="">{t("library.access")}</option><option value="free">{t("library.free")}</option><option value="pro">{t("library.pro")}</option></select><Button type="submit">{t("library.filter")}</Button></form><div className="mt-3 flex gap-2"><Link className={`rounded-lg px-3 py-1.5 text-xs ${input.sort !== "popular" ? "bg-violet-600 text-white" : "border"}`} href="/prompts?sort=newest">{t("library.newest")}</Link><Link className={`rounded-lg px-3 py-1.5 text-xs ${input.sort === "popular" ? "bg-violet-600 text-white" : "border"}`} href="/prompts?sort=popular">{t("library.popular")}</Link></div></Card>{prompts.length ? <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}</div> : <Card className="mt-6 p-10 text-center"><p className="font-semibold">{t("library.emptyTitle")}</p><p className="mt-2 text-sm text-[var(--muted)]">{t("library.emptyDescription")}</p></Card>}<div className="mt-8 flex justify-center gap-3">{page > 1 && <Button variant="outline" asChild><Link href={`/prompts?${paginationQuery(page - 1)}`}>{t("library.previous")}</Link></Button>}{hasNext && <Button variant="outline" asChild><Link href={`/prompts?${paginationQuery(page + 1)}`}>{t("library.next")}</Link></Button>}</div></div>;
}
