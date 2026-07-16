"use client";

import Link from "next/link";
import { Code2, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeader() {
  const { t } = useI18n();
  const links = [
    [t("nav.explore"), "/prompts"], [t("nav.builder"), "/generators/builder"], [t("nav.crud"), "/generators/crud"], [t("nav.debugging"), "/generators/debugging"], [t("nav.system"), "/generators/system-checking"], [t("nav.pricing"), "/pricing"],
  ] as const;
  return <header className="sticky top-0 z-40 border-b bg-[color:var(--background)]/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
    <Link href="/" className="flex shrink-0 items-center gap-2 font-bold"><span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-white"><Code2 className="size-4" /></span><span>DaideeAI Prompt</span></Link>
    <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">{label}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-1"><LanguageSwitcher /><ThemeToggle /><AuthMenu /><Button variant="ghost" size="sm" className="lg:hidden" aria-label={t("nav.explore")}><Menu className="size-4" /></Button></div>
  </div></header>;
}
