import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroMusic } from "@/lib/hotel";

export function HeroMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      setPlaying(false);
      return;
    }
    setError("");
    try {
      await player.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError("Music could not play. Please try again.");
    }
  };

  return <>
    <audio ref={audio} src={heroMusic} loop preload="none" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
    <Button variant="ghost" size="icon" className="sound-button" onClick={toggle}
      aria-label={playing ? "Mute music" : "Unmute music"} aria-pressed={playing}
      title={playing ? "Mute music" : "Unmute music"}>
      {playing ? <Volume2 /> : <VolumeX />}
    </Button>
    {error && <p className="music-error" role="status">{error}</p>}
  </>;
}