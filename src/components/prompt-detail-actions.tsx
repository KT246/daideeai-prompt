"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { PromptOutput } from "@/components/prompt-output";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function PromptDetailActions({ promptId, content }: { promptId: string; content: string }) {
  const { t } = useI18n();
  async function toggleFavorite() {
    const response = await fetch(`/api/prompts/${promptId}/favorite`, { method: "POST" });
    if (response.status === 401) { toast.error(t("prompt.loginToFavorite")); return; }
    if (!response.ok) { toast.error(t("prompt.favoriteFailed")); return; }
    const result = await response.json() as { favorited: boolean };
    toast.success(result.favorited ? t("prompt.favorited") : t("prompt.unfavorited"));
  }
  return <div className="grid gap-3"><Button variant="outline" onClick={toggleFavorite}><Heart className="size-4" />{t("prompt.favorite")}</Button><PromptOutput content={content} onCopy={() => { void fetch(`/api/prompts/${promptId}/copy`, { method: "POST" }); }} /></div>;
}
