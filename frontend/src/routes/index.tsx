import { A } from "@solidjs/router";
import type { IconTypes } from "solid-icons";
import {
  TbOutlineArrowLeft,
  TbOutlineArrowRight,
  TbOutlineHeartHandshake,
  TbOutlinePackage,
  TbOutlineSearch,
  TbOutlineShieldPlus,
  TbOutlineUsersGroup,
} from "solid-icons/tb";
import { For } from "solid-js";

import { type MessageKey, useI18n } from "~/lib/i18n";

interface Action {
  href: string;
  icon: IconTypes;
  title: MessageKey;
  desc: MessageKey;
  /** Primary actions get the strongest visual weight. */
  primary?: boolean;
  wide?: boolean;
}

const ACTIONS: Action[] = [
  { href: "/help/new", icon: TbOutlineHeartHandshake, title: "home.requestHelp", desc: "home.requestHelpDesc", primary: true, wide: true },
  { href: "/groups", icon: TbOutlineUsersGroup, title: "home.joinGroup", desc: "home.joinGroupDesc", primary: true, wide: true },
  { href: "/groups/new", icon: TbOutlineShieldPlus, title: "home.createGroup", desc: "home.createGroupDesc" },
  { href: "/resources/new", icon: TbOutlinePackage, title: "home.offerResources", desc: "home.offerResourcesDesc" },
  { href: "/missing/new", icon: TbOutlineSearch, title: "home.reportMissing", desc: "home.reportMissingDesc" },
];

export default function Home() {
  const { t, locale } = useI18n();
  const Arrow = () => (locale() === "ar" ? <TbOutlineArrowLeft size={22} /> : <TbOutlineArrowRight size={22} />);

  return (
    <div class="space-y-10 py-4">
      <section class="mx-auto max-w-2xl space-y-4 text-center">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p class="text-lg leading-relaxed text-muted-foreground">{t("home.intro")}</p>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <For each={ACTIONS}>
          {(action) => (
            <A
              href={action.href}
              class="group flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              classList={{
                "lg:col-span-3 border-primary/30 hover:border-primary": Boolean(action.primary),
                "lg:col-span-2 hover:border-ring/50": !action.primary,
                "sm:col-span-2 lg:col-span-2": !action.primary && action.href === "/missing/new",
              }}
            >
              <div class="flex items-center justify-between">
                <span
                  class="flex size-13 items-center justify-center rounded-lg transition-colors"
                  classList={{
                    "bg-primary text-primary-foreground": Boolean(action.primary),
                    "bg-primary/10 text-primary": !action.primary,
                  }}
                >
                  <action.icon size={28} aria-hidden="true" />
                </span>
                <span class="text-muted-foreground/50 transition-colors group-hover:text-primary">
                  <Arrow />
                </span>
              </div>
              <div class="space-y-1.5">
                <h2 class="text-xl font-bold leading-snug">{t(action.title)}</h2>
                <p class="text-[15px] leading-relaxed text-muted-foreground">{t(action.desc)}</p>
              </div>
            </A>
          )}
        </For>
      </section>

      <p class="mx-auto max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
        {t("common.tagline")}
      </p>
    </div>
  );
}
