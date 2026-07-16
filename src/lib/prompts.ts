import { createClient } from "@/lib/supabase/server";
import type { PromptDetail, PromptSearchParams, PromptSummary } from "@/types/prompt";

const PAGE_SIZE = 12;

function toSummary(row: Record<string, unknown>): PromptSummary {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description),
    category: String(row.category), technologies: Array.isArray(row.technologies) ? row.technologies.map(String) : [],
    copyCount: Number(row.copy_count ?? 0), likeCount: Number(row.like_count ?? 0),
    access: row.access === "pro" ? "pro" : "free", createdAt: String(row.created_at), content: typeof row.content === "string" ? row.content : undefined,
  };
}

export async function getPrompts(params: PromptSearchParams = {}) {
  const supabase = await createClient();
  if (!supabase) return { prompts: [] as PromptSummary[], total: 0 };
  const page = Math.max(1, params.page ?? 1);
  let query = supabase.from("prompts").select("id,slug,title,description,category,technologies,copy_count,like_count,access,created_at,content", { count: "exact" }).eq("status", "published");
  if (params.query) query = query.ilike("title", `%${params.query}%`);
  if (params.category) query = query.eq("category", params.category);
  if (params.technology) query = query.contains("technologies", [params.technology]);
  if (params.access) query = query.eq("access", params.access);
  query = query.order(params.sort === "popular" ? "copy_count" : "created_at", { ascending: false }).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const { data, count } = await query;
  return { prompts: (data ?? []).map((row) => toSummary(row)), total: count ?? 0 };
}

export async function getPromptBySlug(slug: string): Promise<PromptDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("prompts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return { ...toSummary(row), useCase: String(row.use_case), instructions: String(row.instructions), content: String(row.content) };
}

export async function getRelatedPrompts(category: string, excludeId: string) {
  const supabase = await createClient();
  if (!supabase) return [] as PromptSummary[];
  const { data } = await supabase.from("prompts").select("id,slug,title,description,category,technologies,copy_count,like_count,access,created_at,content").eq("category", category).neq("id", excludeId).eq("status", "published").limit(3);
  return (data ?? []).map((row) => toSummary(row));
}
