"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/i18n/config";
import { translate, type MessageKey, type MessageValues } from "@/i18n/messages";

interface I18nContextValue { locale: Locale; t: (key: MessageKey, values?: MessageValues) => string }
const I18nContext = createContext<I18nContextValue>({ locale: defaultLocale, t: (key, values) => translate(defaultLocale, key, values) });

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <I18nContext.Provider value={{ locale, t: (key, values) => translate(locale, key, values) }}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
