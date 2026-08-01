-- Serves the hub retention sweep (manifest.retention.titles), which seeks rows
-- older than the household's window and then applies the `status` exemption
-- that keeps unwatched titles forever. The existing (status, created_at) index
-- leads with the wrong column for that scan.
CREATE INDEX IF NOT EXISTS app_watchlist__titles_created_idx
  ON app_watchlist__titles (created_at);
