/** Public list of resource offers, filterable by wilaya, call in one tap. */
import { A, useSearchParams } from "@solidjs/router";
import { TbOutlinePackage } from "solid-icons/tb";
import { For, Show, createResource, createSignal } from "solid-js";

import { CallButton } from "~/components/call-button";
import { EmptyState } from "~/components/empty-state";
import { Field, FormSuccess } from "~/components/form";
import { LocationLine } from "~/components/location-line";
import { WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { apiFetch } from "~/lib/api";
import { type MessageKey, timeAgo, useI18n } from "~/lib/i18n";
import type { ResourceOffer } from "~/lib/types";

export default function ResourcesPage() {
  const { t, pick, locale } = useI18n();
  const [params] = useSearchParams();
  const [wilaya, setWilaya] = createSignal<number | null>(null);

  const [offers] = createResource(
    () => wilaya(),
    (w) => apiFetch<ResourceOffer[]>(`/api/resources${w === null ? "" : `?wilaya=${w}`}`),
  );

  return (
    <div class="space-y-6">
      <PageHeader
        icon={TbOutlinePackage}
        title={t("resources.title")}
        action={
          <Button as={A} href="/resources/new" size="lg">
            {t("resources.offerCta")}
          </Button>
        }
      />

      <FormSuccess message={params.submitted ? t("resources.success") : null} />

      <div class="max-w-xs">
        <Field label={t("common.wilaya")}>
          <WilayaSelect allowAll value={wilaya()} onChange={setWilaya} />
        </Field>
      </div>

      <Show when={offers()} fallback={<ListSkeleton />}>
        {(list) => (
          <Show
            when={list().length > 0}
            fallback={<EmptyState icon={TbOutlinePackage} message={t("resources.empty")} />}
          >
            <ul class="grid gap-4 sm:grid-cols-2">
              <For each={list()}>
                {(offer) => (
                  <li class="flex flex-col gap-3.5 rounded-xl border bg-card p-5 shadow-xs">
                    <div class="space-y-1.5">
                      <p class="text-lg font-bold leading-snug">{offer.full_name}</p>
                      <LocationLine
                        parts={[
                          pick({ ar: offer.wilaya_name_ar, fr: offer.wilaya_name_fr }),
                          pick({ ar: offer.commune_name_ar, fr: offer.commune_name_fr }),
                          offer.neighborhood,
                        ]}
                        time={timeAgo(offer.created_at, locale())}
                      />
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <For each={offer.categories}>
                        {(category) => (
                          <Badge variant="secondary" class="px-3 py-1 text-[13px]">
                            {t(`resources.category.${category}` as MessageKey)}
                          </Badge>
                        )}
                      </For>
                    </div>
                    <Show when={offer.details}>
                      <p class="text-[15px] leading-relaxed">{offer.details}</p>
                    </Show>
                    <CallButton phone={offer.phone} class="mt-auto" />
                  </li>
                )}
              </For>
            </ul>
          </Show>
        )}
      </Show>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div class="grid gap-4 sm:grid-cols-2" aria-hidden="true">
      <For each={[0, 1, 2, 3]}>
        {() => (
          <div class="space-y-3 rounded-xl border bg-card p-5 shadow-xs">
            <div class="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
            <div class="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div class="h-11 animate-pulse rounded-lg bg-muted" />
          </div>
        )}
      </For>
    </div>
  );
}
