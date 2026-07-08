# Family Watchlist

A shared list of movies and shows the household wants to watch together. Any member can add titles with a note about why, mark them watched with a 1–5 star rating, filter by genre or mood, or tap **Surprise Me** for a random pick from the unwatched list.

The Letterboxd/JustWatch use case, scoped to the family.

---

## Data model

A single `app_watchlist__titles` table. The watchlist is **intentionally
household-shared** — any member may add, edit, or remove titles and mark them
watched, exactly like the Grocery list. Nothing here is private, so no
`row_policies` are declared. See `migrations/001_init.sql`.

## Quick start

```bash
npm run dev     # preview at http://localhost:3001
npm run build   # produce dist/bundle.json
npm test        # manifest + ai_access validation
```
