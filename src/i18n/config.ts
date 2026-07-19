/** The product is intentionally available only in Lao and English. */
export type Locale = "lo" | "en";
export const locales = ["lo", "en"] as const;

export const defaultLocale: Locale = "en";
export const localeCookieName = "daideeai-prompt-locale";

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}
