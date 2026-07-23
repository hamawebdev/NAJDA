/**
 * Locale plumbing: Arabic (RTL, default) and French, persisted in the
 * `najda_locale` cookie so SSR renders the right language. The `dir`/`lang`
 * attributes on <html> are synced client-side (the server document defaults
 * to ar/rtl and settles on hydration for returning fr visitors).
 */
import {
  type ParentProps,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";

import { ar } from "./ar";
import { fr } from "./fr";

export type Direction = "ltr" | "rtl";

export const LOCALES = {
  ar: { label: "العربية", dir: "rtl" },
  fr: { label: "Français", dir: "ltr" },
} as const satisfies Record<string, { label: string; dir: Direction }>;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return value in LOCALES;
}

/** Text direction for a locale — drives the `dir` attribute on <html>. */
export function dirFor(locale: Locale): Direction {
  return LOCALES[locale].dir;
}

export type MessageKey = keyof typeof ar;

const dictionaries: Record<Locale, Record<MessageKey, string>> = { ar, fr };

const LOCALE_COOKIE = "najda_locale";

function localeFromCookie(cookie: string | null | undefined): Locale {
  const match = /(?:^|;\s*)najda_locale=(\w+)/.exec(cookie ?? "");
  return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

function initialLocale(): Locale {
  if (isServer) {
    return localeFromCookie(getRequestEvent()?.request.headers.get("cookie"));
  }
  return localeFromCookie(document.cookie);
}

interface I18nValue {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a key, substituting `{name}` placeholders from params. */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  /** Translate a backend error message key (falls back to a generic error). */
  tError: (key: string) => string;
  /** Pick the localized name from a row carrying `name_ar`/`name_fr` pairs. */
  pick: (names: { ar: string; fr: string }) => string;
}

const I18nContext = createContext<I18nValue>();

export function I18nProvider(props: ParentProps) {
  const [locale, setLocaleSignal] = createSignal<Locale>(initialLocale());

  const setLocale = (next: Locale) => {
    setLocaleSignal(next);
    if (!isServer) {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    }
  };

  if (!isServer) {
    createEffect(() => {
      document.documentElement.lang = locale();
      document.documentElement.dir = dirFor(locale());
    });
  }

  const t: I18nValue["t"] = (key, params) => {
    const message = dictionaries[locale()][key] ?? key;
    if (!params) return message;
    return message.replace(/\{(\w+)\}/g, (_, name: string) =>
      params[name] !== undefined ? String(params[name]) : `{${name}}`,
    );
  };

  const value: I18nValue = {
    locale,
    setLocale,
    t,
    tError: (key) => {
      const candidate = `error.${key}` as MessageKey;
      return dictionaries[locale()][candidate] ?? t("error.generic");
    },
    pick: (names) => (locale() === "ar" ? names.ar : names.fr),
  };

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}

/** "3 min ago" style relative time from an epoch-seconds timestamp. */
export function timeAgo(epochSeconds: number, locale: Locale): string {
  const seconds = Math.round(Date.now() / 1000 - epochSeconds);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (seconds < 60) return rtf.format(0, "minute");
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), "hour");
  return rtf.format(-Math.floor(seconds / 86400), "day");
}
