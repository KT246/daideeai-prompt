import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/i18n/config";
import { translate, type MessageKey, type MessageValues } from "@/i18n/messages";

export async function getServerLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookieName)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getServerTranslator() {
  const locale = await getServerLocale();
  return { locale, t: (key: MessageKey, values?: MessageValues) => translate(locale, key, values) };
}
