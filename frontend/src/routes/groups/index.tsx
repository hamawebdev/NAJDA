/** Browse volunteer groups: filter by wilaya/commune/neighborhood, join in one tap. */
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { TbOutlineSearch, TbOutlineUser, TbOutlineUsers, TbOutlineUsersGroup } from "solid-icons/tb";
import { For, Show, createResource, createSignal } from "solid-js";

import { EmptyState } from "~/components/empty-state";
import { Field, FormSuccess, TextInput } from "~/components/form";
import { LocationLine } from "~/components/location-line";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";
import type { GroupSummary } from "~/lib/types";
import { getVolunteer, volunteerHeaders } from "~/lib/volunteer";

export default function GroupsPage() {
  const { t, pick } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [neighborhood, setNeighborhood] = createSignal("");
  const [joining, setJoining] = createSignal<number | null>(null);

  const [groups] = createResource(
    () => ({ wilaya: wilaya(), commune: commune(), neighborhood: neighborhood().trim() }),
    (filter) => {
      const query = new URLSearchParams();
      if (filter.wilaya !== null) query.set("wilaya", String(filter.wilaya));
      if (filter.commune !== null) query.set("commune", String(filter.commune));
      if (filter.neighborhood) query.set("neighborhood", filter.neighborhood);
      const suffix = query.size > 0 ? `?${query}` : "";
      return apiFetch<GroupSummary[]>(`/api/groups${suffix}`);
    },
  );

  const join = async (groupId: number) => {
    if (!getVolunteer()) {
      navigate(`/volunteer?join=${groupId}`);
      return;
    }
    setJoining(groupId);
    try {
      await apiFetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: volunteerHeaders(),
      });
      navigate(`/groups/${groupId}?joined=1`);
    } catch {
      navigate(`/volunteer?join=${groupId}`);
    } finally {
      setJoining(null);
    }
  };

  return (
    <div class="space-y-6">
      <PageHeader
        icon={TbOutlineUsersGroup}
        title={t("groups.title")}
        subtitle={t("groups.filterHint")}
        action={
          <Button as={A} href="/groups/new" variant="outline" size="lg">
            {t("groups.createCta")}
          </Button>
        }
      />

      <FormSuccess message={params.registered ? t("volunteer.registered") : null} />

      <section class="grid gap-4 rounded-xl border bg-card p-5 shadow-xs sm:grid-cols-3">
        <Field label={t("common.wilaya")}>
          <WilayaSelect
            allowAll
            value={wilaya()}
            onChange={(v) => {
              setWilaya(v);
              setCommune(null);
            }}
          />
        </Field>
        <Field label={t("common.commune")}>
          <CommuneSelect allowAll wilaya={wilaya()} value={commune()} onChange={setCommune} />
        </Field>
        <Field label={t("common.neighborhood")}>
          <TextInput
            placeholder={t("groups.neighborhoodSearch")}
            value={neighborhood()}
            onInput={(e) => setNeighborhood(e.currentTarget.value)}
          />
        </Field>
      </section>

      <Show when={groups()} fallback={<GroupsSkeleton />}>
        {(list) => (
          <Show
            when={list().length > 0}
            fallback={
              <EmptyState icon={TbOutlineSearch} message={t("groups.empty")}>
                <Button as={A} href="/groups/new" size="lg">
                  {t("groups.createCta")}
                </Button>
              </EmptyState>
            }
          >
            <ul class="grid gap-4 sm:grid-cols-2">
              <For each={list()}>
                {(group) => (
                  <li class="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
                    <div class="space-y-2">
                      <A
                        href={`/groups/${group.id}`}
                        class="text-lg font-bold leading-snug hover:text-primary"
                      >
                        {group.name}
                      </A>
                      <LocationLine
                        parts={[
                          pick({ ar: group.wilaya_name_ar, fr: group.wilaya_name_fr }),
                          pick({ ar: group.commune_name_ar, fr: group.commune_name_fr }),
                          group.neighborhood,
                        ]}
                      />
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                          <TbOutlineUser size={17} aria-hidden="true" />
                          {t("groups.leader", { name: group.leader_first_name })}
                        </span>
                        <span class="flex items-center gap-1.5 font-medium text-foreground">
                          <TbOutlineUsers size={17} aria-hidden="true" />
                          {t("common.members", { count: group.member_count })}
                        </span>
                      </div>
                    </div>
                    <div class="mt-auto flex gap-2.5">
                      <Button
                        size="lg"
                        class="flex-1 text-base"
                        disabled={joining() === group.id}
                        onClick={() => join(group.id)}
                      >
                        {t("groups.join")}
                      </Button>
                      <Button as={A} href={`/groups/${group.id}`} variant="outline" size="lg">
                        {t("groups.view")}
                      </Button>
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

function GroupsSkeleton() {
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
