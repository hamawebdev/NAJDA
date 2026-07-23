/** Request help: 4 fields + quick-fill chips that append to the needs text. */
import { useNavigate } from "@solidjs/router";
import { TbOutlineHeartHandshake, TbOutlinePlus } from "solid-icons/tb";
import { For, createSignal } from "solid-js";

import { Field, FormError, TextArea, TextInput } from "~/components/form";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { type MessageKey, useI18n } from "~/lib/i18n";
import { HELP_CHIPS } from "~/lib/types";

export default function NewHelpRequestPage() {
  const { t, tError, locale } = useI18n();
  const navigate = useNavigate();

  const [fullName, setFullName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [neighborhood, setNeighborhood] = createSignal("");
  const [needs, setNeeds] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const appendChip = (chip: string) => {
    const label = t(`help.chip.${chip}` as MessageKey);
    const current = needs().trim();
    if (current.includes(label)) return;
    const separator = locale() === "ar" ? "، " : ", ";
    setNeeds(current ? `${current}${separator}${label}` : label);
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await apiFetch<{ id: number }>("/api/help-requests", {
        method: "POST",
        body: {
          full_name: fullName(),
          phone: phone(),
          wilaya_code: wilaya(),
          commune_id: commune(),
          neighborhood: neighborhood(),
          needs: needs(),
        },
      });
      navigate("/help?submitted=1");
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-lg space-y-8">
      <PageHeader
        icon={TbOutlineHeartHandshake}
        title={t("help.requestTitle")}
        subtitle={t("help.requestIntro")}
      />

      <form class="space-y-5" onSubmit={submit}>
        <Field label={t("common.fullName")}>
          <TextInput
            required
            value={fullName()}
            onInput={(e) => setFullName(e.currentTarget.value)}
          />
        </Field>
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

        <fieldset class="space-y-2.5">
          <legend class="text-[15px] font-semibold leading-none">{t("help.needsLabel")}</legend>
          <div class="flex flex-wrap gap-2">
            <For each={HELP_CHIPS}>
              {(chip) => (
                <button
                  type="button"
                  class="flex min-h-11 items-center gap-1.5 rounded-lg border-2 border-input bg-card px-4 py-2 text-[15px] font-medium transition-colors hover:border-ring/50"
                  onClick={() => appendChip(chip)}
                >
                  <TbOutlinePlus size={17} aria-hidden="true" />
                  {t(`help.chip.${chip}` as MessageKey)}
                </button>
              )}
            </For>
          </div>
          <TextArea
            required
            placeholder={t("help.needsPlaceholder")}
            value={needs()}
            onInput={(e) => setNeeds(e.currentTarget.value)}
          />
        </fieldset>

        <FormError message={error()} />
        <Button type="submit" size="lg" class="h-13 w-full text-base" disabled={busy()}>
          {busy() ? t("common.sending") : t("help.submit")}
        </Button>
      </form>
    </div>
  );
}
