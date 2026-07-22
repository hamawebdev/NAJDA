import type { APIEvent } from "@solidjs/start/server";

/**
 * Forwards every `/api/*` request hitting the frontend server to the backend.
 *
 * This keeps a single origin in the browser: the page and the API share
 * `localhost:3000` in dev. In production a reverse proxy can route `/api`
 * straight to the backend, in which case this handler is simply never reached.
 */
const backendBase = () => process.env.API_INTERNAL_URL ?? "http://localhost:8080";

async function forward(event: APIEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const target = new URL(url.pathname + url.search, backendBase());

  const headers = new Headers(event.request.headers);
  headers.delete("host");

  const method = event.request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  try {
    return await fetch(target, {
      method,
      headers,
      body: hasBody ? event.request.body : undefined,
      // Required by undici when streaming a request body.
      ...(hasBody ? { duplex: "half" as const } : {}),
      redirect: "manual",
    });
  } catch {
    return Response.json(
      { error: `backend unreachable at ${backendBase()}` },
      { status: 502 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
