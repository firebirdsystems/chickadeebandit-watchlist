// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export function genres(titles) {
  return [...new Set(titles.map(t => (t.genre || "").trim()).filter(Boolean))].sort();
}

export function moods(titles) {
  return [...new Set(titles.map(t => (t.mood || "").trim()).filter(Boolean))].sort();
}

export function visibleTitles(titles, view, filterGenre, filterMood) {
  return titles.filter(t => {
    if (t.status !== view) return false;
    if (filterGenre && (t.genre || "").trim() !== filterGenre) return false;
    if (filterMood && (t.mood || "").trim() !== filterMood) return false;
    return true;
  });
}

export function unwatchedPool(titles) {
  return titles.filter(t => t.status === "unwatched");
}

export function metaLine(t) {
  const bits = [t.kind === "show" ? "Show" : "Movie"];
  if (t.genre) bits.push(t.genre);
  if (t.mood) bits.push(t.mood);
  bits.push(`added by ${t.added_by_name}`);
  return bits.join(" · ");
}

export function stars(n) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`).
 * Genre, mood and note are all searchable: a watchlist is browsed by
 * "something short and funny" far more often than by exact title.
 */
export function searchableFields(item) {
  return [item.title, item.genre, item.mood, item.note, item.kind, item.added_by_name];
}
