"use client";

import { PromptOutput } from "@/components/prompt-output";

export function PromptDetailActions({ promptId, content }: { promptId: string; content: string }) {
  return <PromptOutput content={content} onCopy={() => { void fetch(`/api/prompts/${promptId}/copy`, { method: "POST" }); }} />;
}
