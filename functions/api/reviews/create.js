import { json } from "../../_shared/http.js";

const MAX_NAME_LENGTH = 120;
const MAX_COMMENT_LENGTH = 1000;

// Public, unauthenticated on purpose — same pattern as bookings/create.js:
// this is how a guest leaves a review from the marketing site, before any
// staff login exists for them.
//
// Google does not allow a third party to post a review to a customer's
// Google Business Profile on their behalf — only the author, signed into
// their own Google account, can do that. So this endpoint only stores the
// review for on-site display; the client separately invites the guest to
// also share the same review on Google themselves right after submitting.
export async function onRequestPost({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const body = await request.json().catch(() => ({}));

  // Honeypot: a hidden field real visitors never see or fill. A bot that
  // fills every field gets a fake success instead of a row in the table.
  if (typeof body.website === "string" && body.website.trim()) {
    return json({ ok: true }, 201);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!name || name.length > MAX_NAME_LENGTH) return json({ ok: false, error: "invalid_input" }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ ok: false, error: "invalid_input" }, 400);
  if (comment.length > MAX_COMMENT_LENGTH) return json({ ok: false, error: "invalid_input" }, 400);

  const db = env.BILLING_DB;
  const legacyId = Date.now();
  await db.prepare(
    `INSERT INTO reviews (legacy_id, name, rating, comment, created_at) VALUES (?1, ?2, ?3, ?4, datetime('now'))`,
  ).bind(legacyId, name, rating, comment || null).run();

  return json({
    ok: true,
    review: { id: legacyId, name, rating, comment, createdAt: new Date().toISOString() },
  }, 201);
}
