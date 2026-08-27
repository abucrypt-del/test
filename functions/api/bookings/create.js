import { json } from "../../_shared/http.js";

const BOOKING_WINDOW_START_MINUTES = 11 * 60 + 30;
const BOOKING_WINDOW_END_MINUTES = 22 * 60;
const CABIN_COUNT = 5;

function isWithinBookingHours(datetimeValue) {
  const date = new Date(datetimeValue);
  if (Number.isNaN(date.getTime())) return false;
  const minutesOfDay = date.getHours() * 60 + date.getMinutes();
  return minutesOfDay >= BOOKING_WINDOW_START_MINUTES && minutesOfDay <= BOOKING_WINDOW_END_MINUTES;
}

// Public, unauthenticated on purpose — this is how a guest books a cabin
// from the marketing site, before any staff login exists for them. Mirrors
// the validation the staff app's own booking form already does client-side
// (see isWithinBookingHours in app.js), plus a server-side conflict check
// that a client-only check can't guarantee under concurrent requests.
export async function onRequestPost({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const body = await request.json().catch(() => ({}));
  const cabinId = Number(body.cabinId);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const datetime = typeof body.datetime === "string" ? body.datetime : "";
  const guests = Number(body.guests) || 1;

  if (!Number.isInteger(cabinId) || cabinId < 1 || cabinId > CABIN_COUNT) {
    return json({ ok: false, error: "invalid_cabin" }, 400);
  }
  if (!name || name.length > 120) return json({ ok: false, error: "invalid_input" }, 400);
  if (!phone || phone.length > 30) return json({ ok: false, error: "invalid_input" }, 400);
  if (!datetime || !isWithinBookingHours(datetime)) {
    return json({ ok: false, error: "outside_hours" }, 400);
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const db = env.BILLING_DB;

  // Belt: check first so a normal (non-race) request gets a clean, specific
  // error instead of falling through to the constraint-violation branch.
  const conflict = await db.prepare(
    "SELECT id FROM bookings WHERE cabin_legacy_id = ?1 AND datetime = ?2 AND cancelled = 0",
  ).bind(cabinId, datetime).first();
  if (conflict) return json({ ok: false, error: "cabin_unavailable" }, 409);

  await db.prepare(
    `INSERT INTO customers (name, phone, first_seen_at, last_seen_at) VALUES (?1, ?2, datetime('now'), datetime('now'))
     ON CONFLICT(phone) DO UPDATE SET name = excluded.name, last_seen_at = datetime('now')`,
  ).bind(name, phone).run();
  const customer = await db.prepare("SELECT id FROM customers WHERE phone = ?1").bind(phone).first();

  const legacyId = Date.now();
  const cabinName = `Cabin ${cabinId}`;

  // Suspenders: the actual insert, guarded by the partial unique index on
  // (cabin_legacy_id, datetime) WHERE cancelled = 0 (see schema.sql) — this
  // is what actually prevents a double-booking under concurrent requests,
  // since the check above alone has a race window.
  try {
    await db.prepare(
      `INSERT INTO bookings (legacy_id, customer_id, cabin_legacy_id, cabin_name, guest_name, phone, guests,
         datetime, confirmed, cancelled, notified_hour, notified_half_hour, source, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 0, 0, 0, 0, 'web', datetime('now'))`,
    ).bind(legacyId, customer?.id ?? null, cabinId, cabinName, name, phone, guests, datetime).run();
  } catch (err) {
    return json({ ok: false, error: "cabin_unavailable" }, 409);
  }

  return json({
    ok: true,
    booking: { id: legacyId, cabinId, cabinName, name, phone, guests, datetime, confirmed: false, cancelled: false, source: "web" },
  }, 201);
}
