import { hashPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";
import { requireSession } from "../../_shared/session.js";

// Super Admin resets a locked-out staff member's password from the
// notifications bell. The requester's own session must already be valid —
// this is not a public "forgot password" endpoint (see request-password-reset.js).
export async function onRequestPost({ request, env }) {
  const staff = await requireSession(request, env);
  if (!staff) return json({ ok: false, error: "unauthorized" }, 401);
  if (staff.role !== "Super Admin") return json({ ok: false, error: "forbidden" }, 403);

  const body = await request.json().catch(() => ({}));
  const userId = Number(body.userId);
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const requestId = body.requestId !== undefined && body.requestId !== null && body.requestId !== "" ? Number(body.requestId) : null;
  if (!Number.isInteger(userId) || userId <= 0 || newPassword.length < 6 || newPassword.length > 256) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const hash = await hashPassword(newPassword);
  await env.BILLING_DB.prepare("UPDATE users SET password = ?1, updated_at = datetime('now') WHERE legacy_id = ?2")
    .bind(hash, userId).run();

  if (requestId) {
    await env.BILLING_DB.prepare("DELETE FROM password_reset_requests WHERE legacy_id = ?1").bind(requestId).run();
  }
  return json({ ok: true });
}
