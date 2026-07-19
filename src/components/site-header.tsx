"use client";

import Link from "next/link";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [[t("nav.explore"), "/prompts"], [t("nav.builder"), "/generators/builder"], [t("nav.crud"), "/generators/crud"], [t("nav.debugging"), "/generators/debugging"], [t("nav.system"), "/generators/system-checking"]] as const;
  return <header className="sticky top-0 z-40 border-b bg-[color:var(--background)]/90 backdrop-blur transition-shadow duration-200"><div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4"><Link href="/" className="motion-link flex shrink-0 items-center gap-2 font-bold"><span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-white"><Code2 className="size-4" /></span><span>DaideeAI Prompt</span></Link><nav className="hidden flex-1 items-center justify-center gap-4 lg:flex">{links.map(([label, href]) => <Link key={href} href={href} className="motion-link text-sm text-[var(--muted)]">{label}</Link>)}</nav><div className="ml-auto flex items-center gap-1"><LanguageSwitcher /><ThemeToggle /><AuthMenu /><Button variant="ghost" size="sm" className="lg:hidden" aria-label={menuOpen ? t("nav.closeMenu") : t("nav.menu")} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</Button></div>{menuOpen && <><button className="fixed inset-16 z-[-1] bg-black/20 lg:hidden" aria-label={t("nav.closeMenu")} onClick={() => setMenuOpen(false)} /><nav className="motion-mobile-menu absolute left-4 right-4 top-[calc(100%+0.5rem)] grid rounded-2xl border bg-[var(--card)] p-2 shadow-xl lg:hidden">{links.map(([label, href]) => <Link key={href} href={href} className="motion-link rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav></>}</div></header>;
}
