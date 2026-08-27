import { hashPassword } from "../../_shared/crypto.js";
import { json } from "../../_shared/http.js";
import { requireSession } from "../../_shared/session.js";

export async function onRequestPost({ request, env }) {
  const staff = await requireSession(request, env);
  if (!staff) return json({ ok: false, error: "unauthorized" }, 401);
  if (staff.role !== "Super Admin") return json({ ok: false, error: "forbidden" }, 403);

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const role = body.role === "Admin" || body.role === "Super Admin" ? body.role : "User";
  const password = typeof body.password === "string" ? body.password : "";
  if (!name || !email || password.length < 6 || name.length > 120 || email.length > 240) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const existing = await env.BILLING_DB.prepare("SELECT id FROM users WHERE lower(name) = lower(?1)").bind(name).first();
  if (existing) return json({ ok: false, error: "name_taken" }, 409);

  const legacyId = Date.now();
  const hash = await hashPassword(password);
  await env.BILLING_DB.prepare(
    `INSERT INTO users (legacy_id, name, email, phone, role, password, locked, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, datetime('now'))`,
  ).bind(legacyId, name, email, phone, role, hash).run();

  return json({ ok: true, user: { id: legacyId, name, email, phone, role, locked: false } }, 201);
}
