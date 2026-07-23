/**
 * Leader dashboard: own group, join notifications (polled every 30 s and
 * marked read once shown), member list with call buttons, logout.
 */
import { A, useNavigate } from "@solidjs/router";
import { TbOutlineBell, TbOutlineLogout, TbOutlineShieldCheck, TbOutlineUsers } from "solid-icons/tb";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import { CallButton } from "~/components/call-button";
import { LocationLine } from "~/components/location-line";
import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { timeAgo, useI18n } from "~/lib/i18n";
import type { GroupDetail, LeaderNotification, Me } from "~/lib/types";

const POLL_INTERVAL_MS = 30_000;

export default function LeaderDashboard() {
  const { t, pick, locale } = useI18n();
  const navigate = useNavigate();

  const [me, setMe] = createSignal<Me | null>(null);
  const [notifications, setNotifications] = createSignal<LeaderNotification[]>([]);
  const [group, setGroup] = createSignal<GroupDetail | null>(null);

  const refresh = async () => {
    try {
      const current = await apiFetch<Me>("/api/leader/me");
      setMe(current);
      const list = await apiFetch<LeaderNotification[]>("/api/leader/notifications");
      setNotifications(list);
      setGroup(await apiFetch<GroupDetail>(`/api/groups/${current.group.id}`));
      if (list.some((n) => !n.read)) {
        // Shown = read; the unread badge only counts joins since the last look.
        await apiFetch("/api/leader/notifications/read", { method: "POST" });
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/leader/login");
      }
    }
  };

  onMount(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), POLL_INTERVAL_MS);
    onCleanup(() => clearInterval(timer));
  });

  const logout = async () => {
    await apiFetch("/api/leader/logout", { method: "POST" });
    navigate("/");
  };

  return (
    <Show
      when={me()}
      fallback={
        <div class="mx-auto max-w-2xl space-y-3" aria-hidden="true">
          <div class="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
          <div class="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
          <div class="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      {(current) => (
        <div class="mx-auto max-w-2xl space-y-8">
          <PageHeader
            icon={TbOutlineShieldCheck}
            title={current().group.name}
            action={
              <div class="flex gap-2">
                <Button as={A} href={`/groups/${current().group.id}`} variant="outline">
                  {t("leader.viewPublicPage")}
                </Button>
                <Button variant="ghost" onClick={() => void logout()} class="gap-2">
                  <TbOutlineLogout size={18} aria-hidden="true" />
                  {t("leader.logout")}
                </Button>
              </div>
            }
          />

          <div class="space-y-2 rounded-xl border bg-card p-5 shadow-xs">
            <LocationLine
              parts={[
                pick({ ar: current().group.wilaya_name_ar, fr: current().group.wilaya_name_fr }),
                pick({ ar: current().group.commune_name_ar, fr: current().group.commune_name_fr }),
                current().group.neighborhood,
              ]}
            />
            <p class="flex items-center gap-1.5 text-sm font-medium">
              <TbOutlineUsers size={17} aria-hidden="true" />
              {t("common.members", { count: current().group.member_count })}
            </p>
          </div>

          <section class="space-y-3">
            <h2 class="flex items-center gap-2.5 text-lg font-bold">
              <TbOutlineBell size={22} class="text-primary" aria-hidden="true" />
              {t("leader.notifications")}
              <Show when={current().unread_notifications > 0}>
                <Badge round>{t("leader.unread", { count: current().unread_notifications })}</Badge>
              </Show>
            </h2>
            <Show
              when={notifications().length > 0}
              fallback={
                <p class="rounded-xl border border-dashed bg-card/50 px-5 py-8 text-center text-[15px] text-muted-foreground">
                  {t("leader.noNotifications")}
                </p>
              }
            >
              <ul class="space-y-3">
                <For each={notifications()}>
                  {(n) => (
                    <li
                      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-xs"
                      classList={{ "border-primary/40 bg-primary/5": !n.read }}
                    >
                      <div class="space-y-1">
                        <p class="font-semibold">
                          {t("leader.joinedYourGroup", { name: `${n.first_name} ${n.last_name}` })}
                        </p>
                        <LocationLine
                          parts={[
                            pick({ ar: n.wilaya_name_ar, fr: n.wilaya_name_fr }),
                            pick({ ar: n.commune_name_ar, fr: n.commune_name_fr }),
                            n.neighborhood,
                          ]}
                          time={timeAgo(n.created_at, locale())}
                        />
                      </div>
                      <CallButton phone={n.phone} />
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </section>

          <section class="space-y-3">
            <h2 class="flex items-center gap-2.5 text-lg font-bold">
              <TbOutlineUsers size={22} class="text-primary" aria-hidden="true" />
              {t("leader.membersTitle")}
            </h2>
            <Show
              when={(group()?.members?.length ?? 0) > 0}
              fallback={
                <p class="rounded-xl border border-dashed bg-card/50 px-5 py-8 text-center text-[15px] text-muted-foreground">
                  {t("group.noMembers")}
                </p>
              }
            >
              <ul class="space-y-3">
                <For each={group()?.members}>
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
                        />
                      </div>
                      <CallButton phone={member.phone} />
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </section>
        </div>
      )}
    </Show>
  );
}
