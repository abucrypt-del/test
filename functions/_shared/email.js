// Common disposable/throwaway email providers — rejecting these stops the
// obvious fake-address case; the DNS check below catches typo'd or made-up
// domains that pass format validation but can't actually receive mail.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "10minutemail.com",
  "10minutemail.net", "tempmail.com", "temp-mail.org", "yopmail.com", "trashmail.com",
  "throwawaymail.com", "fakeinbox.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "sharklasers.com", "mailnesia.com", "mintemail.com", "spamgourmet.com", "mytemp.email",
  "moakt.com", "emailondeck.com", "33mail.com", "mailcatch.com", "tempinbox.com",
  "discard.email", "mailsac.com", "inboxkitten.com", "burnermail.io",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmailFormat(email) {
  return typeof email === "string" && email.length > 0 && email.length <= 254 && EMAIL_RE.test(email);
}

export function emailDomain(email) {
  return email.slice(email.lastIndexOf("@") + 1).toLowerCase();
}

export function isDisposableEmail(email) {
  return DISPOSABLE_DOMAINS.has(emailDomain(email));
}

async function dnsHasAnswer(domain, type) {
  const resp = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
  });
  if (!resp.ok) return null; // resolver hiccup, not "no record"
  const data = await resp.json();
  return Array.isArray(data.Answer) && data.Answer.length > 0;
}

// Confirms the domain can actually receive mail via a DNS-over-HTTPS MX
// lookup — catches typos and made-up domains that pass format validation
// but don't exist (e.g. guest@gmali.con). Falls back to an A/AAAA record
// per RFC 5321's implicit-MX rule, and fails open on resolver errors so a
// real guest is never blocked by our DNS lookup breaking.
export async function domainAcceptsMail(email) {
  const domain = emailDomain(email);
  try {
    const hasMx = await dnsHasAnswer(domain, "MX");
    if (hasMx === true) return true;
    if (hasMx === null) return true;
    const hasA = await dnsHasAnswer(domain, "A");
    if (hasA === true) return true;
    if (hasA === null) return true;
    return false;
  } catch {
    return true;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export async function sendBookingConfirmationEmail(env, { to, name, cabinName, dateLabel, startLabel, endLabel, guests }) {
  if (!env.RESEND_API_KEY) return false;
  const from = env.BOOKING_EMAIL_FROM || env.RESET_EMAIL_FROM || "Al Yazi Mandi <onboarding@resend.dev>";
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `Your cabin is reserved — ${cabinName}, ${dateLabel}`,
        html: `<p>Hi ${escapeHtml(name)},</p><p>Your cabin is reserved. Here are the details:</p><ul><li><strong>Cabin:</strong> ${escapeHtml(cabinName)}</li><li><strong>Date:</strong> ${escapeHtml(dateLabel)}</li><li><strong>Time:</strong> ${escapeHtml(startLabel)} – ${escapeHtml(endLabel)}</li><li><strong>Guests:</strong> ${guests}</li></ul><p>We hold cabins for a maximum of 10 minutes past your reservation time — see you soon!</p><p>— Al Yazi Mandi</p>`,
      }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
