import { describe, it, expect } from "vitest";
import { genres, moods, visibleTitles, unwatchedPool, metaLine, stars, searchableFields } from "../src/logic.js";

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
