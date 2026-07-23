import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

import { Nav } from "~/components/nav";
import { I18nProvider } from "~/lib/i18n";

export default function App() {
  return (
    <Router
      root={(props) => (
        <I18nProvider>
          <div class="flex min-h-screen flex-col bg-background text-foreground">
            <Nav />
            <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
              <Suspense>{props.children}</Suspense>
            </main>
          </div>
        </I18nProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
