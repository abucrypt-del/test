import { json } from "../../_shared/http.js";

const LIMIT = 24;

// Public, unauthenticated on purpose — feeds the testimonials shown in the
// Reviews section of the marketing site (site-src/src/App.tsx).
export async function onRequestGet({ env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const { results } = await env.BILLING_DB.prepare(
    `SELECT legacy_id as id, name, rating, comment, created_at as createdAt
       FROM reviews ORDER BY created_at DESC LIMIT ?1`,
  ).bind(LIMIT).all();
  return json({ ok: true, reviews: results || [] });
}
