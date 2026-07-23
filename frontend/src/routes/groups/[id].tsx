/**
 * Group page. Fetched on the client so the volunteer token / leader cookie can
 * unlock the member tier (the token lives in localStorage, unavailable in SSR).
 */
import { A, useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { TbOutlineLock, TbOutlineShieldCheck, TbOutlineUser, TbOutlineUsers, TbOutlineUsersGroup } from "solid-icons/tb";
import { For, Show, createSignal, onMount } from "solid-js";

import { CallButton } from "~/components/call-button";
import { FormError, FormSuccess } from "~/components/form";
import { LocationLine } from "~/components/location-line";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { timeAgo, useI18n } from "~/lib/i18n";
import type { GroupDetail } from "~/lib/types";
import { getVolunteer, volunteerHeaders } from "~/lib/volunteer";

export default function GroupPage() {
  const { t, tError, pick, locale } = useI18n();
  const params = useParams();
  const [query] = useSearchParams();
  const navigate = useNavigate();

  const [group, setGroup] = createSignal<GroupDetail | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [joining, setJoining] = createSignal(false);
  const [justJoined, setJustJoined] = createSignal(Boolean(query.joined));

  const load = async () => {
    try {
      setGroup(
        await apiFetch<GroupDetail>(`/api/groups/${params.id}`, { headers: volunteerHeaders() }),
      );
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    }
  };
  onMount(load);

  const join = async () => {
    if (!getVolunteer()) {
      navigate(`/volunteer?join=${params.id}`);
      return;
    }
    setJoining(true);
    try {
      await apiFetch(`/api/groups/${params.id}/join`, {
        method: "POST",
        headers: volunteerHeaders(),
      });
      setJustJoined(true);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setJoining(false);
    }
  };

  return (
    <div class="mx-auto max-w-2xl space-y-6">
      <FormError message={error()} />

      <Show
        when={group()}
        fallback={
          <div class="space-y-3" aria-hidden="true">
            <div class="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
            <div class="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div class="h-40 animate-pulse rounded-xl bg-muted" />
          </div>
        }
      >
        {(g) => (
          <>
            <PageHeader icon={TbOutlineUsersGroup} title={g().name} />
            <div class="space-y-2 rounded-xl border bg-card p-5 shadow-xs">
              <LocationLine
                parts={[
                  pick({ ar: g().wilaya_name_ar, fr: g().wilaya_name_fr }),
                  pick({ ar: g().commune_name_ar, fr: g().commune_name_fr }),
                  g().neighborhood,
                ]}
              />
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span class="flex items-center gap-1.5">
                  <TbOutlineUser size={17} aria-hidden="true" />
                  {t("groups.leader", { name: g().leader_first_name })}
                </span>
                <span class="flex items-center gap-1.5 font-medium text-foreground">
                  <TbOutlineUsers size={17} aria-hidden="true" />
                  {t("common.members", { count: g().member_count })}
                </span>
              </div>
            </div>

            <FormSuccess message={justJoined() ? t("groups.joinSuccess") : null} />

            <Show when={g().viewer === "public"}>
              <div class="space-y-4 rounded-xl border border-primary/30 bg-card p-6 shadow-xs">
                <p class="flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  <TbOutlineLock size={20} class="mt-0.5 shrink-0" aria-hidden="true" />
                  {t("group.publicHint")}
                </p>
                <Button size="lg" class="h-13 w-full text-base" disabled={joining()} onClick={join}>
                  {t("groups.join")}
                </Button>
              </div>
            </Show>

            <Show when={g().leader_phone}>
              {(leaderPhone) => (
                <section class="space-y-3 rounded-xl border bg-card p-5 shadow-xs">
                  <h2 class="flex items-center gap-2 text-lg font-bold">
                    <TbOutlineShieldCheck size={22} class="text-primary" aria-hidden="true" />
                    {t("group.leaderContact")}
                  </h2>
                  <p class="text-[15px] font-medium">
                    {g().leader_first_name} {g().leader_last_name}
                  </p>
                  <CallButton phone={leaderPhone()} />
                </section>
              )}
            </Show>

            <Show when={g().members}>
              {(members) => (
                <section class="space-y-3">
                  <h2 class="text-lg font-bold">{t("group.membersTitle")}</h2>
                  <Show
                    when={members().length > 0}
                    fallback={<p class="text-[15px] text-muted-foreground">{t("group.noMembers")}</p>}
                  >
                    <ul class="space-y-3">
                      <For each={members()}>
                        {(member) => (
                          <li class="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-xs">
                            <div class="space-y-1">
                              <p class="font-semibold">
                                {member.first_name} {member.last_name}
                              </p>
                              <LocationLine
                                parts={[
                                  pick({ ar: member.wilaya_name_ar, fr: member.wilaya_name_fr }),
                                  pick({ ar: member.commune_name_ar, fr: member.commune_name_fr }),
                                  member.neighborhood,
                                ]}
                                time={timeAgo(member.joined_at, locale())}
                              />
                            </div>
                            <CallButton phone={member.phone} />
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </section>
              )}
            </Show>

            <Show when={g().viewer === "leader"}>
              <Button as={A} href="/leader" variant="outline" size="lg" class="w-full">
                {t("leader.dashboard")}
              </Button>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}
