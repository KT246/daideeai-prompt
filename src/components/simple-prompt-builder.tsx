"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { PromptOutput } from "@/components/prompt-output";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTaskPrompt, type TaskPromptMode } from "@/lib/task-template";

export function SimplePromptBuilder({ mode, titleKey, descriptionKey }: { mode: TaskPromptMode; titleKey: "builder.title" | "debugging.title" | "system.title"; descriptionKey: "builder.description" | "debugging.description" | "system.description" }) {
  const { locale, t } = useI18n();
  const [task, setTask] = useState(""); const [context, setContext] = useState(""); const [output, setOutput] = useState("");
  function generate() { if (!task.trim() || !context.trim()) return; const content = createTaskPrompt(task, context, mode, locale); setOutput(content); }
  return <div className="grid gap-6 xl:grid-cols-2"><Card className="p-6"><h1 className="text-3xl font-bold">{t(titleKey)}</h1><p className="mt-2 text-[var(--muted)]">{t(descriptionKey)}</p><div className="mt-6 grid gap-4"><label className="grid gap-2 text-sm font-medium">{t("builder.task")}<Input value={task} onChange={(event) => setTask(event.target.value)} placeholder={t("builder.taskPlaceholder")} /></label><label className="grid gap-2 text-sm font-medium">{t("builder.context")}<Textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder={t("builder.contextPlaceholder")} /></label><Button disabled={!task.trim() || !context.trim()} onClick={generate}>{t("builder.generate")}</Button></div></Card>{output ? <PromptOutput content={output} /> : <Card className="grid min-h-80 place-items-center p-6 text-center text-sm text-[var(--muted)]">{t("builder.outputEmpty")}</Card>}</div>;
}
