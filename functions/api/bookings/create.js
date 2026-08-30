import { json } from "../../_shared/http.js";
import { isValidEmailFormat, isDisposableEmail, domainAcceptsMail, sendBookingConfirmationEmail } from "../../_shared/email.js";

const BOOKING_WINDOW_START_MINUTES = 11 * 60 + 30;
const BOOKING_WINDOW_END_MINUTES = 22 * 60;
const CABIN_COUNT = 5;
const MAX_GUESTS = 10;
const MAX_DURATION_MINUTES = 60;

function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function isWithinBookingHours(date) {
  const minutes = minutesOfDay(date);
  return minutes >= BOOKING_WINDOW_START_MINUTES && minutes <= BOOKING_WINDOW_END_MINUTES;
}

function cabinName(cabinId) {
  return `Cabin ${cabinId}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatTimeLabel(date) {
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
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
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const startDatetime = typeof body.startDatetime === "string" ? body.startDatetime : "";
  const endDatetime = typeof body.endDatetime === "string" ? body.endDatetime : "";
  const guests = Number(body.guests) || 1;

  if (!Number.isInteger(cabinId) || cabinId < 1 || cabinId > CABIN_COUNT) {
    return json({ ok: false, error: "invalid_cabin" }, 400);
  }
  if (!name || name.length > 120) return json({ ok: false, error: "invalid_input" }, 400);
  if (!phone || phone.length > 30) return json({ ok: false, error: "invalid_input" }, 400);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  if (!isValidEmailFormat(email)) return json({ ok: false, error: "invalid_email" }, 400);
  if (isDisposableEmail(email)) return json({ ok: false, error: "disposable_email" }, 400);
  if (!(await domainAcceptsMail(email))) return json({ ok: false, error: "undeliverable_email" }, 400);

  const start = new Date(startDatetime);
  const end = new Date(endDatetime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }
  const durationMinutes = (end.getTime() - start.getTime()) / 60000;
  if (durationMinutes <= 0 || durationMinutes > MAX_DURATION_MINUTES) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }
  if (!isWithinBookingHours(start) || minutesOfDay(end) > BOOKING_WINDOW_END_MINUTES) {
    return json({ ok: false, error: "outside_hours" }, 400);
  }

  const db = env.BILLING_DB;

  // Belt: check first so a normal (non-race) request gets a clean, specific
  // error instead of falling through to the constraint-violation branch.
  // Overlap, not just exact-match, since bookings now span a time range.
  const conflict = await db.prepare(
    `SELECT id FROM bookings WHERE cabin_legacy_id = ?1 AND cancelled = 0
       AND datetime < ?2 AND end_datetime > ?3`,
  ).bind(cabinId, endDatetime, startDatetime).first();
  if (conflict) return json({ ok: false, error: "cabin_unavailable" }, 409);

  await db.prepare(
    `INSERT INTO customers (name, phone, first_seen_at, last_seen_at) VALUES (?1, ?2, datetime('now'), datetime('now'))
     ON CONFLICT(phone) DO UPDATE SET name = excluded.name, last_seen_at = datetime('now')`,
  ).bind(name, phone).run();
  const customer = await db.prepare("SELECT id FROM customers WHERE phone = ?1").bind(phone).first();

  const legacyId = Date.now();
  const cName = cabinName(cabinId);

  // Suspenders: the actual insert, guarded by the partial unique index on
  // (cabin_legacy_id, datetime) WHERE cancelled = 0 (see schema.sql) — this
  // is what actually prevents a double-booking under concurrent requests
  // for the exact same start time, since the overlap check above alone has
  // a race window. (A concurrent overlapping-but-not-identical start time
  // is a much narrower race that the belt check above already covers in
  // practice for this traffic volume.)
  try {
    await db.prepare(
      `INSERT INTO bookings (legacy_id, customer_id, cabin_legacy_id, cabin_name, guest_name, phone, email, guests,
         datetime, end_datetime, confirmed, cancelled, notified_hour, notified_half_hour, source, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 0, 0, 0, 0, 'web', datetime('now'))`,
    ).bind(legacyId, customer?.id ?? null, cabinId, cName, name, phone, email, guests, startDatetime, endDatetime).run();
  } catch (err) {
    return json({ ok: false, error: "cabin_unavailable" }, 409);
  }

  const emailSent = await sendBookingConfirmationEmail(env, {
    to: email,
    name,
    cabinName: cName,
    dateLabel: formatDateLabel(start),
    startLabel: formatTimeLabel(start),
    endLabel: formatTimeLabel(end),
    guests,
  });

  return json({
    ok: true,
    emailSent,
    booking: { id: legacyId, cabinId, cabinName: cName, name, phone, email, guests, datetime: startDatetime, endDatetime, confirmed: false, cancelled: false, source: "web" },
  }, 201);
}
