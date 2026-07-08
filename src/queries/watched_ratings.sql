SELECT
  id,
  title,
  kind,
  genre,
  rating,
  watched_by_name,
  watched_at
FROM app_watchlist__titles
WHERE status = 'watched'
ORDER BY (watched_at IS NULL), watched_at DESC
LIMIT 500
