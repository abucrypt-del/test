// Signed, HttpOnly session cookies for the Workers runtime. There is no
// server-side session store: the cookie itself carries {sub, exp} and is
// HMAC-signed with SESSION_SECRET, so it can't be forged or tampered with
// from the client — unlike the previous design, which trusted whatever the
// browser had in sessionStorage with no server verification at all.

const COOKIE_NAME = "alyazi_staff_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(userId, secret) {
  const payload = JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${toBase64Url(new Uint8Array(signature))}`;
}

function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

export async function readSessionUserId(request, secret) {
  if (!secret) return null;
  const raw = parseCookies(request)[COOKIE_NAME];
  if (!raw) return null;
  const [payloadB64, sigB64] = raw.split(".");
  if (!payloadB64 || !sigB64) return null;
  const key = await hmacKey(secret);
  let valid = false;
  try {
    valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(sigB64), new TextEncoder().encode(payloadB64));
  } catch {
    return null;
  }
  if (!valid) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    if (!payload.sub || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export function sessionCookieHeader(token, { clear = false } = {}) {
  const maxAge = clear ? 0 : SESSION_TTL_SECONDS;
  return `${COOKIE_NAME}=${clear ? "" : token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

// Resolves the signed cookie on `request` to the live user row in D1 (so a
// locked account, or one deleted after the cookie was issued, stops working
// immediately rather than staying valid until the cookie expires).
export async function requireSession(request, env) {
  const userId = await readSessionUserId(request, env.SESSION_SECRET);
  if (!userId || !env.BILLING_DB) return null;
  const row = await env.BILLING_DB.prepare(
    "SELECT legacy_id, name, email, phone, role, locked FROM users WHERE legacy_id = ?1",
  ).bind(userId).first();
  if (!row || row.locked) return null;
  return { id: row.legacy_id, name: row.name, email: row.email || "", phone: row.phone || "", role: row.role, locked: !!row.locked };
}
