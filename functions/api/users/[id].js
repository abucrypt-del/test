import { json } from "../../_shared/http.js";
import { requireSession } from "../../_shared/session.js";

export async function onRequestPatch({ request, env, params }) {
  const staff = await requireSession(request, env);
  if (!staff) return json({ ok: false, error: "unauthorized" }, 401);
  if (staff.role !== "Super Admin") return json({ ok: false, error: "forbidden" }, 403);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) return json({ ok: false, error: "invalid_input" }, 400);
  const body = await request.json().catch(() => ({}));
  if (typeof body.locked !== "boolean") return json({ ok: false, error: "invalid_input" }, 400);

  const target = await env.BILLING_DB.prepare("SELECT role FROM users WHERE legacy_id = ?1").bind(id).first();
  if (!target || target.role === "Super Admin") return json({ ok: false, error: "not_found" }, 404);

  await env.BILLING_DB.prepare("UPDATE users SET locked = ?1, updated_at = datetime('now') WHERE legacy_id = ?2")
    .bind(body.locked ? 1 : 0, id).run();
  return json({ ok: true });
}

export async function onRequestDelete({ request, env, params }) {
  const staff = await requireSession(request, env);
  if (!staff) return json({ ok: false, error: "unauthorized" }, 401);
  if (staff.role !== "Super Admin") return json({ ok: false, error: "forbidden" }, 403);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0 || id === staff.id) return json({ ok: false, error: "invalid_input" }, 400);

  const target = await env.BILLING_DB.prepare("SELECT role FROM users WHERE legacy_id = ?1").bind(id).first();
  if (!target || target.role === "Super Admin") return json({ ok: false, error: "not_found" }, 404);

  await env.BILLING_DB.prepare("DELETE FROM users WHERE legacy_id = ?1").bind(id).run();
  return json({ ok: true });
}
