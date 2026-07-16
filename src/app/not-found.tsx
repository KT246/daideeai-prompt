import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerTranslator } from "@/i18n/server";
export default async function NotFound() { const { t } = await getServerTranslator(); return <div className="mx-auto grid min-h-[55vh] max-w-lg place-items-center px-4 text-center"><div><p className="text-sm font-bold text-violet-600">404</p><h1 className="mt-2 text-3xl font-bold">{t("notFound.title")}</h1><p className="mt-3 text-[var(--muted)]">{t("notFound.description")}</p><Button className="mt-6" asChild><Link href="/">{t("notFound.back")}</Link></Button></div></div>; }
