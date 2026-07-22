import { For, Show, createResource } from "solid-js";
import { apiFetch } from "~/lib/api";

type Health = {
  status: "ok" | "degraded";
  postgres: "ok" | "error";
  redis: "ok" | "error";
};

type Wilaya = { code: number; name_ar: string; name_fr: string; name_en: string };

const getHealth = async (): Promise<Health | null> => {
  try {
    return await apiFetch<Health>("/api/health");
  } catch {
    return null;
  }
};

const getWilayas = async (): Promise<Wilaya[] | null> => {
  try {
    return await apiFetch<Wilaya[]>("/api/wilayas");
  } catch {
    return null;
  }
};

function StatusChip(props: { label: string; value: string | undefined }) {
  const color = () =>
    props.value === "ok"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";
  return (
    <span class={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${color()}`}>
      {props.label}: {props.value ?? "unreachable"}
    </span>
  );
}

export default function Home() {
  const [health, { refetch }] = createResource(getHealth);
  const [wilayas] = createResource(getWilayas);

  return (
    <main class="mx-auto max-w-2xl p-6">
      <header class="my-10 text-center">
        <h1 class="text-5xl font-bold text-emerald-800">
          NAJDA <span dir="rtl">نجدة</span>
        </h1>
        <p class="mt-3 text-gray-600">
          National wildfire emergency coordination platform for Algeria.
        </p>
      </header>

      <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">System status</h2>
          <button
            type="button"
            onClick={() => refetch()}
            class="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Live response from <code class="rounded bg-gray-100 px-1">GET /api/health</code>
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusChip label="api" value={health() ? health()!.status : undefined} />
          <StatusChip label="postgres" value={health()?.postgres} />
          <StatusChip label="redis" value={health()?.redis} />
        </div>
      </section>

      <section class="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800">Wilayas</h2>
        <p class="mt-1 text-sm text-gray-500">
          Reference data from <code class="rounded bg-gray-100 px-1">GET /api/wilayas</code>{" "}
          (seeded by the first migration)
        </p>
        <Show
          when={wilayas()}
          fallback={<p class="mt-4 text-sm text-red-700">Could not load wilayas — is the backend running?</p>}
        >
          {(list) => (
            <>
              <p class="mt-4 text-sm text-gray-700">
                <span class="font-semibold">{list().length}</span> wilayas loaded from Postgres, e.g.
              </p>
              <ul class="mt-2 flex flex-wrap gap-2">
                <For each={list().slice(0, 6)}>
                  {(w) => (
                    <li class="rounded-md bg-emerald-50 px-2 py-1 text-sm text-emerald-900">
                      {String(w.code).padStart(2, "0")} {w.name_fr} · <span dir="rtl">{w.name_ar}</span>
                    </li>
                  )}
                </For>
              </ul>
            </>
          )}
        </Show>
      </section>

      <footer class="my-8 text-center text-sm text-gray-400">
        Product spec lives in <code>docs/</code> — read it before building features.
      </footer>
    </main>
  );
}
