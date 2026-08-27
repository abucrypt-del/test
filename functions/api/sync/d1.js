import { json } from "../../_shared/http.js";

// Mirrors the billing app's core relational data (menu items, bookings,
// customers, sales/invoices) into D1. POST upserts everything found in the
// snapshot; GET reconstructs the same alyazi-* localStorage shapes so a
// fresh browser can hydrate from the cloud copy. Live in-progress cabin
// ticket state and small config blobs intentionally stay out of D1 — they
// still go through the AUTH_KV-backed /api/sync/state endpoint.

function safeParse(raw) {
  if (typeof raw !== "string") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function upsertMenuItems(db, snapshot) {
  const items = safeParse(snapshot["alyazi-menu-en-v6"]);
  if (!Array.isArray(items)) return;
  const stmts = items
    .filter(item => item && item.code)
    .map(item => db.prepare(
      `INSERT INTO menu_items (legacy_id, code, name, description, price, category, image, badge, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, datetime('now'))
       ON CONFLICT(code) DO UPDATE SET
         legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
         price = excluded.price, category = excluded.category, image = excluded.image,
         badge = excluded.badge, updated_at = datetime('now')`
    ).bind(item.id ?? null, item.code, item.name ?? "", item.description ?? "", item.price ?? 0,
      item.category ?? "", item.image ?? "", item.badge ?? null));
  if (stmts.length) await db.batch(stmts);
}

async function upsertCategories(db, snapshot) {
  const categories = safeParse(snapshot["alyazi-categories-v1"]);
  if (!Array.isArray(categories)) return;
  const stmts = categories
    .filter(name => typeof name === "string" && name.trim())
    .map((name, index) => db.prepare(
      `INSERT INTO categories (name, sort_order) VALUES (?1, ?2)
       ON CONFLICT(name) DO UPDATE SET sort_order = excluded.sort_order`
    ).bind(name, index));
  if (stmts.length) await db.batch(stmts);
}

async function upsertCustomer(db, name, phone) {
  if (!phone) return null;
  await db.prepare(
    `INSERT INTO customers (name, phone, first_seen_at, last_seen_at) VALUES (?1, ?2, datetime('now'), datetime('now'))
     ON CONFLICT(phone) DO UPDATE SET name = excluded.name, last_seen_at = datetime('now')`
  ).bind(name || phone, phone).run();
  const row = await db.prepare("SELECT id FROM customers WHERE phone = ?1").bind(phone).first();
  return row?.id ?? null;
}

async function upsertBookings(db, snapshot) {
  const bookings = safeParse(snapshot["alyazi-bookings-v1"]);
  if (!Array.isArray(bookings)) return;
  for (const booking of bookings) {
    if (!booking || !booking.id) continue;
    const customerId = await upsertCustomer(db, booking.name, booking.phone);
    await db.prepare(
      `INSERT INTO bookings (legacy_id, customer_id, cabin_legacy_id, cabin_name, guest_name, phone, guests,
         datetime, confirmed, cancelled, notified_hour, notified_half_hour, cancel_reason, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, datetime('now'))
       ON CONFLICT(legacy_id) DO UPDATE SET
         customer_id = excluded.customer_id, cabin_legacy_id = excluded.cabin_legacy_id,
         cabin_name = excluded.cabin_name, guest_name = excluded.guest_name, phone = excluded.phone,
         guests = excluded.guests, datetime = excluded.datetime, confirmed = excluded.confirmed,
         cancelled = excluded.cancelled, notified_hour = excluded.notified_hour,
         notified_half_hour = excluded.notified_half_hour, cancel_reason = excluded.cancel_reason,
         updated_at = datetime('now')`
    ).bind(booking.id, customerId, booking.cabinId ?? null, booking.cabinName ?? "", booking.name ?? "",
      booking.phone ?? "", booking.guests ?? null, booking.datetime ?? "", booking.confirmed ? 1 : 0,
      booking.cancelled ? 1 : 0, booking.notifiedHour ? 1 : 0, booking.notifiedHalfHour ? 1 : 0,
      booking.cancelReason ?? null).run();
  }
}

async function upsertSales(db, snapshot) {
  const sales = safeParse(snapshot["alyazi-sales-v1"]);
  if (!Array.isArray(sales)) return;
  for (const sale of sales) {
    if (!sale || !sale.id) continue;
    await db.prepare(
      `INSERT INTO sales (legacy_id, total, method, mode, paid_upfront, user_name, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
       ON CONFLICT(legacy_id) DO UPDATE SET
         total = excluded.total, method = excluded.method, mode = excluded.mode,
         paid_upfront = excluded.paid_upfront, user_name = excluded.user_name`
    ).bind(sale.id, sale.total ?? 0, sale.method ?? "", sale.mode ?? "", sale.paidUpfront ? 1 : 0,
      sale.user ?? "", sale.createdAt ?? new Date().toISOString()).run();

    const saleRow = await db.prepare("SELECT id FROM sales WHERE legacy_id = ?1").bind(sale.id).first();
    if (!saleRow) continue;
    await db.prepare("DELETE FROM sale_items WHERE sale_id = ?1").bind(saleRow.id).run();
    const items = Array.isArray(sale.items) ? sale.items : [];
    const stmts = items.map(lineItem => db.prepare(
      `INSERT INTO sale_items (sale_id, name, price, quantity) VALUES (?1, ?2, ?3, ?4)`
    ).bind(saleRow.id, lineItem.name ?? "", lineItem.price ?? 0, lineItem.quantity ?? 1));
    if (stmts.length) await db.batch(stmts);
  }
}

async function upsertUsers(db, snapshot) {
  const users = safeParse(snapshot["alyazi-users-v1"]);
  if (!Array.isArray(users)) return;
  const stmts = users
    .filter(user => user && user.id && user.name)
    .map(user => db.prepare(
      `INSERT INTO users (legacy_id, name, email, phone, role, password, locked, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime('now'))
       ON CONFLICT(legacy_id) DO UPDATE SET
         name = excluded.name, email = excluded.email, phone = excluded.phone, role = excluded.role,
         password = excluded.password, locked = excluded.locked, updated_at = datetime('now')`
    ).bind(user.id, user.name, user.email ?? "", user.phone ?? "", user.role ?? "User",
      user.password ?? null, user.locked ? 1 : 0));
  if (stmts.length) await db.batch(stmts);
}

async function upsertResetRequests(db, snapshot) {
  const requests = safeParse(snapshot["alyazi-password-reset-requests"]);
  if (!Array.isArray(requests)) return;
  const stmts = requests
    .filter(reqst => reqst && reqst.id)
    .map(reqst => db.prepare(
      `INSERT INTO password_reset_requests (legacy_id, user_id, user_name, role, requested_at)
       VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(legacy_id) DO NOTHING`
    ).bind(reqst.id, reqst.userId ?? null, reqst.userName ?? "", reqst.role ?? "",
      reqst.requestedAt ?? new Date().toISOString()));
  if (stmts.length) await db.batch(stmts);
}

export async function onRequestPost({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.data !== "object" || body.data === null) {
    return json({ ok: false, error: "invalid_body" }, 400);
  }
  const db = env.BILLING_DB;
  await upsertMenuItems(db, body.data);
  await upsertCategories(db, body.data);
  await upsertBookings(db, body.data);
  await upsertSales(db, body.data);
  await upsertUsers(db, body.data);
  await upsertResetRequests(db, body.data);
  return json({ ok: true, updatedAt: Date.now() });
}

// Called the moment Super Admin resolves a request, so it stops reappearing
// from other devices' next sync push instead of waiting on a full re-sync.
export async function onRequestDelete({ request, env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ ok: false, error: "missing_id" }, 400);
  await env.BILLING_DB.prepare("DELETE FROM password_reset_requests WHERE legacy_id = ?1").bind(Number(id)).run();
  return json({ ok: true });
}

