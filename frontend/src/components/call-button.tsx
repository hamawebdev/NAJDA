import { TbOutlinePhone } from "solid-icons/tb";

import { buttonVariants } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";
import { cn } from "~/lib/utils";

/** A `tel:` link styled as a prominent button — one tap to call. */
export function CallButton(props: { phone: string; class?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={`tel:${props.phone}`}
      class={cn(buttonVariants({ size: "lg" }), "gap-2.5 text-base", props.class)}
    >
      <TbOutlinePhone size={20} aria-hidden="true" />
      {t("common.call")}
      <span dir="ltr" class="font-semibold tabular-nums">
        {props.phone}
      </span>
    </a>
  );
}
