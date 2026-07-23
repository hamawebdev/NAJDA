/**
 * App chrome: sticky brand bar (logo, leader link, language toggle) plus a
 * scrollable row of the six section links. No drawers or hidden menus:
 * every destination stays one visible tap away.
 */
import { A } from "@solidjs/router";
import type { IconTypes } from "solid-icons";
import {
  TbOutlineFlame,
  TbOutlineHeartHandshake,
  TbOutlineHome,
  TbOutlineLanguage,
  TbOutlinePackage,
  TbOutlineSearch,
  TbOutlineShieldCheck,
  TbOutlineUsersGroup,
} from "solid-icons/tb";
import { For } from "solid-js";

import { LOCALES, type MessageKey, useI18n } from "~/lib/i18n";

const LINKS: { href: string; key: MessageKey; icon: IconTypes }[] = [
  { href: "/", key: "nav.home", icon: TbOutlineHome },
  { href: "/groups", key: "nav.groups", icon: TbOutlineUsersGroup },
  { href: "/volunteer", key: "nav.volunteer", icon: TbOutlineFlame },
  { href: "/resources", key: "nav.resources", icon: TbOutlinePackage },
  { href: "/help", key: "nav.help", icon: TbOutlineHeartHandshake },
  { href: "/missing", key: "nav.missing", icon: TbOutlineSearch },
];

export function Nav() {
  const { t, locale, setLocale } = useI18n();
  const otherLocale = () => (locale() === "ar" ? "fr" : "ar");

  return (
    <header class="sticky top-0 z-40 border-b bg-card">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <A href="/" class="flex items-center gap-2.5" aria-label={t("common.appName")}>
          <span class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TbOutlineFlame size={22} aria-hidden="true" />
          </span>
          <span class="text-xl font-bold tracking-tight">{t("common.appName")}</span>
        </A>
        <div class="flex items-center gap-1.5">
          <A
            href="/leader"
            class="flex h-11 items-center gap-2 rounded-lg px-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <TbOutlineShieldCheck size={20} aria-hidden="true" />
            <span class="hidden sm:inline">{t("nav.leader")}</span>
          </A>
          <button
            type="button"
            class="flex h-11 items-center gap-2 rounded-lg border border-input px-3 text-[15px] font-medium transition-colors hover:bg-accent"
            onClick={() => setLocale(otherLocale())}
          >
            <TbOutlineLanguage size={20} aria-hidden="true" />
            {LOCALES[otherLocale()].label}
          </button>
        </div>
      </div>
      <nav class="mx-auto max-w-5xl overflow-x-auto px-4 pb-2.5">
        <ul class="flex gap-1.5 whitespace-nowrap">
          <For each={LINKS}>
            {(link) => (
              <li>
                <A
                  href={link.href}
                  end={link.href === "/"}
                  class="flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  activeClass="bg-primary/10 !text-primary"
                >
                  <link.icon size={18} aria-hidden="true" />
                  {t(link.key)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </header>
  );
}
