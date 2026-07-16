import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLocale } from "@/i18n/server";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = { title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` }, description: siteConfig.description, metadataBase: new URL(siteConfig.url) };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return <html lang={locale} suppressHydrationWarning><body><Providers locale={locale}><SiteHeader /><main className="min-h-[calc(100vh-8rem)]">{children}</main><SiteFooter /></Providers></body></html>;
}
