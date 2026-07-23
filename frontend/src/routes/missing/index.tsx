/** Public missing-person reports: photo cards, browse, call the reporter. */
import { A, useSearchParams } from "@solidjs/router";
import { TbOutlineSearch, TbOutlineUser } from "solid-icons/tb";
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
import type { MissingPerson } from "~/lib/types";

export default function MissingPersonsPage() {
  const { t, pick, locale } = useI18n();
  const [params] = useSearchParams();
  const [wilaya, setWilaya] = createSignal<number | null>(null);

  const [reports] = createResource(
    () => wilaya(),
    (w) => apiFetch<MissingPerson[]>(`/api/missing-persons${w === null ? "" : `?wilaya=${w}`}`),
  );

  return (
    <div class="space-y-6">
      <PageHeader
        icon={TbOutlineSearch}
        title={t("missing.title")}
        action={
          <Button as={A} href="/missing/new" size="lg">
            {t("missing.reportCta")}
          </Button>
        }
      />

      <FormSuccess message={params.submitted ? t("missing.success") : null} />

      <div class="max-w-xs">
        <Field label={t("common.wilaya")}>
          <WilayaSelect allowAll value={wilaya()} onChange={setWilaya} />
        </Field>
      </div>

      <Show
        when={reports()}
        fallback={
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            <For each={[0, 1, 2]}>
              {() => (
                <div class="overflow-hidden rounded-xl border bg-card shadow-xs">
                  <div class="h-52 animate-pulse bg-muted" />
                  <div class="space-y-3 p-4">
                    <div class="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
                    <div class="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              )}
            </For>
          </div>
        }
      >
        {(list) => (
          <Show
            when={list().length > 0}
            fallback={<EmptyState icon={TbOutlineSearch} message={t("missing.empty")} />}
          >
            <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <For each={list()}>
                {(report) => (
                  <li class="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs">
                    <Show
                      when={report.photo_url}
                      fallback={
                        <div class="flex h-52 items-center justify-center bg-muted text-muted-foreground">
                          <TbOutlineUser size={56} aria-hidden="true" />
                        </div>
                      }
                    >
                      {(url) => (
                        <img
                          src={url()}
                          alt={`${report.first_name} ${report.last_name}`}
                          class="h-52 w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </Show>
                    <div class="flex flex-1 flex-col gap-2.5 p-4">
                      <p class="text-lg font-bold leading-snug">
                        {report.first_name} {report.last_name}
                      </p>
                      <div class="space-y-1">
                        <p class="text-sm font-medium text-muted-foreground">
                          {t("missing.lastSeen")}
                        </p>
                        <LocationLine
                          parts={[
                            pick({ ar: report.wilaya_name_ar, fr: report.wilaya_name_fr }),
                            pick({ ar: report.commune_name_ar, fr: report.commune_name_fr }),
                            report.last_seen_details,
                          ]}
                          time={timeAgo(report.created_at, locale())}
                        />
                      </div>
                      <Show when={report.description}>
                        <p class="text-[15px] leading-relaxed">{report.description}</p>
                      </Show>
                      <div class="mt-auto space-y-1.5 pt-2">
                        <p class="text-sm font-semibold">{t("missing.haveInfo")}</p>
                        <CallButton phone={report.contact_phone} class="w-full" />
                      </div>
                    </div>
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
