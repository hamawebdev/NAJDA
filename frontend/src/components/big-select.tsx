/**
 * Custom select for the whole app: Kobalte listbox (keyboard + screen-reader
 * accessible, no native <select>), styled with large touch targets and
 * RTL-safe logical properties. Options carry a numeric value + display label.
 */
import * as SelectPrimitive from "@kobalte/core/select";
import { TbOutlineCheck, TbOutlineChevronDown } from "solid-icons/tb";
import { Show } from "solid-js";

import { cn } from "~/lib/utils";

export interface SelectOption {
  value: number;
  label: string;
  /** Secondary text shown muted after the label (e.g. wilaya number). */
  hint?: string;
}

export function BigSelect(props: {
  options: SelectOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  /** Selecting this first pseudo-option maps back to null (used for "all"). */
  clearLabel?: string;
  disabled?: boolean;
  label?: string;
  class?: string;
}) {
  const CLEAR = -1;
  const options = () =>
    props.clearLabel
      ? [{ value: CLEAR, label: props.clearLabel }, ...props.options]
      : props.options;
  const selected = () => options().find((o) => o.value === props.value) ?? null;

  return (
    <SelectPrimitive.Root<SelectOption>
      options={options()}
      optionValue="value"
      optionTextValue="label"
      value={selected()}
      onChange={(option) =>
        props.onChange(option === null || option.value === CLEAR ? null : option.value)
      }
      disabled={props.disabled}
      placeholder={props.placeholder}
      gutter={6}
      itemComponent={(itemProps) => (
        <SelectPrimitive.Item
          item={itemProps.item}
          class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md py-3 ps-3 pe-10 text-base outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <SelectPrimitive.ItemLabel class="flex-1 truncate">
            {itemProps.item.rawValue.label}
            <Show when={itemProps.item.rawValue.hint}>
              <span class="ms-2 text-sm text-muted-foreground">
                {itemProps.item.rawValue.hint}
              </span>
            </Show>
          </SelectPrimitive.ItemLabel>
          <SelectPrimitive.ItemIndicator class="absolute end-3 text-primary">
            <TbOutlineCheck size={20} aria-hidden="true" />
          </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      )}
    >
      <SelectPrimitive.Trigger
        aria-label={props.label ?? props.placeholder}
        class={cn(
          "flex h-13 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3.5 text-start text-base shadow-xs transition-colors",
          "hover:border-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 data-[expanded]:border-ring",
          props.class,
        )}
      >
        <SelectPrimitive.Value<SelectOption> class="truncate data-[placeholder-shown]:text-muted-foreground">
          {(state) => state.selectedOption()?.label}
        </SelectPrimitive.Value>
        <TbOutlineChevronDown size={20} class="shrink-0 text-muted-foreground" aria-hidden="true" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content class="z-50 min-w-(--kb-popper-anchor-width) overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg animate-in fade-in-80 slide-in-from-top-1">
          <SelectPrimitive.Listbox class="max-h-72 overflow-y-auto p-1.5 outline-none" />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
