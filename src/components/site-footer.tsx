"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  return <footer className="border-t"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-4"><div className="md:col-span-2"><p className="font-semibold">DaideeAI Prompt</p><p className="mt-2 max-w-md text-[var(--muted)]">{t("footer.description")}</p></div><div><p className="font-semibold">{t("footer.explore")}</p><div className="mt-2 grid gap-2 text-[var(--muted)]"><Link href="/prompts">{t("footer.library")}</Link><Link href="/generators/crud">{t("footer.crud")}</Link><Link href="/pricing">{t("footer.pricing")}</Link></div></div><div><p className="font-semibold">{t("footer.information")}</p><div className="mt-2 grid gap-2 text-[var(--muted)]"><Link href="/policies">{t("footer.policies")}</Link><Link href="/terms">{t("footer.terms")}</Link><a href={`mailto:hello@${new URL(siteConfig.url).hostname}`}>{t("footer.contact")}</a></div></div></div><div className="border-t px-4 py-4 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} DaideeAI · {siteConfig.url.replace("https://", "")}</div></footer>;
}
