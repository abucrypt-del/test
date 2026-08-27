-- Core relational data for Al Yazi Mandi billing: menu items, customers,
-- bookings, sales/invoices, and staff accounts. Everything else (live cabin
-- ticket state, KOTs, printers, role permissions, small settings blobs)
-- stays on the localStorage + IndexedDB + AUTH_KV sync already in place,
-- since that's fast-changing operational state rather than reporting/
-- relational data.

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  legacy_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  password TEXT,
  locked INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  legacy_id INTEGER,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  badge TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  legacy_id INTEGER UNIQUE,
  customer_id INTEGER REFERENCES customers(id),
  cabin_legacy_id INTEGER,
  cabin_name TEXT,
  guest_name TEXT NOT NULL,
  phone TEXT,
  guests INTEGER,
  datetime TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0,
  cancelled INTEGER NOT NULL DEFAULT 0,
  notified_hour INTEGER NOT NULL DEFAULT 0,
  notified_half_hour INTEGER NOT NULL DEFAULT 0,
  cancel_reason TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  legacy_id INTEGER UNIQUE,
  order_number INTEGER,
  customer_id INTEGER REFERENCES customers(id),
  subtotal REAL,
  discount_type TEXT,
  discount_value REAL,
  tax REAL,
  total REAL NOT NULL,
  method TEXT,
  mode TEXT,
  paid_upfront INTEGER NOT NULL DEFAULT 0,
  user_name TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id),
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL
);

-- Cross-device inbox: a staff member's "forgot password" tap happens on
-- their own device before they're ever logged in, and the Super Admin
-- checks the notification bell on a different device entirely — this
-- table is what actually lets the request reach them.
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  legacy_id INTEGER UNIQUE,
  user_id INTEGER,
  user_name TEXT NOT NULL,
  role TEXT,
  requested_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime ON bookings(datetime);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Distinguishes bookings a guest made themselves on the public site from
-- ones staff entered in-app. Errors harmlessly on redeploys where this
-- column already exists (the deploy step that runs this file tolerates
-- failure by design — see .github/workflows/pages-deploy.yml).
ALTER TABLE bookings ADD COLUMN source TEXT NOT NULL DEFAULT 'staff';

-- Enforces "one active booking per cabin per slot" at the data layer, not
-- just in application code — two simultaneous requests for the same
-- cabin+datetime can't both insert; the second hits this constraint.
-- Partial (WHERE cancelled = 0) so a cancelled booking frees the slot.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_cabin_slot ON bookings(cabin_legacy_id, datetime) WHERE cancelled = 0;
