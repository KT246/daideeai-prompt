"use client";

import { useMemo, useState } from "react";
import { FilePenLine, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { promptCategories } from "@/lib/site";

type PromptStatus = "draft" | "published" | "archived";
type PromptAccess = "free" | "pro";
export type AdminPrompt = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  use_case: string;
  instructions: string;
  content: string;
  access: PromptAccess;
  status: PromptStatus;
  copy_count: number;
  created_at: string;
};

type PromptDraft = Omit<AdminPrompt, "id" | "copy_count" | "created_at">;

const blankDraft = (): PromptDraft => ({ slug: "", title: "", description: "", category: "CRUD", technologies: [], use_case: "", instructions: "", content: "", access: "free", status: "draft" });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const toDraft = (prompt: AdminPrompt): PromptDraft => ({ slug: prompt.slug, title: prompt.title, description: prompt.description, category: prompt.category, technologies: prompt.technologies, use_case: prompt.use_case, instructions: prompt.instructions, content: prompt.content, access: prompt.access, status: prompt.status });

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span>{children}</label>;
}

export function AdminPromptList({ initialPrompts }: { initialPrompts: AdminPrompt[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PromptDraft>(blankDraft);
  const [saving, setSaving] = useState(false);
  const selected = useMemo(() => prompts.find((prompt) => prompt.id === selectedId), [prompts, selectedId]);
  const update = <K extends keyof PromptDraft>(key: K, value: PromptDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  function newPrompt() {
    setSelectedId(null);
    setDraft(blankDraft());
  }

  function editPrompt(prompt: AdminPrompt) {
    setSelectedId(prompt.id);
    setDraft(toDraft(prompt));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const payload = { ...draft, technologies: draft.technologies.map((item) => item.trim()).filter(Boolean) };
    const response = await fetch(selectedId ? `/api/admin/prompts/${selectedId}` : "/api/admin/prompts", { method: selectedId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json() as { prompt?: AdminPrompt; error?: string };
    setSaving(false);
    if (!response.ok || !result.prompt) { toast.error(result.error ?? "Could not save the prompt."); return; }
    if (selectedId) setPrompts((current) => current.map((prompt) => prompt.id === selectedId ? result.prompt as AdminPrompt : prompt));
    else setPrompts((current) => [result.prompt as AdminPrompt, ...current]);
    setSelectedId(result.prompt.id);
    setDraft(toDraft(result.prompt));
    toast.success(payload.status === "published" ? "Prompt published." : "Prompt saved as draft.");
  }

  async function removePrompt(prompt: AdminPrompt) {
    if (!window.confirm(`Delete “${prompt.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/prompts/${prompt.id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json() as { error?: string }; toast.error(result.error ?? "Could not delete the prompt."); return; }
    setPrompts((current) => current.filter((item) => item.id !== prompt.id));
    if (selectedId === prompt.id) newPrompt();
    toast.success("Prompt deleted.");
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]"><Card className="p-5 md:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{selected ? "Edit prompt" : "Create prompt"}</h2><p className="mt-1 text-sm text-[var(--muted)]">Only published prompts are visible on the public website.</p></div><Button type="button" variant="outline" onClick={newPrompt}><Plus className="size-4" />New prompt</Button></div><form className="grid gap-4" onSubmit={save}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><Input required value={draft.title} onChange={(event) => { update("title", event.target.value); if (!selectedId) update("slug", slugify(event.target.value)); }} placeholder="Example: Production-ready CRUD" /></Field><Field label="Slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => update("slug", slugify(event.target.value))} placeholder="production-ready-crud" /></Field></div><Field label="Short description"><Textarea required rows={3} value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe what the prompt helps the reader build." /></Field><div className="grid gap-4 sm:grid-cols-3"><Field label="Category"><select value={draft.category} onChange={(event) => update("category", event.target.value)} className="h-10 rounded-xl border bg-transparent px-3 text-sm">{promptCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></Field><Field label="Access"><select value={draft.access} onChange={(event) => update("access", event.target.value as PromptAccess)} className="h-10 rounded-xl border bg-transparent px-3 text-sm"><option value="free">Free</option><option value="pro">Pro</option></select></Field><Field label="Publication"><select value={draft.status} onChange={(event) => update("status", event.target.value as PromptStatus)} className="h-10 rounded-xl border bg-transparent px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field></div><Field label="Technologies (separate with commas)"><Input value={draft.technologies.join(", ")} onChange={(event) => update("technologies", event.target.value.split(","))} placeholder="Next.js, TypeScript, Supabase" /></Field><Field label="Use case"><Textarea required rows={3} value={draft.use_case} onChange={(event) => update("use_case", event.target.value)} placeholder="When and why this prompt should be used." /></Field><Field label="Instructions"><Textarea required rows={4} value={draft.instructions} onChange={(event) => update("instructions", event.target.value)} placeholder="How to adapt and use the prompt." /></Field><Field label="Prompt content"><Textarea required rows={14} value={draft.content} onChange={(event) => update("content", event.target.value)} placeholder="Write the full prompt content here..." /></Field><Button className="w-full" size="lg" disabled={saving} type="submit"><Save className="size-4" />{saving ? "Saving..." : draft.status === "published" ? "Publish prompt" : "Save draft"}</Button></form></Card><section className="grid content-start gap-3"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Your prompts</h2><span className="text-sm text-[var(--muted)]">{prompts.length}</span></div>{prompts.length === 0 ? <Card className="p-5 text-sm text-[var(--muted)]">Create your first prompt. It will remain private until you publish it.</Card> : prompts.map((prompt) => <Card className="p-4" key={prompt.id}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{prompt.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{prompt.status} · {prompt.copy_count} copies</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${prompt.status === "published" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-black/5 text-[var(--muted)] dark:bg-white/10"}`}>{prompt.status}</span></div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => editPrompt(prompt)}><FilePenLine className="size-3.5" />Edit</Button><Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 dark:text-rose-300" onClick={() => removePrompt(prompt)}><Trash2 className="size-3.5" />Delete</Button></div></Card>)}</section></div>;
}
