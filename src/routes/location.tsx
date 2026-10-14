import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { ContactActions, PageHero, SectionTitle } from "@/components/site";
import { CONTACT, meta, photos } from "@/lib/hotel";

export const Route = createFileRoute("/location")({
  head: () => ({ meta: meta("Location | Al Hayat Hotel Sharjah", "Find Al Hayat Hotel on Zahraa Street, facing King Faisal Masjid in central Sharjah.", photos.location) }),
  component: Location,
});

function Location() {
  return <main>
    <PageHero title="Our Location" eyebrow="In the Heart of Sharjah" image={photos.location} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="Al Hayat Hotel Sharjah" centered={false}>Find Us</SectionTitle>
      <p className="location-address"><MapPin />{CONTACT.address}</p>
      <ContactActions />
    </div></section>
    <iframe className="map-frame" title="Al Hayat Hotel Sharjah location" loading="lazy" src="https://www.google.com/maps?q=Al%20Hayat%20Hotel%2C%20Zahraa%20St%2C%20Sharjah&output=embed" />
    <section className="section section-muted"><div className="section-inner">
      <SectionTitle eyebrow="Explore Sharjah">Nearby Attractions</SectionTitle>
      <div className="attractions"><span>Khalid Lagoon</span><span>Sharjah Aquarium</span><span>Gold Souq</span><span>Sharjah Expo</span><span>Sharjah Airport · 10 km</span><span>Dubai Airport · 20 km</span></div>
    </div></section>
  </main>;
}