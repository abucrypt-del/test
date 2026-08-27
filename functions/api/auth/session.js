import { json } from "../../_shared/http.js";
import { requireSession } from "../../_shared/session.js";

export async function onRequestGet({ request, env }) {
  const user = await requireSession(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);
  return json({ ok: true, user });
}
