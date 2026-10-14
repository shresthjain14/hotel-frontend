import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SafeImage, SectionTitle } from "@/components/site";
import { meta, photos } from "@/lib/hotel";

const offers: [string, string, string][] = [
  ["Stay Offers", photos.queen, "Seasonal stay experiences will be announced here."],
  ["Dining Offers", photos.restaurant, "Restaurant and coffee shop offers will be announced here."],
  ["Hotel Packages", photos.pool, "Curated hotel packages will be announced here."],
];

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: meta("Offers | Al Hayat Hotel Sharjah", "See the latest stay, dining and hotel offers from Al Hayat Hotel Sharjah.", photos.lobby) }),
  component: Offers,
});

function Offers() {
  return <main>
    <PageHero title="Offers" eyebrow="Discover More" image={photos.lobby} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="Special Experiences">Hotel Offers</SectionTitle>
      <div className="card-grid">{offers.map(([title, img, text]) => <article className="content-card" key={title}><SafeImage src={img} alt={title} /><div className="card-body"><h3>{title}</h3><p>{text}</p><Link className="text-link" to="/contact">Enquire</Link></div></article>)}</div>
    </div></section>
  </main>;
}
