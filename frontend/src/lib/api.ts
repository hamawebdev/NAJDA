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
 * Error thrown for non-2xx API responses. `message` is the backend's stable
 * message key (e.g. `invalid_phone`), which the UI maps to a translated string.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiFetchOptions {
  method?: "GET" | "POST";
  /** JSON-encoded request body (sets content-type). Ignored when formData is set. */
  body?: unknown;
  /** Multipart body (browser sets the boundary content-type itself). */
  formData?: FormData;
  headers?: Record<string, string>;
}

/**
 * Fetch a backend API endpoint and parse the JSON body. Works both in the
 * browser (relative path) and during SSR (via `API_INTERNAL_URL`).
 * Non-2xx responses throw an {@link ApiError} carrying the backend's message.
 */
export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { accept: "application/json", ...opts.headers };
  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${apiBase()}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body,
    credentials: "same-origin",
  });

  if (!res.ok) {
    throw new ApiError(res.status, (await res.text()) || `http_${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
