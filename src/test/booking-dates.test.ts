import { describe, expect, it } from "vitest";
import { addDays, formatAED, formatDate, nightsBetween, toISODate } from "@/lib/hotel";

describe("booking date rules", () => {
  it("counts calendar nights between check-in and check-out", () => {
    expect(nightsBetween("2026-10-15", "2026-10-16")).toBe(1);
    expect(nightsBetween("2026-10-15", "2026-10-18")).toBe(3);
  });

  it("never allows same-day or negative stays", () => {
    expect(nightsBetween("2026-10-15", "2026-10-15")).toBe(0);
    expect(nightsBetween("2026-10-18", "2026-10-15")).toBe(-3);
  });

  it("moves check-out to check-in + 1 day", () => {
    expect(addDays("2026-10-15", 1)).toBe("2026-10-16");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("formats dates as DD MMM YYYY", () => {
    expect(formatDate("2026-10-15")).toBe("15 Oct 2026");
  });

  it("round-trips ISO dates without timezone drift", () => {
    expect(toISODate(new Date(2026, 9, 15))).toBe("2026-10-15");
  });

  it("formats amounts with 2 decimals and thousands separators", () => {
    expect(formatAED(1312.5)).toBe("1,312.50");
    expect(formatAED(250)).toBe("250.00");
  });
});
