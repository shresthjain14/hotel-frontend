import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroMusic } from "@/components/hero-music";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Guest music control", () => {
  it("starts only on guest action and lets the guest mute and resume the uploaded music", async () => {
    let paused = true;
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(() => paused);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(async () => { paused = false; });
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => { paused = true; });
    const { container } = render(<HeroMusic />);
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("audio")?.getAttribute("src")).toContain("hero-oud-music.mp3");
    expect(container.querySelector("audio")?.loop).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Unmute music" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Mute music" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Mute music" }));
    expect(pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Unmute music" }));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });
});