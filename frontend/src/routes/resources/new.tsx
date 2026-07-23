/** Offer resources: 4 fields + tap-to-toggle category chips. */
import { A, useNavigate } from "@solidjs/router";
import { TbOutlineCheck, TbOutlinePackage } from "solid-icons/tb";
import { For, Show, createSignal } from "solid-js";

import { Field, FormError, TextArea, TextInput } from "~/components/form";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { type MessageKey, useI18n } from "~/lib/i18n";
import { RESOURCE_CATEGORIES } from "~/lib/types";

export default function NewResourcePage() {
  const { t, tError } = useI18n();
  const navigate = useNavigate();

  const [fullName, setFullName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [neighborhood, setNeighborhood] = createSignal("");
  const [categories, setCategories] = createSignal<string[]>([]);
  const [details, setDetails] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const toggleCategory = (category: string) => {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await apiFetch<{ id: number }>("/api/resources", {
        method: "POST",
        body: {
          full_name: fullName(),
          phone: phone(),
          wilaya_code: wilaya(),
          commune_id: commune(),
          neighborhood: neighborhood(),
          categories: categories(),
          details: details(),
        },
      });
      navigate("/resources?submitted=1");
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-lg space-y-8">
      <PageHeader
        icon={TbOutlinePackage}
        title={t("resources.offerTitle")}
        subtitle={t("resources.offerIntro")}
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
          <legend class="text-[15px] font-semibold leading-none">
            {t("resources.categoriesLabel")}
          </legend>
          <div class="flex flex-wrap gap-2">
            <For each={RESOURCE_CATEGORIES}>
              {(category) => {
                const active = () => categories().includes(category);
                return (
                  <button
                    type="button"
                    class="flex min-h-11 items-center gap-1.5 rounded-lg border-2 px-4 py-2 text-[15px] font-medium transition-colors"
                    classList={{
                      "border-primary bg-primary text-primary-foreground": active(),
                      "border-input bg-card hover:border-ring/50": !active(),
                    }}
                    aria-pressed={active()}
                    onClick={() => toggleCategory(category)}
                  >
                    <Show when={active()}>
                      <TbOutlineCheck size={18} aria-hidden="true" />
                    </Show>
                    {t(`resources.category.${category}` as MessageKey)}
                  </button>
                );
              }}
            </For>
          </div>
        </fieldset>

        <Field label={t("resources.detailsLabel")} hint={t("common.optional")}>
          <TextArea value={details()} onInput={(e) => setDetails(e.currentTarget.value)} />
        </Field>

        <FormError message={error()} />
        <Button type="submit" size="lg" class="h-13 w-full text-base" disabled={busy()}>
          {busy() ? t("common.sending") : t("resources.submit")}
        </Button>
      </form>

      <p class="text-center text-[15px]">
        <A href="/resources" class="font-medium text-primary underline-offset-4 hover:underline">
          {t("resources.title")}
        </A>
      </p>
    </div>
  );
}
