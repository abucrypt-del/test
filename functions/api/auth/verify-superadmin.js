import { verifyPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";

// Checks a login attempt against the backend-managed Super Admin password
// (set via the email reset flow). If no backend record exists yet, tells
// the caller so it can fall back to its local-only check unchanged.
export async function onRequestPost({ request, env }) {
  if (!env.AUTH_KV) return json({ configured: false });

  const body = await request.json().catch(() => ({}));
  const password = body.password;
  if (typeof password !== "string" || !password) {
    return json({ configured: false, ok: false }, 400);
  }

  const record = await env.AUTH_KV.get("superadmin:password", "json");
  if (!record) return json({ configured: false });

  const ok = await verifyPassword(password, record.hash);
  return json({ configured: true, ok });
}
