import { json } from "../../_shared/http.js";

const CABIN_COUNT = 5;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Public, unauthenticated on purpose — a guest checking cabin availability
// on the marketing site hasn't logged in (there's no login for guests).
// Returns each cabin's booked time ranges for the whole day so the guest
// UI can render a slot grid and grey out anything already taken, instead
// of round-tripping one datetime at a time.
export async function onRequestGet({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const date = new URL(request.url).searchParams.get("date") || "";
  if (!DATE_RE.test(date)) return json({ ok: false, error: "invalid_input" }, 400);

  const rows = await env.BILLING_DB.prepare(
    `SELECT cabin_legacy_id, datetime, end_datetime FROM bookings
       WHERE cancelled = 0 AND datetime LIKE ?1`,
  ).bind(`${date}%`).all();

  const cabins = Array.from({ length: CABIN_COUNT }, (_, i) => ({
    id: i + 1,
    name: `Cabin ${i + 1}`,
    bookedRanges: [],
  }));
  for (const row of rows.results) {
    const cabin = cabins.find((c) => c.id === row.cabin_legacy_id);
    if (!cabin || !row.end_datetime) continue;
    cabin.bookedRanges.push({ start: row.datetime.slice(11, 16), end: row.end_datetime.slice(11, 16) });
  }

  return json({ ok: true, cabins });
}
