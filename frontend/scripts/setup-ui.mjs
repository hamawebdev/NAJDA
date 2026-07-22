#!/usr/bin/env node
/**
 * NAJDA frontend UI setup.
 *
 * Vendors every component from the solid-ui registry (https://www.solid-ui.com)
 * into `src/components/ui/`, generates the Tailwind v4 theme bridge those
 * components need, and installs the runtime dependencies.
 *
 * solid-ui's own CLI (`solidui-cli`) targets Tailwind v3: it writes a
 * `tailwind.config.cjs` and pulls in `tailwindcss-animate`, neither of which
 * applies to this project's CSS-first Tailwind v4 setup. So this script talks to
 * the registry directly and emits a v4-shaped theme instead.
 *
 * Usage:
 *   node scripts/setup-ui.mjs            # add what is missing, never clobber
 *   node scripts/setup-ui.mjs --force    # regenerate files that already exist
 *   node scripts/setup-ui.mjs --no-install   # write files only, skip pnpm add
 *   node scripts/setup-ui.mjs --only=button,card,dialog
 *
 * Re-running without --force is safe: existing files are left alone, so local
 * edits to a vendored component survive.
 *
 * Not handled here (one-off, hand-owned): src/entry-server.tsx reads lang/dir
 * from src/lib/i18n.ts.
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = "https://www.solid-ui.com/registry";

/** Where vendored components land, and what `~/registry/ui/*` imports rewrite to. */
const UI_DIR = "src/components/ui";
const UI_ALIAS = "~/components/ui";

/** Always needed by the vendored sources: `cn()` + `cva()`. */
const BASE_DEPS = ["class-variance-authority", "clsx", "tailwind-merge"];

/** Tailwind v4 replacement for `tailwindcss-animate` (animate-in/out, slide-*, zoom-*). */
const STYLE_DEPS = ["tw-animate-css"];

/** Product stack beyond the component kit. */
const EXTRA_DEPS = [
  "maplibre-gl", // docs/modules/10-live-wildfire-map.md
  "@solid-primitives/i18n", // docs/00-vision-and-principles.md (ar / Tamazight / fr)
  "solid-icons", // pictogram-first UI
  "@modular-forms/solid",
  "valibot",
];

const DEV_DEPS = ["typescript"];

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const NO_INSTALL = args.includes("--no-install");
const ONLY = args
  .find((a) => a.startsWith("--only="))
  ?.slice("--only=".length)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const written = [];
const skipped = [];

const log = (msg) => console.log(msg);
const step = (msg) => console.log(`\n\x1b[1m${msg}\x1b[0m`);

