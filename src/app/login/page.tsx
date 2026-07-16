import { LoginButton } from "@/components/login-button";
import { Card } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
export default async function LoginPage() { const { t } = await getServerTranslator(); return <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4"><Card className="w-full p-8 text-center"><h1 className="text-2xl font-bold">{t("login.title")}</h1><p className="mt-3 text-sm text-[var(--muted)]">{t("login.description")}</p><div className="mt-7"><LoginButton /></div></Card></div>; }
