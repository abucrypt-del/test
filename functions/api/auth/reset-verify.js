import { json } from "../../_shared/http.js";

export async function onRequestGet({ request, env }) {
  if (!env.AUTH_KV) return json({ valid: false });
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token) return json({ valid: false });

  const record = await env.AUTH_KV.get(`reset:${token}`, "json");
  const valid = !!record && !record.used && record.expiresAt > Date.now();
  return json({ valid });
}