export async function onRequestGet({ env }) {
  if (!env.BILLING_DB) return json({ ok: false, error: "not_configured" }, 500);
  const db = env.BILLING_DB;

  const menuRows = await db.prepare("SELECT * FROM menu_items ORDER BY id").all();
  const menuItems = menuRows.results.map(row => ({
    id: row.legacy_id ?? row.id, name: row.name, description: row.description, price: row.price,
    category: row.category, image: row.image, badge: row.badge || undefined, code: row.code,
  }));

  const categoryRows = await db.prepare("SELECT name FROM categories ORDER BY sort_order").all();
  const categories = categoryRows.results.map(row => row.name);

  const bookingRows = await db.prepare("SELECT * FROM bookings ORDER BY id").all();
  const bookings = bookingRows.results.map(row => ({
    id: row.legacy_id, cabinId: row.cabin_legacy_id, cabinName: row.cabin_name, name: row.guest_name,
    phone: row.phone, guests: row.guests, datetime: row.datetime, confirmed: !!row.confirmed,
    cancelled: !!row.cancelled, notifiedHour: !!row.notified_hour, notifiedHalfHour: !!row.notified_half_hour,
    cancelReason: row.cancel_reason || undefined,
  }));

  const saleRows = await db.prepare("SELECT * FROM sales ORDER BY id").all();
  const sales = [];
  for (const row of saleRows.results) {
    const itemRows = await db.prepare("SELECT name, price, quantity FROM sale_items WHERE sale_id = ?1").bind(row.id).all();
    sales.push({
      id: row.legacy_id, total: row.total, method: row.method, mode: row.mode,
      paidUpfront: row.paid_upfront ? true : undefined, createdAt: row.created_at, user: row.user_name,
      items: itemRows.results.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
    });
  }

  const userRows = await db.prepare("SELECT * FROM users ORDER BY id").all();
  const users = userRows.results.map(row => ({
    id: row.legacy_id, name: row.name, email: row.email || "", phone: row.phone || "",
    role: row.role, password: row.password || undefined, locked: !!row.locked,
  }));

  const resetRequestRows = await db.prepare("SELECT * FROM password_reset_requests ORDER BY id").all();
  const resetRequests = resetRequestRows.results.map(row => ({
    id: row.legacy_id, userId: row.user_id, userName: row.user_name, role: row.role, requestedAt: row.requested_at,
  }));

  // An empty array is a real JS value, not "no data" — sending "[]" would
  // make the client think D1 has an authoritative (empty) answer and skip
  // its own seed defaults. Send null instead when a table has nothing yet.
  const orNull = list => (list.length ? JSON.stringify(list) : null);

  return json({
    ok: true,
    data: {
      "alyazi-menu-en-v6": orNull(menuItems),
      "alyazi-categories-v1": orNull(categories),
      "alyazi-bookings-v1": orNull(bookings),
      "alyazi-sales-v1": orNull(sales),
      "alyazi-users-v1": orNull(users),
      "alyazi-password-reset-requests": orNull(resetRequests),
    },
  });
}
