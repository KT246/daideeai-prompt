import type { Metadata } from "next";
import { CrudGenerator } from "@/components/crud-generator";
import { getServerTranslator } from "@/i18n/server";

export const metadata: Metadata = { title: "CRUD Prompt Generator", description: "Generate complete CRUD implementation prompts for software projects." };
export default async function CrudGeneratorPage() { const { t } = await getServerTranslator(); return <div className="mx-auto max-w-7xl px-4 py-10"><p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{t("crud.eyebrow")}</p><h1 className="mt-2 text-3xl font-bold">{t("crud.title")}</h1><p className="mt-3 max-w-2xl text-[var(--muted)]">{t("crud.description")}</p><div className="mt-8"><CrudGenerator /></div></div>; }
