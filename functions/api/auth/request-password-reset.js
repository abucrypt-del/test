import { json } from "../../_shared/http.js";

const TTL_SECONDS = 30 * 60;

// Unauthenticated on purpose: a staff member taps "Forgot password" before
// they're logged in, so there's no session yet to check. This only ever
// (a) emails a one-time reset link to the fixed recovery address for a
// Super Admin account, or (b) inserts a notification row for a non-Super
// Admin account — it never reads back or changes any billing data.
export async function onRequestPost({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  if (!username) return json({ ok: false, error: "invalid_input" }, 400);

  const row = await env.BILLING_DB.prepare(
    "SELECT legacy_id, name, role FROM users WHERE lower(name) = lower(?1) LIMIT 1",
  ).bind(username).first();
  if (!row) return json({ ok: true }); // Don't reveal whether the account exists.

  if (row.role === "Super Admin") {
    if (!env.AUTH_KV || !env.RESEND_API_KEY || !env.RESET_EMAIL_TO) {
      return json({ ok: false, error: "email_not_configured" }, 500);
    }
    const token = crypto.randomUUID();
    await env.AUTH_KV.put(
      `reset:${token}`,
      JSON.stringify({ expiresAt: Date.now() + TTL_SECONDS * 1000, used: false }),
      { expirationTtl: TTL_SECONDS },
    );
    const origin = new URL(request.url).origin;
    const link = `${origin}/reset?token=${token}`;
    const from = env.RESET_EMAIL_FROM || "Al Yazi Mandi <onboarding@resend.dev>";
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: env.RESET_EMAIL_TO,
        subject: "Reset your Al Yazi Mandi Super Admin password",
        html: `<p>A password reset was requested for the Al Yazi Mandi Super Admin account.</p><p><a href="${link}">Reset your password</a></p><p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>`,
      }),
    });
    if (!emailResp.ok) return json({ ok: false, error: "email_send_failed" }, 502);
    return json({ ok: true, mode: "email" });
  }

  const legacyId = Date.now();
  await env.BILLING_DB.prepare(
    `INSERT INTO password_reset_requests (legacy_id, user_id, user_name, role, requested_at)
     VALUES (?1, ?2, ?3, ?4, datetime('now'))`,
  ).bind(legacyId, row.legacy_id, row.name, row.role).run();
  return json({ ok: true, mode: "notify" });
}
