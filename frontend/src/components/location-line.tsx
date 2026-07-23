import { TbOutlineMapPin } from "solid-icons/tb";
import { Show } from "solid-js";

import { useI18n } from "~/lib/i18n";

/**
 * One-line location string with a map-pin icon: parts joined with the
 * locale's comma, optional trailing time. Used on every card in the app.
 */
export function LocationLine(props: {
  parts: (string | undefined | null)[];
  time?: string;
  class?: string;
}) {
  const { locale } = useI18n();
  const text = () =>
    props.parts
      .filter((p): p is string => Boolean(p && p.trim()))
      .join(locale() === "ar" ? "، " : ", ");

  return (
    <p class={`flex items-center gap-1.5 text-sm text-muted-foreground ${props.class ?? ""}`}>
      <TbOutlineMapPin size={17} class="shrink-0" aria-hidden="true" />
      <span class="truncate">{text()}</span>
      <Show when={props.time}>
        <span class="shrink-0">· {props.time}</span>
      </Show>
    </p>
  );
}
