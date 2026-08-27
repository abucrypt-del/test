import { verifyPassword, hashPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";
import { signSession, sessionCookieHeader } from "../../_shared/session.js";

function publicUser(row) {
  return { id: row.legacy_id, name: row.name, email: row.email || "", phone: row.phone || "", role: row.role, locked: !!row.locked };
}

export async function onRequestPost({ request, env }) {
  if (!env.BILLING_DB || !env.SESSION_SECRET) {
    return json({ ok: false, error: "auth_not_configured" }, 503);
  }
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password || username.length > 120 || password.length > 256) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const row = await env.BILLING_DB.prepare(
    "SELECT legacy_id, name, email, phone, role, locked, password FROM users WHERE lower(name) = lower(?1) LIMIT 1",
  ).bind(username).first();

  if (!row || row.locked) {
    return json({ ok: false, error: "invalid_credentials" }, 401);
  }

  const stored = row.password || "";
  let ok = false;
  if (stored.startsWith("pbkdf2$")) {
    ok = await verifyPassword(password, stored);
  } else {
    // Migration path: this account still has the plaintext password from
    // before hashing existed. Accept a matching plaintext value once, then
    // immediately re-hash it so the plaintext never persists past this call.
    ok = stored.length > 0 && stored === password;
    if (ok) {
      const hash = await hashPassword(password);
      await env.BILLING_DB.prepare("UPDATE users SET password = ?1, updated_at = datetime('now') WHERE legacy_id = ?2")
        .bind(hash, row.legacy_id).run();
    }
  }

  if (!ok) return json({ ok: false, error: "invalid_credentials" }, 401);

  const token = await signSession(row.legacy_id, env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true, user: publicUser(row) }), {
    status: 200,
    headers: { "content-type": "application/json", "Set-Cookie": sessionCookieHeader(token) },
  });
}
