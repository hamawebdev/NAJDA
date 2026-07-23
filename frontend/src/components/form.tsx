/**
 * Form primitives for the whole app. Design system rules:
 * controls are 52px tall (large touch targets), rounded-lg (12px), on a
 * card-white surface; labels sit above inputs; status banners carry icons.
 */
import { TbOutlineAlertCircle, TbOutlineCircleCheck } from "solid-icons/tb";
import { type ComponentProps, type ParentProps, Show, splitProps } from "solid-js";

import { cn } from "~/lib/utils";

const controlClass =
  "h-13 w-full rounded-lg border border-input bg-card px-3.5 text-base shadow-xs transition-colors " +
  "placeholder:text-muted-foreground hover:border-ring/40 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export function Field(props: ParentProps<{ label: string; hint?: string }>) {
  return (
    <label class="block space-y-2">
      <span class="text-[15px] font-semibold leading-none">
        {props.label}
        <Show when={props.hint}>
          <span class="ms-2 font-normal text-muted-foreground">({props.hint})</span>
        </Show>
      </span>
      {props.children}
    </label>
  );
}

export function TextInput(props: ComponentProps<"input">) {
  const [local, others] = splitProps(props, ["class"]);
  return <input class={cn(controlClass, local.class)} {...others} />;
}

export function TextArea(props: ComponentProps<"textarea">) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <textarea
      class={cn(controlClass, "h-auto min-h-32 py-3 leading-relaxed", local.class)}
      {...others}
    />
  );
}

/** Inline error banner under a form (message is already translated). */
export function FormError(props: { message: string | null }) {
  return (
    <Show when={props.message}>
      <p
        role="alert"
        class="flex items-center gap-2.5 rounded-lg bg-error px-4 py-3 text-[15px] font-medium text-error-foreground"
      >
        <TbOutlineAlertCircle size={22} class="shrink-0" aria-hidden="true" />
        {props.message}
      </p>
    </Show>
  );
}

/** Inline success banner (message is already translated). */
export function FormSuccess(props: { message: string | null }) {
  return (
    <Show when={props.message}>
      <p
        role="status"
        class="flex items-center gap-2.5 rounded-lg bg-success px-4 py-3 text-[15px] font-medium text-success-foreground"
      >
        <TbOutlineCircleCheck size={22} class="shrink-0" aria-hidden="true" />
        {props.message}
      </p>
    </Show>
  );
}
