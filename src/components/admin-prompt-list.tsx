"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

type Status = "draft" | "published" | "archived";
interface AdminPrompt { id: string; title: string; status: Status; copy_count: number; created_at: string }

export function AdminPromptList({ initialPrompts }: { initialPrompts: AdminPrompt[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const { t } = useI18n();
  async function updateStatus(id: string, status: Status) { const response = await fetch(`/api/admin/prompts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); if (!response.ok) { toast.error(t("admin.updateFailed")); return; } setPrompts((current) => current.map((item) => item.id === id ? { ...item, status } : item)); toast.success(t("admin.updated")); }
  if (!prompts.length) return <p className="text-sm text-[var(--muted)]">{t("admin.empty")}</p>;
  return <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b text-[var(--muted)]"><tr><th className="p-3 font-medium">{t("admin.prompt")}</th><th className="p-3 font-medium">{t("admin.copyCount")}</th><th className="p-3 font-medium">{t("admin.status")}</th><th className="p-3 font-medium">{t("admin.actions")}</th></tr></thead><tbody>{prompts.map((prompt) => <tr className="border-b" key={prompt.id}><td className="p-3 font-medium">{prompt.title}</td><td className="p-3">{prompt.copy_count}</td><td className="p-3"><select className="rounded-lg border bg-transparent px-2 py-1" value={prompt.status} onChange={(event) => updateStatus(prompt.id, event.target.value as Status)}><option value="draft">{t("admin.draft")}</option><option value="published">{t("admin.published")}</option><option value="archived">{t("admin.archived")}</option></select></td><td className="p-3"><Button size="sm" variant="outline" onClick={() => updateStatus(prompt.id, prompt.status)}>{t("admin.save")}</Button></td></tr>)}</tbody></table></div>;
}
