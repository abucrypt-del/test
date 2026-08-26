import { hashPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";

export async function onRequestPost({ request, env }) {
  if (!env.AUTH_KV) return json({ ok: false, error: "not_configured" }, 500);

  const body = await request.json().catch(() => ({}));
  const { token, newPassword } = body;
  if (typeof token !== "string" || !token || typeof newPassword !== "string" || newPassword.length < 6) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const record = await env.AUTH_KV.get(`reset:${token}`, "json");
  if (!record || record.used || record.expiresAt <= Date.now()) {
    return json({ ok: false, error: "invalid_or_expired" }, 400);
  }

  const hash = await hashPassword(newPassword);
  await env.AUTH_KV.put("superadmin:password", JSON.stringify({ hash, updatedAt: Date.now() }));
  await env.AUTH_KV.put(`reset:${token}`, JSON.stringify({ ...record, used: true }), { expirationTtl: 60 });

  return json({ ok: true });
}
