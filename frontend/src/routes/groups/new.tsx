/** Group creation — the only account on the platform. Logs the leader in. */
import { A, useNavigate } from "@solidjs/router";
import { TbOutlineShieldPlus } from "solid-icons/tb";
import { createSignal } from "solid-js";

import { Field, FormError, TextInput } from "~/components/form";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";

export default function NewGroupPage() {
  const { t, tError } = useI18n();
  const navigate = useNavigate();

  const [groupName, setGroupName] = createSignal("");
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [neighborhood, setNeighborhood] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await apiFetch<{ id: number }>("/api/groups", {
        method: "POST",
        body: {
          name: groupName(),
          leader_first_name: firstName(),
          leader_last_name: lastName(),
          leader_phone: phone(),
          password: password(),
          wilaya_code: wilaya(),
          commune_id: commune(),
          neighborhood: neighborhood(),
        },
      });
      navigate("/leader");
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-lg space-y-8">
      <PageHeader
        icon={TbOutlineShieldPlus}
        title={t("createGroup.title")}
        subtitle={t("createGroup.intro")}
      />

      <form class="space-y-5" onSubmit={submit}>
        <Field label={t("createGroup.groupName")}>
          <TextInput
            required
            value={groupName()}
            onInput={(e) => setGroupName(e.currentTarget.value)}
          />
        </Field>
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
        <Field label={t("common.password")}>
          <TextInput
            required
            type="password"
            minLength={6}
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
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
          {busy() ? t("common.sending") : t("createGroup.submit")}
        </Button>
      </form>

      <p class="text-center text-[15px]">
        <A href="/leader/login" class="font-medium text-primary underline-offset-4 hover:underline">
          {t("createGroup.haveAccount")}
        </A>
      </p>
    </div>
  );
}
