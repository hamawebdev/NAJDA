import type { IconTypes } from "solid-icons";
import { type JSX, Show } from "solid-js";

/**
 * Shared page header: tinted icon tile + title (+ optional subtitle and a
 * single action slot). Keeps every page opening with the same rhythm.
 */
export function PageHeader(props: {
  icon: IconTypes;
  title: string;
  subtitle?: string;
  action?: JSX.Element;
}) {
  return (
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-start gap-3.5">
        <span class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <props.icon size={26} aria-hidden="true" />
        </span>
        <div class="space-y-1.5">
          <h1 class="text-2xl font-bold leading-tight sm:text-3xl">{props.title}</h1>
          <Show when={props.subtitle}>
            <p class="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {props.subtitle}
            </p>
          </Show>
        </div>
      </div>
      <Show when={props.action}>{props.action}</Show>
    </header>
  );
}
