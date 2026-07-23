import { A, useNavigate } from "@solidjs/router";
import { TbOutlineShieldCheck } from "solid-icons/tb";
import { createSignal } from "solid-js";

import { Field, FormError, TextInput } from "~/components/form";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { ApiError, apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";

export default function LeaderLoginPage() {
  const { t, tError } = useI18n();
  const navigate = useNavigate();

  const [phone, setPhone] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await apiFetch("/api/leader/login", {
        method: "POST",
        body: { phone: phone(), password: password() },
      });
      navigate("/leader");
    } catch (err) {
      setError(err instanceof ApiError ? tError(err.message) : tError("generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="mx-auto max-w-md space-y-8">
      <PageHeader icon={TbOutlineShieldCheck} title={t("leader.loginTitle")} />
      <form class="space-y-5" onSubmit={submit}>
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
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </Field>
        <FormError message={error()} />
        <Button type="submit" size="lg" class="h-13 w-full text-base" disabled={busy()}>
          {busy() ? t("common.sending") : t("leader.loginSubmit")}
        </Button>
      </form>
      <p class="text-center text-[15px]">
        <A href="/groups/new" class="font-medium text-primary underline-offset-4 hover:underline">
          {t("leader.noGroup")}
        </A>
      </p>
    </div>
  );
}