/** Write `path` unless it exists and --force was not passed. */
async function emit(path, contents) {
  const abs = join(ROOT, path);
  if (existsSync(abs) && !FORCE) {
    skipped.push(path);
    return false;
  }
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, contents, "utf8");
  written.push(path);
  return true;
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw new Error(`${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
}

/** Fetch registry entries with a small concurrency pool. */
async function fetchComponents(names) {
  const out = [];
  let cursor = 0;
  const workers = Array.from({ length: 6 }, async () => {
    while (cursor < names.length) {
      const name = names[cursor++];
      out.push(await fetchJson(`${REGISTRY}/ui/${name}.json`));
      process.stdout.write(`\r  fetched ${out.length}/${names.length}`);
    }
  });
  await Promise.all(workers);
  process.stdout.write("\n");
  return out;
}

// ---------------------------------------------------------------------------
// Generated file contents
// ---------------------------------------------------------------------------

const LIB_UTILS = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class lists, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

/**
 * Tailwind v4 theme bridge.
 *
 * The vendored components are written against shadcn-style semantic utilities
 * (`bg-primary`, `text-muted-foreground`, `ring-offset-background`, ...). Under
 * Tailwind v3 those came from `tailwind.config.js`; under v4 they come from
 * `@theme inline`. `inline` matters: it makes each utility emit
 * `hsl(var(--primary))` rather than a snapshot of the value, which is what lets
 * the `.dark` overrides below take effect.
 */
const THEME_CSS = `/*
 * Theme tokens for the solid-ui components in src/components/ui.
 * Generated once by scripts/setup-ui.mjs — hand-tune freely; the script will not
 * overwrite this file unless run with --force.
 *
 * Colours are HSL triplets (no hsl() wrapper) so Tailwind's opacity modifiers
 * (bg-primary/90) keep working.
 *
 * PROVISIONAL PALETTE: docs/00-vision-and-principles.md calls for colour-coded
 * actions but does not specify hex values, so the red / amber / green below are
 * a starting point, not a spec. Replace once the design direction is fixed.
 *
 * Convention inherited from solid-ui: --destructive is a *solid* fill (buttons),
 * while --success / --warning / --error / --info are pale surfaces paired with a
 * saturated foreground (badges, callouts, alerts).
 */

@custom-variant dark (&:where(.dark, .dark *, [data-kb-theme="dark"], [data-kb-theme="dark"] *));

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;

  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;

  /* NAJDA red — primary action / brand */
  --primary: 0 72% 45%;
  --primary-foreground: 0 0% 98%;

  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;

  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;

  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;

  /* Deeper than --primary so "delete" never reads as "submit" */
  --destructive: 0 74% 32%;
  --destructive-foreground: 0 0% 98%;

  /* Status surfaces: pale background + saturated foreground */
  --success: 142 76% 92%;
  --success-foreground: 142 71% 29%;

  --warning: 45 100% 90%;
  --warning-foreground: 32 95% 34%;

  --error: 0 93% 94%;
  --error-foreground: 0 74% 38%;

  --info: 204 94% 94%;
  --info-foreground: 201 90% 35%;

  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 0 72% 45%;

  --radius: 0.5rem;

  --sidebar: 0 0% 98%;
  --sidebar-foreground: 240 10% 3.9%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 240 5.9% 90%;
  --sidebar-ring: 0 72% 45%;
}

/* Kobalte writes [data-kb-theme]; .dark is here for manual toggles. */
.dark,
[data-kb-theme="dark"] {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;

  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;

  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;

  --primary: 0 72% 51%;
  --primary-foreground: 0 0% 98%;

  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;

  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;

  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;

  --destructive: 0 62% 40%;
  --destructive-foreground: 0 0% 98%;

  --success: 142 70% 16%;
  --success-foreground: 142 69% 70%;

  --warning: 32 80% 16%;
  --warning-foreground: 45 93% 66%;

  --error: 0 63% 18%;
  --error-foreground: 0 91% 76%;

  --info: 201 90% 16%;
  --info-foreground: 199 95% 74%;

  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 0 72% 51%;

  --sidebar: 240 6% 10%;
  --sidebar-foreground: 0 0% 98%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 0 0% 98%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 0 72% 51%;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));

  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));

  --color-error: hsl(var(--error));
  --color-error-foreground: hsl(var(--error-foreground));

  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));

  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-ring: hsl(var(--sidebar-ring));

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-content-show: content-show 0.2s ease-out;
  --animate-content-hide: content-hide 0.2s ease-out;
  --animate-caret-blink: caret-blink 1.25s ease-out infinite;
}

@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--kb-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--kb-accordion-content-height); }
  to { height: 0; }
}

@keyframes content-show {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes content-hide {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.96); }
}

@keyframes caret-blink {
  0%, 70%, 100% { opacity: 1; }
  20%, 50% { opacity: 0; }
}

@layer base {
  /* Tailwind v4 defaults the border colour to currentColor; the components
     assume the v3 behaviour of a themed default. */
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
`;

const APP_CSS = `@import "tailwindcss";
@import "tw-animate-css";
@import "./styles/theme.css";
`;

const I18N_TS = `/**
 * Locale and text-direction plumbing.
 *
 * docs/00-vision-and-principles.md requires Arabic, Tamazight (Tifinagh and
 * Latin) and French, and the interface must stay operable by someone who reads
 * none of them.
 *
 * TODO(product): only \`ar\` and \`fr\` are listed below. docs/ does not fix the
 * BCP-47 codes for the two Tamazight variants (e.g. \`zgh-Tfng\` vs \`kab-Latn\`),
 * so they are deliberately absent rather than guessed — confirm and add.
 */

export type Direction = "ltr" | "rtl";

export const LOCALES = {
  ar: { label: "العربية", dir: "rtl" },
  fr: { label: "Français", dir: "ltr" },
} as const satisfies Record<string, { label: string; dir: Direction }>;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return value in LOCALES;
}

