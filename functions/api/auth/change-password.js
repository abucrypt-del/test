import { verifyPassword, hashPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";
import { requireSession } from "../../_shared/session.js";

export async function onRequestPost({ request, env }) {
  const user = await requireSession(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);

  const body = await request.json().catch(() => ({}));
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  if (newPassword.length < 6 || newPassword.length > 256) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const row = await env.BILLING_DB.prepare("SELECT password FROM users WHERE legacy_id = ?1").bind(user.id).first();
  const stored = row?.password || "";
  const ok = stored.startsWith("pbkdf2$") ? await verifyPassword(currentPassword, stored) : stored.length > 0 && stored === currentPassword;
  if (!ok) return json({ ok: false, error: "invalid_credentials" }, 401);

  const hash = await hashPassword(newPassword);
  await env.BILLING_DB.prepare("UPDATE users SET password = ?1, updated_at = datetime('now') WHERE legacy_id = ?2")
    .bind(hash, user.id).run();
  return json({ ok: true });
}
