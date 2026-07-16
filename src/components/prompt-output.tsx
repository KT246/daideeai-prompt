"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function PromptOutput({ content, onCopy }: { content: string; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  async function copy() { await navigator.clipboard.writeText(content); onCopy?.(); setCopied(true); toast.success(t("toast.copied")); window.setTimeout(() => setCopied(false), 1800); }
  return <section className="overflow-hidden rounded-2xl border bg-[#100e1b] text-violet-50"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><p className="text-sm font-semibold">{t("prompt.complete")}</p><Button size="sm" variant="secondary" onClick={copy}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? t("prompt.copied") : t("card.copy")}</Button></div><pre className="max-h-[38rem] overflow-auto p-5 text-sm leading-6 whitespace-pre-wrap"><code>{content}</code></pre></section>;
}
