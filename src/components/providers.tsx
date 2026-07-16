"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { I18nProvider } from "@/components/i18n-provider";
import type { Locale } from "@/i18n/config";

export function Providers({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem><I18nProvider locale={locale}>{children}</I18nProvider><Toaster richColors position="top-right" /></ThemeProvider>;
}
