import { describe, expect, it } from "vitest";
import { ROOM_RATES, calculateNights, calculateTotal } from "@/lib/hotel";

describe("booking rules", () => {
  it("uses the published room rates", () => {
    expect(ROOM_RATES).toEqual({ Queen: 250, Twin: 250, Deluxe: 350, Suite: 500 });
  });

  it("calculates nights from arrival and departure", () => {
    expect(calculateNights("2026-10-10T14:00", "2026-10-13T12:00")).toBe(3);
    expect(calculateNights("2026-10-13T12:00", "2026-10-10T14:00")).toBe(0);
  });

  it("adds 5% tax to the estimated total", () => {
    expect(calculateTotal(250, 2)).toBe(525);
    expect(calculateTotal(500, 1)).toBe(525);
  });
});
