import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wifi,
  Tv,
  Wind,
  Coffee,
  LockKeyhole,
  Bath,
  Users,
} from "lucide-react";
import { PageHero, SafeImage, SectionTitle } from "@/components/site";
import { meta, photos, ROOM_RATES, type RoomType } from "@/lib/hotel";

const rooms: [string, string, string, number, string][] = [
  ["Queen", photos.queen, "A restful queen room with elegant modern comforts.", ROOM_RATES.Queen, "Queen"],
  ["Twin", photos.twin, "A practical twin setting for friends or colleagues.", ROOM_RATES.Twin, "Twin"],
  ["Deluxe king", photos.deluxe, "Extra space and refined details for an elevated stay.", ROOM_RATES.Deluxe, "Deluxe"],
  ["Deluxe Suite", photos.suite, "Generous living space designed for longer, luxurious stays.", ROOM_RATES.Suite, "Suite"],
  [
    "Standard Connecting Family Room",
    photos.additionalRoom,
    "Enjoy two connecting rooms,designed to bring your family.",
    500,
    "Standard Connecting Family",
  ],
];

const amenities = [
  [Wifi, "WiFi"],
  [Tv, "Flat-screen TV"],
  [Wind, "Air conditioning"],
  [Coffee, "Tea / coffee maker"],
  [LockKeyhole, "Safe box"],
  [Bath, "Private bathroom"],
] as const;

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: meta(
      "Rooms | Al Hayat Hotel Sharjah",
      "Explore Queen, Twin, Deluxe, Suite and Standard Connecting Family Rooms at Al Hayat Hotel Sharjah.",
      photos.room,
    ),
  }),
  component: Rooms,
});

function Rooms() {
  return (
    <main>
      <PageHero
        title="Rooms & Suites"
        eyebrow="Rest in Comfort"
        image={photos.suite}
      />

      <section className="section">
        <div className="section-inner">
          <SectionTitle eyebrow="Accommodation">Choose Your Stay</SectionTitle>

          <div className="room-grid">
            {rooms.map(([type, image, desc, rate, bookingType]) => (
              <article className="room-card" key={type}>
                <div className="room-image">
                  <SafeImage src={image} alt={`${type} at Al Hayat Hotel`} />
                </div>

                <div className="card-body">
                  <h3>{type}</h3>
                  <p>{desc}</p>

                  

                  <div className="amenities">
                    {amenities.map(([Icon, label]) => (
                      <span key={label}>
                        <Icon />
                        {label}
                      </span>
                    ))}
                  </div>

                  <p className="price">
                    AED {rate} <small>/ night + tax</small>
                  </p>

                  <Link
                    className="button button-gold"
                    to="/book"
                    search={{ room: bookingType as RoomType }}
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="note">All rates are subject to tax.</p>
        </div>
      </section>
    </main>
  );
}