import { describe, expect, it } from "vitest";
import { heroVideos } from "@/lib/hotel";

describe("Uploaded hotel welcome videos", () => {
  it("includes all six distinct videos in the autoplay playlist", () => {
    expect(heroVideos).toHaveLength(6);
    expect(new Set(heroVideos).size).toBe(6);
  });
});