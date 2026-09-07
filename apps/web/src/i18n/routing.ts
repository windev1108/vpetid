import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';


export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
  // localeDetection defaults to true: reads NEXT_LOCALE cookie first, then Accept-Language
});


export type AppLocale = (typeof routing.locales)[number];

export const localeMeta: Record<AppLocale, { label: string; shortLabel: string; flag: string }> = {
  vi: { label: "Tiếng Việt", shortLabel: "VI", flag: "🇻🇳" },
  en: { label: "English", shortLabel: "EN", flag: "🇬🇧" },
};
