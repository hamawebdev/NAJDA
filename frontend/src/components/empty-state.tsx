import type { IconTypes } from "solid-icons";
import { type ParentProps, Show } from "solid-js";

/** Friendly placeholder for empty public lists, with room for a CTA child. */
export function EmptyState(props: ParentProps<{ message: string; icon?: IconTypes }>) {
  return (
    <div class="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card/50 px-6 py-16 text-center">
      <Show when={props.icon}>
        {(icon) => {
          const Icon = icon();
          return (
            <span class="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon size={28} aria-hidden="true" />
            </span>
          );
        }}
      </Show>
      <p class="max-w-sm text-[15px] leading-relaxed text-muted-foreground">{props.message}</p>
      {props.children}
    </div>
  );
}
