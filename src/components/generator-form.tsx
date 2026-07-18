"use client";

import { useState } from "react";
import { Copy, Download, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createDebugPrompt, createFunctionPrompt, createSystemCheckPrompt } from "@/lib/generator-templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fields = {
  function: [["name", "Tên hàm"], ["purpose", "Mục đích"], ["inputs", "Input và kiểu dữ liệu"], ["output", "Output và kiểu dữ liệu"], ["rules", "Business rules"], ["dependencies", "Dependencies"], ["errors", "Trường hợp lỗi"], ["constraints", "Bảo mật / hiệu năng"]],
  debug: [["system", "Hệ thống / module"], ["expected", "Kết quả mong đợi"], ["actual", "Kết quả thực tế"], ["logs", "Lỗi / logs"], ["steps", "Các bước tái hiện"], ["context", "Thay đổi gần đây / môi trường"]],
  "system-check": [["system", "Sản phẩm / hệ thống"], ["architecture", "Kiến trúc hiện tại"], ["stack", "Stack và dependencies"], ["data", "Dữ liệu / authentication"], ["scale", "Traffic / SLO"], ["concerns", "Mối quan ngại đã biết"]],
} as const;

export function GeneratorForm({ kind, title, description }: { kind: keyof typeof fields; title: string; description: string }) {
  const [result, setResult] = useState("");
  function submit(data: FormData) { const values = Object.fromEntries(data) as Record<string, string>; const content = kind === "function" ? createFunctionPrompt(values) : kind === "debug" ? createDebugPrompt(values) : createSystemCheckPrompt(values); setResult(content); void fetch("/api/generated-prompts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ generator: kind, content, inputData: values, title }) }); }
  function download() { const href = URL.createObjectURL(new Blob([result], { type: "text/plain;charset=utf-8" })); const link = document.createElement("a"); link.href = href; link.download = `${kind}-prompt.txt`; link.click(); URL.revokeObjectURL(href); }
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 text-[var(--muted)]">{description}</p><div className="mt-8 grid gap-6 xl:grid-cols-2"><Card className="p-6"><form action={submit} className="grid gap-4">{fields[kind].map(([name, label]) => <label key={name} className="grid gap-1.5 text-sm font-medium">{label}<Textarea name={name} required={name === fields[kind][0][0]} rows={name === "logs" || name === "architecture" ? 5 : 3} /></label>)}<Button type="submit"><Sparkles className="size-4" />Tạo prompt</Button></form></Card><Card className="min-h-96 p-6"><div className="mb-4 flex flex-wrap gap-2"><Button variant="outline" disabled={!result} onClick={() => navigator.clipboard.writeText(result).then(() => toast.success("Đã sao chép"))}><Copy className="size-4" />Copy</Button><Button variant="outline" disabled={!result} onClick={download}><Download className="size-4" />Tải .txt</Button><Button variant="outline" onClick={() => setResult("")}><RotateCcw className="size-4" />Reset</Button></div>{result ? <pre className="whitespace-pre-wrap break-words text-sm leading-6">{result}</pre> : <p className="text-sm text-[var(--muted)]">Prompt đã tạo sẽ hiển thị ở đây.</p>}</Card></div></div>;
}
