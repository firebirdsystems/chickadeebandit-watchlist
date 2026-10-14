import { describe, it, expect } from "vitest";
import { genres, moods, visibleTitles, unwatchedPool, metaLine, stars, searchableFields, changedARow, outcomeUnknown, storedDiffers, failureLine } from "../src/logic.js";

const TITLES = [
  { id: "1", status: "unwatched", genre: "Comedy", mood: "Cozy", kind: "movie", added_by_name: "Al" },
  { id: "2", status: "unwatched", genre: "Drama", mood: "", kind: "show", added_by_name: "Sam" },
  { id: "3", status: "watched", genre: "Comedy", mood: "Cozy", kind: "movie", added_by_name: "Al" },
  { id: "4", status: "unwatched", genre: " ", mood: "Tense", kind: "movie", added_by_name: "Al" },
];

describe("genres / moods", () => {
  it("collect unique, trimmed, sorted, non-empty", () => {
    expect(genres(TITLES)).toEqual(["Comedy", "Drama"]);
    expect(moods(TITLES)).toEqual(["Cozy", "Tense"]);
  });
});

describe("visibleTitles", () => {
  it("filters by view", () => {
    expect(visibleTitles(TITLES, "unwatched", "", "").map(t => t.id)).toEqual(["1", "2", "4"]);
    expect(visibleTitles(TITLES, "watched", "", "").map(t => t.id)).toEqual(["3"]);
  });
  it("filters by genre and mood", () => {
    expect(visibleTitles(TITLES, "unwatched", "Comedy", "").map(t => t.id)).toEqual(["1"]);
    expect(visibleTitles(TITLES, "unwatched", "", "Tense").map(t => t.id)).toEqual(["4"]);
  });
});

describe("unwatchedPool", () => {
  it("returns only unwatched titles", () => {
    expect(unwatchedPool(TITLES).map(t => t.id)).toEqual(["1", "2", "4"]);
  });
});

describe("metaLine", () => {
  it("joins kind, genre, mood, and attribution", () => {
    expect(metaLine(TITLES[0])).toBe("Movie · Comedy · Cozy · added by Al");
  });
  it("labels shows and omits blank fields", () => {
    expect(metaLine(TITLES[1])).toBe("Show · Drama · added by Sam");
  });
});

describe("stars", () => {
  it("renders filled and hollow stars", () => {
    expect(stars(3)).toBe("★★★☆☆");
    expect(stars(0)).toBe("☆☆☆☆☆");
    expect(stars(5)).toBe("★★★★★");
  });
});

describe("searchableFields", () => {
  it("matches on genre and mood, which is how a watchlist is actually browsed", () => {
    const fields = searchableFields({
      title: "The Grand Budapest Hotel", genre: "comedy", mood: "light",
      note: "Sam picked it", kind: "film", added_by_name: "Sam",
    });
    expect(fields).toContain("comedy");
    expect(fields).toContain("light");
  });
});

describe("changedARow", () => {
  it("accepts a write that touched its row", () => {
    expect(changedARow({ rows: [], changed: 1 })).toBe(true);
  });
  // The hub answers a write it narrowed, or one whose row is gone, with a 200.
  it("rejects a write that matched nothing", () => {
    expect(changedARow({ rows: [], changed: 0 })).toBe(false);
  });
});

describe("outcomeUnknown", () => {
  it("is true when the answer may have been lost", () => {
    expect(outcomeUnknown(new Error("Failed to fetch"))).toBe(true);
    for (const status of [400, 500, 502, 503]) expect(outcomeUnknown({ status })).toBe(true);
  });
  it("is false for a clean refusal", () => {
    for (const status of [403, 409, 507]) expect(outcomeUnknown({ status })).toBe(false);
  });
});

describe("failureLine", () => {
  const ctx = { action: "add the title", thing: "title" };
  it("names a duplicate by code, or by the hub's text where production lags", () => {
    expect(failureLine({ status: 400, code: "UNIQUE_CONSTRAINT" }, ctx)).toBe("That title already exists.");
    expect(failureLine(Object.assign(new Error("UNIQUE constraint failed: x.id"), { status: 400 }), ctx)).toBe("That title already exists.");
  });
  it("names a refusal without asking to retry", () => {
    expect(failureLine({ status: 403 }, ctx)).toBe("You don’t have permission to add the title.");
    expect(failureLine({ status: 507 }, ctx)).toBe("The household’s storage is full — free up space first.");
  });
  it("says removed for a 404 or a re-read that found no row", () => {
    expect(failureLine({ status: 404 }, ctx)).toBe("This title has been removed.");
    expect(failureLine(null, { ...ctx, removed: true })).toBe("This title has been removed.");
  });
  it("says changed for a 409 or a re-read that found the row moved on", () => {
    expect(failureLine({ status: 409 }, ctx)).toBe("This title was changed by someone else — check it first.");
    expect(failureLine(null, { ...ctx, changed: true })).toBe("This title was changed by someone else — check it first.");
  });
  it("asks to try again when there was no answer or the hub failed", () => {
    for (const e of [new Error("Failed to fetch"), { status: 400 }, { status: 500 }, { status: 503 }, null]) {
      expect(failureLine(e, ctx)).toBe("Couldn’t add the title — try again.");
    }
  });
});

describe("storedDiffers", () => {
  it("compares only the given keys, empty and missing alike", () => {
    expect(storedDiffers({ a: "x", b: null, c: "other" }, { a: "x", b: undefined })).toBe(false);
    expect(storedDiffers({ a: "x" }, { a: "y" })).toBe(true);
  });
  it("treats no row as different", () => {
    expect(storedDiffers(undefined, { a: "x" })).toBe(true);
    expect(storedDiffers(null, {})).toBe(true);
  });
});