/** Text direction for a locale — drives the \`dir\` attribute on <html>. */
export function dirFor(locale: Locale): Direction {
  return LOCALES[locale].dir;
}
`;

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

async function main() {
  step("1/5  Reading the solid-ui registry");
  const index = await fetchJson(`${REGISTRY}/index.json`);
  const available = index.map((c) => c.name);
  log(`  ${available.length} components available`);

  let names = available;
  if (ONLY) {
    const unknown = ONLY.filter((n) => !available.includes(n));
    if (unknown.length) {
      throw new Error(`unknown component(s): ${unknown.join(", ")}`);
    }
    names = ONLY;
    log(`  --only: restricting to ${names.length}`);
  }

  step("2/5  Fetching component sources");
  const components = await fetchComponents(names);

  step(`3/5  Writing files`);
  const registryDeps = new Set();
  for (const component of components) {
    for (const dep of component.dependencies ?? []) registryDeps.add(dep);
    for (const file of component.files) {
      // Cross-component imports arrive as `~/registry/ui/button`; point them at
      // wherever we actually vendor the files.
      const source = file.content.replaceAll("~/registry/ui/", `${UI_ALIAS}/`);
      await emit(join(UI_DIR, file.name), source);
    }
  }

  await emit("src/lib/utils.ts", LIB_UTILS);
  await emit("src/lib/i18n.ts", I18N_TS);
  await emit("src/styles/theme.css", THEME_CSS);

  // app.css already exists from the SolidStart scaffold. Replace it only when it
  // is not yet wired to the generated theme, keeping one backup.
  const appCssPath = join(ROOT, "src/app.css");
  const appCss = existsSync(appCssPath) ? await readFile(appCssPath, "utf8") : "";
  if (!appCss.includes("./styles/theme.css")) {
    if (appCss.trim() && !existsSync(join(ROOT, "src/app.css.bak"))) {
      await writeFile(join(ROOT, "src/app.css.bak"), appCss, "utf8");
      written.push("src/app.css.bak (previous contents)");
    }
    await writeFile(appCssPath, APP_CSS, "utf8");
    written.push("src/app.css");
  } else {
    skipped.push("src/app.css");
  }

  log(`  ${written.length} written, ${skipped.length} left untouched`);
  if (skipped.length && !FORCE) {
    log(`  (re-run with --force to regenerate the untouched ones)`);
  }

  step("4/5  Installing dependencies");
  const deps = [...new Set([...registryDeps, ...BASE_DEPS, ...STYLE_DEPS, ...EXTRA_DEPS])].sort();
  if (NO_INSTALL) {
    log(`  --no-install; would have added:\n    ${deps.join("\n    ")}`);
  } else {
    log(`  ${deps.length} runtime + ${DEV_DEPS.length} dev`);
    pnpm(["add", ...deps]);
    pnpm(["add", "-D", ...DEV_DEPS]);
  }

  step("5/5  Done");
  log(`  components  -> ${UI_DIR}/`);
  log(`  theme       -> src/styles/theme.css (imported by src/app.css)`);
  log(`  helpers     -> src/lib/utils.ts, src/lib/i18n.ts`);
  log(`\n  Next:  pnpm typecheck  &&  pnpm build`);
}

function pnpm(argv) {
  const res = spawnSync("pnpm", argv, { cwd: ROOT, stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`pnpm ${argv[0]} failed (exit ${res.status})`);
}

main().catch((err) => {
  console.error(`\n\x1b[31msetup-ui failed:\x1b[0m ${err.message}`);
  process.exit(1);
});
