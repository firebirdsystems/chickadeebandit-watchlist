-- Automations add a title to the watchlist on a member's behalf
-- (manifest.automation_actions.add_title).
--
-- `source_event_id` records which app event produced the row. The dispatcher's
-- dedupe guard reads it before running an action (SELECT 1 ... WHERE
-- source_event_id = ? LIMIT 1), so one event can never be applied twice --
-- neither by a retry nor by two rules pointed at the same trigger.
--
-- Nullable on purpose: every title the app's own UI creates leaves it NULL.
ALTER TABLE app_watchlist__titles ADD COLUMN source_event_id TEXT;

CREATE INDEX IF NOT EXISTS app_watchlist__titles_source_event_idx
  ON app_watchlist__titles (source_event_id);
