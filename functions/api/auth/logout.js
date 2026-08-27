import { sessionCookieHeader } from "../../_shared/session.js";

export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json", "Set-Cookie": sessionCookieHeader("", { clear: true }) },
  });
}
