import { Card } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
export default async function TermsPage() { const { t } = await getServerTranslator(); return <div className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-3xl font-bold">{t("terms.title")}</h1><Card className="mt-6 grid gap-5 p-6 text-sm leading-6 text-[var(--muted)]"><p>{t("terms.p1")}</p><p>{t("terms.p2")}</p><p>{t("terms.p3")}</p></Card></div>; }
