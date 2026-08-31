// Temporary — deletes itself from the repo right after use. Burns ~50ms of
// synchronous CPU to check whether the account is still capped at the
// Workers Free plan's 10ms-per-request limit, or the Paid plan's much
// higher one, without needing billing-API access.
export async function onRequestGet() {
  const start = Date.now();
  let x = 0;
  while (Date.now() - start < 50) {
    x += Math.sqrt(x + 1);
  }
  return new Response(JSON.stringify({ ok: true, burnedMs: Date.now() - start, x }), {
    headers: { "content-type": "application/json" },
  });
}
