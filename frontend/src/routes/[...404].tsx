import { A } from "@solidjs/router";
import { TbOutlineMapQuestion } from "solid-icons/tb";

import { buttonVariants } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div class="flex flex-col items-center gap-6 py-20 text-center">
      <span class="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <TbOutlineMapQuestion size={34} aria-hidden="true" />
      </span>
      <p class="text-lg text-muted-foreground">{t("common.notFound")}</p>
      <A href="/" class={buttonVariants({ size: "lg" })}>
        {t("common.backHome")}
      </A>
    </div>
  );
}
