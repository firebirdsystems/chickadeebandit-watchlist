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

/**
 * Whether an UPDATE or DELETE that RAN touched a row. The hub answers a write
 * it narrowed, or one whose row is already gone, with a 200 and `changed: 0`,
 * so the request helper cannot throw for it.
 */
export function changedARow(res) {
  return res?.changed !== 0;
}

/**
 * Whether a failed write may have been stored and only its answer lost: no
 * HTTP status at all (the request threw), a 400 (the hub answers one for a
 * write that timed out), or a 5xx other than 507. A 403, a 507 and a 409 are
 * clean refusals. The caller re-reads by the id or stamp it kept to decide.
 */
export function outcomeUnknown(e) {
  return e?.status == null || e.status === 400 || (e.status >= 500 && e.status !== 507);
}

/**
 * The line for a failed write: "try again" only when trying again can work.
 * `removed` / `changed` are the caller's verdict from its re-read after a
 * write that changed nothing; otherwise the status decides. Never the hub's text.
 */
export function failureLine(e, { action, thing, removed = false, changed = false }) {
  if (removed || e?.status === 404) return `This ${thing} has been removed.`;
  // This app sends no batches, so a 409 is a stale single write.
  if (changed || e?.status === 409) return `This ${thing} was changed by someone else — check it first.`;
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return `That ${thing} already exists.`;
  if (e?.status === 403) return `You don’t have permission to ${action}.`;
  if (e?.status === 507) return "The household’s storage is full — free up space first.";
  return `Couldn’t ${action} — try again.`;
}

/**
 * Whether a stored row differs from the given values, over those keys only.
 * An empty value and a missing one are the same; no row differs from any.
 */
export function storedDiffers(row, fields) {
  return !row || Object.keys(fields).some(k => (row[k] ?? null) !== (fields[k] ?? null));
}
