/**
 * Locale and text-direction plumbing.
 *
 * docs/00-vision-and-principles.md requires Arabic, Tamazight (Tifinagh and
 * Latin) and French, and the interface must stay operable by someone who reads
 * none of them.
 *
 * TODO(product): only `ar` and `fr` are listed below. docs/ does not fix the
 * BCP-47 codes for the two Tamazight variants (e.g. `zgh-Tfng` vs `kab-Latn`),
 * so they are deliberately absent rather than guessed — confirm and add.
 */

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
