-- Family Watchlist — a single shared household list of titles.
-- Intentionally household-wide readable and writable (like the Grocery list):
-- any member may add a title, mark it watched, or remove it. Nothing here is
-- private, so no row_policies are declared. `status` is on the encryption
-- skip-list, so it can be filtered/counted in SQL (WHERE status = ...).
CREATE TABLE IF NOT EXISTS app_watchlist__titles (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  kind           TEXT NOT NULL DEFAULT 'movie',   -- 'movie' | 'show'
  genre          TEXT DEFAULT '',
  mood           TEXT DEFAULT '',
  note           TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'unwatched', -- 'unwatched' | 'watched'
  rating         INTEGER,                          -- 1..5, set when watched
  added_by_id    TEXT NOT NULL,
  added_by_name  TEXT NOT NULL,
  watched_by_name TEXT DEFAULT '',
  watched_at     TEXT,
  created_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS app_watchlist__titles_status_idx
  ON app_watchlist__titles (status, created_at);
