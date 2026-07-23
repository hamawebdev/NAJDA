/** Cascading Wilaya → Commune selects, locale-aware, backed by the API. */
import { createResource } from "solid-js";

import { BigSelect } from "~/components/big-select";
import { apiFetch } from "~/lib/api";
import { useI18n } from "~/lib/i18n";
import type { Commune, Wilaya } from "~/lib/types";

export function WilayaSelect(props: {
  value: number | null;
  onChange: (value: number | null) => void;
  /** Adds an "all wilayas" option (for list filters). */
  allowAll?: boolean;
  required?: boolean;
}) {
  const { t, pick } = useI18n();
  const [wilayas] = createResource(() => apiFetch<Wilaya[]>("/api/wilayas"));

  return (
    <BigSelect
      label={t("common.wilaya")}
      placeholder={t("common.selectWilaya")}
      clearLabel={props.allowAll ? t("common.allWilayas") : undefined}
      value={props.value}
      onChange={props.onChange}
      options={(wilayas() ?? []).map((w) => ({
        value: w.code,
        label: pick({ ar: w.name_ar, fr: w.name_fr }),
        hint: String(w.code).padStart(2, "0"),
      }))}
    />
  );
}

export function CommuneSelect(props: {
  wilaya: number | null;
  value: number | null;
  onChange: (value: number | null) => void;
  allowAll?: boolean;
  required?: boolean;
}) {
  const { t, pick } = useI18n();
  const [communes] = createResource(
    () => props.wilaya,
    (wilaya) => (wilaya === null ? [] : apiFetch<Commune[]>(`/api/communes?wilaya=${wilaya}`)),
  );

  return (
    <BigSelect
      label={t("common.commune")}
      placeholder={t("common.selectCommune")}
      disabled={props.wilaya === null}
      value={props.value}
      onChange={props.onChange}
      options={(communes() ?? []).map((c) => ({
        value: c.id,
        label: pick({ ar: c.name_ar, fr: c.name_fr }),
      }))}
    />
  );
}
