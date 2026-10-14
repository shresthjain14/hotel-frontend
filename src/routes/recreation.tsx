import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SafeImage, SectionTitle } from "@/components/site";
import { meta, photos } from "@/lib/hotel";

const items: [string, string, string][] = [
  ["Swimming Pool", photos.pool, "A covered outdoor pool for a refreshing swim."],
  ["Jacuzzi", photos.jacuzzi, "Unwind in warm, soothing bubbles."],
  ["Children's Pool", photos.pool, "A dedicated shallow pool for younger guests."],
  ["Men's Gym", photos.gym, "A well-equipped fitness space for men."],
  ["Women's Gym", photos.gym, "A dedicated fitness space for women."],
  ["Sauna", photos.sauna, "Relax and restore in calming dry heat."],
  ["Steam Room", photos.steam, "A tranquil space for warmth and renewal."],
];

export const Route = createFileRoute("/recreation")({
  head: () => ({ meta: meta("Recreation & Wellness | Al Hayat Hotel Sharjah", "Explore the pool, gyms, Jacuzzi, sauna and steam room at Al Hayat Hotel Sharjah.", photos.pool) }),
  component: Recreation,
});

function Recreation() {
  return <main>
    <PageHero title="Recreation & Wellness" eyebrow="Open daily 9:00 AM - 9:00 PM" image={photos.jacuzzi} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="Refresh & Recharge">Wellness Facilities</SectionTitle>
      <div className="recreation-grid">{items.map(([title, image, desc]) => <article className="content-card" key={title}><SafeImage src={image} alt={title} /><div className="card-body"><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
    </div></section>
  </main>;
}
