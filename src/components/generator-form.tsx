"use client";

import { useState } from "react";
import { Copy, Download, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createDebugPrompt, createFunctionPrompt, createSystemCheckPrompt } from "@/lib/generator-templates";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { MessageKey } from "@/i18n/messages";

type GeneratorKind = "function" | "debug" | "system-check";
type FieldConfig = { name: string; labelKey: MessageKey };

const fields: Record<GeneratorKind, readonly FieldConfig[]> = {
  function: [{ name: "name", labelKey: "generator.function.name" }, { name: "purpose", labelKey: "generator.function.purpose" }, { name: "inputs", labelKey: "generator.function.inputs" }, { name: "output", labelKey: "generator.function.output" }, { name: "rules", labelKey: "generator.function.rules" }, { name: "dependencies", labelKey: "generator.function.dependencies" }, { name: "errors", labelKey: "generator.function.errors" }, { name: "constraints", labelKey: "generator.function.constraints" }],
  debug: [{ name: "system", labelKey: "generator.debug.system" }, { name: "expected", labelKey: "generator.debug.expected" }, { name: "actual", labelKey: "generator.debug.actual" }, { name: "logs", labelKey: "generator.debug.logs" }, { name: "steps", labelKey: "generator.debug.steps" }, { name: "context", labelKey: "generator.debug.context" }],
  "system-check": [{ name: "system", labelKey: "generator.system.system" }, { name: "architecture", labelKey: "generator.system.architecture" }, { name: "stack", labelKey: "generator.system.stack" }, { name: "data", labelKey: "generator.system.data" }, { name: "scale", labelKey: "generator.system.scale" }, { name: "concerns", labelKey: "generator.system.concerns" }],
};

export function GeneratorForm({ kind, titleKey, descriptionKey }: { kind: GeneratorKind; titleKey: MessageKey; descriptionKey: MessageKey }) {
  const { t } = useI18n();
  const [result, setResult] = useState("");
  const [generating, setGenerating] = useState(false);
  function submit(data: FormData) {
    setGenerating(true);
    const values = Object.fromEntries(data) as Record<string, string>;
    window.requestAnimationFrame(() => { const content = kind === "function" ? createFunctionPrompt(values) : kind === "debug" ? createDebugPrompt(values) : createSystemCheckPrompt(values); setResult(content); setGenerating(false); });
  }
  function download() {
    const href = URL.createObjectURL(new Blob([result], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = `${kind}-prompt.txt`;
    link.click();
    URL.revokeObjectURL(href);
  }
  const config = fields[kind];
  return <div className="motion-page mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-bold">{t(titleKey)}</h1><p className="mt-2 text-[var(--muted)]">{t(descriptionKey)}</p><div className="mt-8 grid gap-6 xl:grid-cols-2"><Card className="p-6"><form action={submit} className="grid gap-4">{config.map(({ name, labelKey }, index) => <label key={name} className="grid gap-1.5 text-sm font-medium">{t(labelKey)}<Textarea name={name} required={index === 0} rows={name === "logs" || name === "architecture" ? 5 : 3} /></label>)}<Button disabled={generating} type="submit">{generating ? <LoaderCircle className="motion-spinner size-4" /> : <Sparkles className="size-4" />}{generating ? t("generator.generating") : t("generator.create")}</Button></form></Card><Card className="min-h-96 p-6"><div className="mb-4 flex flex-wrap gap-2"><Button variant="outline" disabled={!result} onClick={() => navigator.clipboard.writeText(result).then(() => toast.success(t("toast.copied")))}><Copy className="size-4" />{t("generator.copy")}</Button><Button variant="outline" disabled={!result} onClick={download}><Download className="size-4" />{t("generator.download")}</Button><Button variant="outline" onClick={() => setResult("")}><RotateCcw className="size-4" />{t("generator.reset")}</Button></div>{result ? <pre className="motion-result whitespace-pre-wrap break-words text-sm leading-6">{result}</pre> : <p className="text-sm text-[var(--muted)]">{t("generator.outputEmpty")}</p>}</Card></div></div>;
}
