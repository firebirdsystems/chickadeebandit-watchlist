SELECT
  id,
  title,
  kind,
  genre,
  mood,
  note,
  added_by_name,
  created_at
FROM app_watchlist__titles
WHERE status = 'unwatched'
ORDER BY created_at DESC
LIMIT 500
