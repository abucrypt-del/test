import { json } from "../../_shared/http.js";

const TTL_SECONDS = 30 * 60;

// Creates a one-time reset token and emails the reset link to the fixed
// recovery address (RESET_EMAIL_TO). The token is never returned to the
// caller — only whoever opens the email can complete the reset.
export async function onRequestPost({ request, env }) {
  if (!env.AUTH_KV) return json({ ok: false, error: "not_configured" }, 500);
  if (!env.RESEND_API_KEY || !env.RESET_EMAIL_TO) {
    return json({ ok: false, error: "email_not_configured" }, 500);
  }

  const token = crypto.randomUUID();
  await env.AUTH_KV.put(
    `reset:${token}`,
    JSON.stringify({ expiresAt: Date.now() + TTL_SECONDS * 1000, used: false }),
    { expirationTtl: TTL_SECONDS }
  );

  const origin = new URL(request.url).origin;
  const link = `${origin}/reset.html?token=${token}`;
  const from = env.RESET_EMAIL_FROM || "Al Yazi Mandi <onboarding@resend.dev>";

  const emailResp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: env.RESET_EMAIL_TO,
      subject: "Reset your Al Yazi Mandi Super Admin password",
      html: `<p>A password reset was requested for the Al Yazi Mandi Super Admin account.</p><p><a href="${link}">Reset your password</a></p><p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>`,
    }),
  });

  if (!emailResp.ok) return json({ ok: false, error: "email_send_failed" }, 502);
  return json({ ok: true });
}
