import { json } from "../../_shared/http.js";

const CABIN_COUNT = 5;

// Public, unauthenticated on purpose — a guest checking cabin availability
// on the marketing site hasn't logged in (there's no login for guests).
export async function onRequestGet({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const datetime = new URL(request.url).searchParams.get("datetime") || "";
  if (!datetime) return json({ ok: false, error: "invalid_input" }, 400);

  const rows = await env.BILLING_DB.prepare(
    "SELECT cabin_legacy_id FROM bookings WHERE datetime = ?1 AND cancelled = 0",
  ).bind(datetime).all();
  const booked = new Set(rows.results.map((row) => row.cabin_legacy_id));
  const availableCabinIds = Array.from({ length: CABIN_COUNT }, (_, i) => i + 1).filter((id) => !booked.has(id));
  return json({ ok: true, availableCabinIds });
}
