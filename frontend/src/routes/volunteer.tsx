/**
 * Firefighting-volunteer registration: five fields, no account. On success
 * the identity is stored locally; `?join={groupId}` auto-joins that group.
 */
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { TbOutlineFlame, TbOutlineUserCheck } from "solid-icons/tb";
import { Show, createSignal } from "solid-js";

import { Field, FormError, TextInput } from "~/components/form";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";
import { getVolunteer, saveVolunteer, volunteerHeaders } from "~/lib/volunteer";

export default function VolunteerPage() {
  const { t, tError } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [neighborhood, setNeighborhood] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const existing = getVolunteer();

  const joinTarget = () => {
    const raw = Array.isArray(params.join) ? params.join[0] : params.join;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
  };

  const afterRegistered = async () => {
    const groupId = joinTarget();
    if (groupId !== null) {
      try {
        await apiFetch(`/api/groups/${groupId}/join`, {
          method: "POST",
          headers: volunteerHeaders(),
        });
        navigate(`/groups/${groupId}?joined=1`);
        return;
      } catch {
        // Group vanished or join failed — fall back to the browse list.
      }
    }
    navigate("/groups?registered=1");
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const created = await apiFetch<{ id: number; token: string }>("/api/volunteers", {
        method: "POST",
        body: {
          first_name: firstName(),
          last_name: lastName(),
          phone: phone(),
          wilaya_code: wilaya(),
          commune_id: commune(),
          neighborhood: neighborhood(),
        },
      });
      saveVolunteer({ id: created.id, token: created.token, firstName: firstName().trim() });
      await afterRegistered();
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-lg space-y-8">
      <PageHeader icon={TbOutlineFlame} title={t("volunteer.title")} subtitle={t("volunteer.intro")} />

      <Show when={existing}>
        {(identity) => (
          <div class="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-xs">
            <p class="flex items-center gap-2.5 text-[15px]">
              <TbOutlineUserCheck size={22} class="shrink-0 text-primary" aria-hidden="true" />
              {t("volunteer.alreadyRegistered", { name: identity().firstName })}
            </p>
            <Button
              as={A}
              href={joinTarget() !== null ? `/groups/${joinTarget()}` : "/groups"}
              size="lg"
              class="text-base"
            >
              {t("volunteer.browseGroups")}
            </Button>
          </div>
        )}
      </Show>

      <Show when={!existing}>
        <form class="space-y-5" onSubmit={submit}>
          <div class="grid gap-5 sm:grid-cols-2">
            <Field label={t("common.firstName")}>
              <TextInput
                required
                value={firstName()}
                onInput={(e) => setFirstName(e.currentTarget.value)}
              />
            </Field>
            <Field label={t("common.lastName")}>
              <TextInput
                required
                value={lastName()}
                onInput={(e) => setLastName(e.currentTarget.value)}
              />
            </Field>
          </div>
          <Field label={t("common.phone")} hint={t("common.phoneExample")}>
            <TextInput
              required
              type="tel"
              dir="ltr"
              value={phone()}
              onInput={(e) => setPhone(e.currentTarget.value)}
            />
          </Field>
          <Field label={t("common.wilaya")}>
            <WilayaSelect
              required
              value={wilaya()}
              onChange={(v) => {
                setWilaya(v);
                setCommune(null);
              }}
            />
          </Field>
          <Field label={t("common.commune")}>
            <CommuneSelect required wilaya={wilaya()} value={commune()} onChange={setCommune} />
          </Field>
          <Field label={t("common.neighborhood")} hint={t("common.optional")}>
            <TextInput
              value={neighborhood()}
              onInput={(e) => setNeighborhood(e.currentTarget.value)}
            />
          </Field>
          <FormError message={error()} />
          <Button type="submit" size="lg" class="h-13 w-full text-base" disabled={busy()}>
            {busy() ? t("common.sending") : t("volunteer.submit")}
          </Button>
        </form>
      </Show>
    </div>
  );
}
