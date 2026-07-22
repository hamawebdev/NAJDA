import { isServer } from "solid-js/web";

/**
 * Base URL for reaching the backend.
 *
 * - In the browser: empty string, so calls are relative `/api/...` paths on the
 *   same origin (proxied to the backend in dev, routed by the host in prod).
 * - During SSR: the backend's direct address from `API_INTERNAL_URL`
 *   (e.g. `http://localhost:8080` locally, `http://backend:8080` in Docker).
 */
export function apiBase(): string {
  return isServer ? (process.env.API_INTERNAL_URL ?? "http://localhost:8080") : "";
}

/**
 * Fetch a backend API endpoint and parse the JSON body. Works both in the
 * browser (relative path) and during SSR (via `API_INTERNAL_URL`). Non-2xx
 * responses with a JSON body (e.g. the 503 "degraded" health payload) still
 * resolve to the parsed body.
 */
export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    headers: { accept: "application/json" },
  });
  return (await res.json()) as T;
}
