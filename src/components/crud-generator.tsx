"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "@/components/i18n-provider";
import { PromptOutput } from "@/components/prompt-output";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCrudPrompt, type CrudPromptInput } from "@/lib/crud-template";
import { databaseOptions, frameworkOptions } from "@/lib/site";
import type { MessageKey } from "@/i18n/messages";

type CrudForm = CrudPromptInput;
type SwitchKey = keyof Pick<CrudForm, "imageUpload" | "search" | "pagination" | "filter" | "sort" | "softDelete" | "auditLog" | "tests" | "rls" | "adminPage">;
const frameworkLabelKeys: Record<(typeof frameworkOptions)[number], MessageKey> = { "Next.js App Router": "options.framework.nextApp", "Next.js Pages Router": "options.framework.nextPages", "Node.js": "options.framework.node", NestJS: "options.framework.nest", React: "options.framework.react", Vue: "options.framework.vue", Other: "options.framework.other" };
const databaseLabelKeys: Record<(typeof databaseOptions)[number], MessageKey> = { "Supabase PostgreSQL": "options.database.supabase", PostgreSQL: "options.database.postgres", MySQL: "options.database.mysql", MongoDB: "options.database.mongo", None: "options.database.none" };
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span>{children}{error && <span className="text-xs text-red-500">{error}</span>}</label>; }

export function CrudGenerator() {
  const { locale, t } = useI18n();
  const [result, setResult] = useState("");
  const schema = useMemo(() => z.object({
    featureName: z.string().trim().min(2, t("validation.feature")), entityName: z.string().trim().min(2, t("validation.entity")), description: z.string().trim().min(10, t("validation.description")),
    framework: z.string().min(1), database: z.string().min(1), authentication: z.string().min(1), uiLibrary: z.string().min(1), validationLibrary: z.string().min(1), accessPermission: z.string().min(1), fields: z.string().trim().min(3, t("validation.fields")),
    imageUpload: z.boolean(), search: z.boolean(), pagination: z.boolean(), filter: z.boolean(), sort: z.boolean(), softDelete: z.boolean(), auditLog: z.boolean(), tests: z.boolean(), rls: z.boolean(), adminPage: z.boolean(),
  }), [t]);
  const switches: Array<{ key: SwitchKey; label: string }> = [
    { key: "imageUpload", label: t("crud.imageUpload") }, { key: "search", label: t("crud.search") }, { key: "pagination", label: t("crud.pagination") }, { key: "filter", label: t("crud.filter") }, { key: "sort", label: t("crud.sort") }, { key: "softDelete", label: t("crud.softDelete") }, { key: "auditLog", label: t("crud.auditLog") }, { key: "tests", label: t("crud.tests") }, { key: "rls", label: t("crud.rls") }, { key: "adminPage", label: t("crud.adminPage") },
  ];
  const { register, handleSubmit, formState: { errors } } = useForm<CrudForm>({ resolver: zodResolver(schema), defaultValues: { featureName: "", entityName: "", description: "", framework: frameworkOptions[0], database: databaseOptions[0], authentication: "Supabase Auth", uiLibrary: "shadcn/ui", validationLibrary: "Zod + React Hook Form", accessPermission: t("crud.defaultPermission"), fields: "", imageUpload: false, search: true, pagination: true, filter: true, sort: true, softDelete: false, auditLog: false, tests: true, rls: true, adminPage: true } });
  function submit(values: CrudForm) { const content = createCrudPrompt(values, locale); setResult(content); }
  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><Card className="p-5 md:p-6"><form className="grid gap-5" onSubmit={handleSubmit(submit)}><div><h2 className="text-xl font-bold">{t("crud.configuration")}</h2><p className="mt-1 text-sm text-[var(--muted)]">{t("crud.configurationDescription")}</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label={t("crud.featureName")} error={errors.featureName?.message}><Input placeholder={t("crud.featurePlaceholder")} {...register("featureName")} /></Field><Field label={t("crud.entityName")} error={errors.entityName?.message}><Input placeholder={t("crud.entityPlaceholder")} {...register("entityName")} /></Field></div><Field label={t("crud.descriptionLabel")} error={errors.description?.message}><Textarea placeholder={t("crud.descriptionPlaceholder")} {...register("description")} /></Field><Field label={t("crud.fields")} error={errors.fields?.message}><Textarea placeholder={t("crud.fieldsPlaceholder")} {...register("fields")} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label={t("crud.framework")}><select className="h-10 w-full rounded-xl border bg-transparent px-3 text-sm" {...register("framework")}>{frameworkOptions.map((item) => <option key={item} value={item}>{t(frameworkLabelKeys[item])}</option>)}</select></Field><Field label={t("crud.database")}><select className="h-10 w-full rounded-xl border bg-transparent px-3 text-sm" {...register("database")}>{databaseOptions.map((item) => <option key={item} value={item}>{t(databaseLabelKeys[item])}</option>)}</select></Field><Field label={t("crud.authentication")}><Input {...register("authentication")} /></Field><Field label={t("crud.permission")}><Input {...register("accessPermission")} /></Field><Field label={t("crud.uiLibrary")}><Input {...register("uiLibrary")} /></Field><Field label={t("crud.validation")}><Input {...register("validationLibrary")} /></Field></div><fieldset className="grid gap-3"><legend className="mb-2 text-sm font-semibold">{t("crud.features")}</legend><div className="grid gap-2 sm:grid-cols-2">{switches.map(({ key, label }) => <label className="flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm" key={key}><input className="size-4 accent-violet-600" type="checkbox" {...register(key)} />{label}</label>)}</div></fieldset><Button className="w-full" size="lg" type="submit"><Sparkles className="size-4" />{t("crud.generate")}</Button></form></Card><div className="min-w-0">{result ? <PromptOutput content={result} /> : <Card className="grid min-h-80 place-items-center p-6 text-center text-sm text-[var(--muted)]">{t("crud.outputEmpty")}</Card>}</div></div>;
}
