/** Report a missing person — multipart form with an optional photo. */
import { useNavigate } from "@solidjs/router";
import { TbOutlineCamera, TbOutlineSearch } from "solid-icons/tb";
import { Show, createSignal } from "solid-js";

import { Field, FormError, TextArea, TextInput } from "~/components/form";
import { CommuneSelect, WilayaSelect } from "~/components/location-select";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewMissingPersonPage() {
  const { t, tError } = useI18n();
  const navigate = useNavigate();

  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [photo, setPhoto] = createSignal<File | null>(null);
  const [photoPreview, setPhotoPreview] = createSignal<string | null>(null);
  const [wilaya, setWilaya] = createSignal<number | null>(null);
  const [commune, setCommune] = createSignal<number | null>(null);
  const [lastSeenDetails, setLastSeenDetails] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [contactPhone, setContactPhone] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const onPhotoChange = (input: HTMLInputElement) => {
    setError(null);
    const file = input.files?.[0] ?? null;
    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }
    if (!PHOTO_TYPES.includes(file.type)) {
      input.value = "";
      setError(tError("invalid_photo"));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      input.value = "";
      setError(tError("photo_too_large"));
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const form = new FormData();
      form.set("first_name", firstName());
      form.set("last_name", lastName());
      form.set("wilaya_code", String(wilaya() ?? ""));
      form.set("commune_id", String(commune() ?? ""));
      form.set("last_seen_details", lastSeenDetails());
      form.set("description", description());
      form.set("contact_phone", contactPhone());
      const file = photo();
      if (file) form.set("photo", file);

      await apiFetch<{ id: number }>("/api/missing-persons", {
        method: "POST",
        formData: form,
      });
      navigate("/missing?submitted=1");
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-lg space-y-8">
      <PageHeader
        icon={TbOutlineSearch}
        title={t("missing.reportTitle")}
        subtitle={t("missing.reportIntro")}
      />

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

        <Field label={t("missing.photo")} hint={t("common.optional")}>
          <label class="flex min-h-13 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-input bg-card px-4 py-3 transition-colors hover:border-ring/50">
            <TbOutlineCamera size={24} class="shrink-0 text-muted-foreground" aria-hidden="true" />
            <span class="text-[15px] text-muted-foreground">
              {photo()?.name ?? t("missing.photo")}
            </span>
            <input
              type="file"
              accept={PHOTO_TYPES.join(",")}
              class="sr-only"
              onChange={(e) => onPhotoChange(e.currentTarget)}
            />
          </label>
        </Field>
        <Show when={photoPreview()}>
          {(url) => <img src={url()} alt="" class="h-44 rounded-lg border object-cover" />}
        </Show>

        <Field label={`${t("missing.lastSeen")}: ${t("common.wilaya")}`}>
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
        <Field label={t("missing.lastSeenDetails")} hint={t("common.optional")}>
          <TextInput
            value={lastSeenDetails()}
            onInput={(e) => setLastSeenDetails(e.currentTarget.value)}
          />
        </Field>
        <Field label={t("missing.description")} hint={t("common.optional")}>
          <TextArea
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
        </Field>
        <Field label={t("missing.contactPhone")} hint={t("common.phoneExample")}>
          <TextInput
            required
            type="tel"
            dir="ltr"
            value={contactPhone()}
            onInput={(e) => setContactPhone(e.currentTarget.value)}
          />
        </Field>

        <FormError message={error()} />
        <Button type="submit" size="lg" class="h-13 w-full text-base" disabled={busy()}>
          {busy() ? t("common.sending") : t("missing.submit")}
        </Button>
      </form>
    </div>
  );
}
