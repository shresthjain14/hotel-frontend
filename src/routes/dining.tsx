import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";
import { ContactActions, PageHero, SafeImage, SectionTitle } from "@/components/site";
import { meta, photos } from "@/lib/hotel";

const dining: [string, string][] = [[photos.restaurant, "Restaurant"], [photos.buffet, "Restaurant Seating"], [photos.coffee, "Dining Lounge"], [photos.roomService, "Table Setting"], [photos.lobby, "Hotel Lounge"]];
const timings: [string, string][] = [["Breakfast", "6:00 AM - 10:30 AM"], ["Lunch", "12:00 PM - 3:30 PM"], ["Dinner", "7:30 PM - 11:00 PM"]];

export const Route = createFileRoute("/dining")({
  head: () => ({ meta: meta("Dining | Al Hayat Hotel Sharjah", "Enjoy buffet dining, a 24-hour coffee shop and room service at Al Hayat Hotel Sharjah.", photos.restaurant) }),
  component: Dining,
});

function Dining() {
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  useEffect(() => {
    if (!lightbox) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [lightbox]);
  const current = dining[i] ?? [photos.restaurant, "Restaurant"];
  return <main>
    <PageHero title="Dining" eyebrow="Local & International Flavours" image={photos.restaurant} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="A Taste of Al Hayat">Dining Experiences</SectionTitle>
      <div className="carousel-main" onClick={() => setLightbox(true)}>
        <SafeImage src={current[0]} alt={current[1]} eager />
        <div className="carousel-caption">{current[1]}</div>
        <button className="carousel-control prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setI((i + dining.length - 1) % dining.length); }}><ChevronLeft /></button>
        <button className="carousel-control next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setI((i + 1) % dining.length); }}><ChevronRight /></button>
      </div>
      <div className="thumbs">{dining.map(([img, label], n) => <button key={label} className={i === n ? "active" : ""} onClick={() => setI(n)} aria-label={`View ${label}`}><SafeImage src={img} alt={label} /></button>)}</div>
      {lightbox && <div className="lightbox" role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close lightbox"><X /></button><SafeImage src={current[0]} alt={current[1]} /></div>}
    </div></section>
    <section className="section section-muted"><div className="section-inner">
      <div className="timing-grid">{timings.map(([meal, time]) => <div className="timing-card" key={meal}><Clock3 /><h3>{meal}</h3><p>{time}</p></div>)}</div>
      <p className="lead note">Our restaurant on the mezzanine floor serves a buffet of authentic local and international cuisine. The coffee shop in the lounge is open 24 hours.</p>
    </div></section>
    <section className="section"><div className="section-inner split">
      <SafeImage src={photos.lobby} alt="Conference room placeholder" />
      <div><SectionTitle eyebrow="Gather at Al Hayat" centered={false}>Conference Room</SectionTitle><p className="lead">Meeting capacity: 30 pax. For reservation, please contact reception.</p><ContactActions /></div>
    </div></section>
  </main>;
}
