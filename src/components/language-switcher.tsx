"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { localeCookieName, locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const router = useRouter();
  function changeLocale(nextLocale: Locale) { document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`; router.refresh(); }
  return <label className="relative flex items-center"><Languages aria-hidden className="pointer-events-none absolute left-2 size-4 text-[var(--muted)]" /><span className="sr-only">{t("language.label")}</span><select aria-label={t("language.label")} className="h-8 appearance-none rounded-lg border bg-transparent py-1 pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-violet-400" value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{locales.map((item) => <option key={item} value={item}>{t(`language.${item}`)}</option>)}</select></label>;
}
