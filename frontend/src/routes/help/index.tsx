/** Public list of help requests from affected families. */
import { A, useSearchParams } from "@solidjs/router";
import { TbOutlineHeartHandshake } from "solid-icons/tb";
import { For, Show, createResource, createSignal } from "solid-js";

import { CallButton } from "~/components/call-button";
import { EmptyState } from "~/components/empty-state";
import { Field, FormSuccess } from "~/components/form";
import { LocationLine } from "~/components/location-line";
import { WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { apiFetch } from "~/lib/api";
import { timeAgo, useI18n } from "~/lib/i18n";
import type { HelpRequest } from "~/lib/types";

export default function HelpRequestsPage() {
  const { t, pick, locale } = useI18n();
  const [params] = useSearchParams();
  const [wilaya, setWilaya] = createSignal<number | null>(null);

  const [requests] = createResource(
    () => wilaya(),
    (w) => apiFetch<HelpRequest[]>(`/api/help-requests${w === null ? "" : `?wilaya=${w}`}`),
  );

  return (
    <div class="space-y-6">
      <PageHeader
        icon={TbOutlineHeartHandshake}
        title={t("help.title")}
        action={
          <Button as={A} href="/help/new" size="lg">
            {t("help.requestCta")}
          </Button>
        }
      />

      <FormSuccess message={params.submitted ? t("help.success") : null} />

      <div class="max-w-xs">
        <Field label={t("common.wilaya")}>
          <WilayaSelect allowAll value={wilaya()} onChange={setWilaya} />
        </Field>
      </div>

      <Show
        when={requests()}
        fallback={
          <div class="space-y-4" aria-hidden="true">
            <For each={[0, 1, 2]}>
              {() => (
                <div class="space-y-3 rounded-xl border bg-card p-5 shadow-xs">
                  <div class="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
                  <div class="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
                </div>
              )}
            </For>
          </div>
        }
      >
        {(list) => (
          <Show
            when={list().length > 0}
            fallback={<EmptyState icon={TbOutlineHeartHandshake} message={t("help.empty")} />}
          >
            <ul class="space-y-4">
              <For each={list()}>
                {(request) => (
                  <li class="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-xs">
                    <div class="min-w-0 flex-1 space-y-2">
                      <p class="text-lg font-bold leading-snug">{request.full_name}</p>
                      <LocationLine
                        parts={[
                          pick({ ar: request.wilaya_name_ar, fr: request.wilaya_name_fr }),
                          pick({ ar: request.commune_name_ar, fr: request.commune_name_fr }),
                          request.neighborhood,
                        ]}
                        time={timeAgo(request.created_at, locale())}
                      />
                      <p class="whitespace-pre-wrap text-[15px] leading-relaxed">{request.needs}</p>
                    </div>
                    <CallButton phone={request.phone} />
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
