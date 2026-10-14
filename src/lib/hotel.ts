// Videos
import video1 from "@/assets/hero-video-1.webm";
import video2 from "@/assets/hero-video-2.webm";
import video3 from "@/assets/hero-video-3.webm";
import video4 from "@/assets/hero-video-4.webm";
import video5 from "@/assets/hero-video-5.webm";
import video6 from "@/assets/hero-video-6.webm";

// Background music
import music from "@/assets/hero-oud-music.mp3";

// Room images
import queen from "@/assets/queen.jpg";
import twin from "@/assets/actual-twin.jpg";
import deluxe from "@/assets/deluxe-room-new.jpg";
import suite from "@/assets/suite-room-new.jpg";
import extraRoom from "@/assets/room-gallery-new.jpg";

// Hotel and dining images
import restaurant from "@/assets/actual-dining.jpg";
import lobby from "@/assets/actual-lounge.jpg";
import exterior from "@/assets/actual-reception.jpg";
import building from "@/assets/al-hayat-building-updated.png";
import diningWide from "@/assets/actual-dining-wide.jpg";
import diningLounge from "@/assets/actual-dining-lounge.jpg";
import diningTable from "@/assets/actual-dining-table.jpg";

// Facilities
import pool from "@/assets/actual-pool.jpg";
import gym from "@/assets/actual-gym.jpg";
import sauna from "@/assets/actual-sauna.jpg";
import steam from "@/assets/actual-steam.jpg";
import location from "@/assets/actual-location.jpg";
import jacuzzi from "@/assets/jacuzzi.jpg";

// Exports
export const heroVideos = [
  video1,
  video2,
  video3,
  video4,
  video5,
  video6,
];

export const heroMusic = music;

export const photos = {
  queen,
  twin,
  deluxe,
  suite,
  restaurant,
  lobby,
  exterior,
  pool,
  gym,
  sauna,
  steam,
  location,
  additionalRoom: extraRoom,
  building,
  buffet: diningWide,
  coffee: diningLounge,
  roomService: diningTable,
  kitchen: diningWide,
  jacuzzi,
  room: deluxe,
};


export const hotelLeadership: Record<"owner" | "manager", { role: string; photo: string | null; quote: string }> = {
  owner: { role: "", photo: null, quote: "True hospitality begins with a warm welcome and lives on in the memories our guests take home." },
  manager: { role: "Hotel Manager", photo: null, quote: "Every detail matters, because every guest deserves a comfortable stay and genuinely caring service." },
};

export const CONTACT = {
  address: "Zahraa St., Facing King Faisal Masjid, Sharjah - U.A.E",
  email: "reservation@alhayat-hotel.com",
  phone: "+971 6 506 6222",
  phoneHref: "tel:+97165066222",
  whatsapp: "+971 50 376 8262",
  whatsappUrl: "https://wa.me/971503768262",
  website: "www.alhayat-hotel.com",
};


export type RoomType = "Queen" | "Twin" | "Deluxe" | "Suite" | "Standard Connecting Family Room";
export const ROOM_RATES: Record<RoomType, number> = { Queen: 250, Twin: 250, Deluxe: 350, Suite: 500,"Standard Connecting Family Room":500 };
export const roomTypes = Object.keys(ROOM_RATES) as RoomType[];
export const calculateNights = (arrival: string, departure: string) => {
  const start = new Date(arrival).getTime();
  const end = new Date(departure).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
};
export const calculateTotal = (rate: number, nights: number, taxRate = 0.05) => rate * nights * (1 + taxRate);

// Date-only helpers (YYYY-MM-DD, local midnight — no timezone/DST drift)
export const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
export const addDays = (iso: string, days: number) => {
  const d = parseISODate(iso);
  if (!d) return "";
  d.setDate(d.getDate() + days);
  return toISODate(d);
};
export const nightsBetween = (checkIn: string, checkOut: string) => {
  const a = parseISODate(checkIn);
  const b = parseISODate(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
};
export const formatDate = (iso: string) => {
  const d = parseISODate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
export const formatAED = (n: number) => n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const navItems = [
  ["Home", "/"], ["Hotel", "/hotel"], ["Rooms", "/rooms"], ["Dining", "/dining"],
  ["Recreation", "/recreation"], ["Gallery", "/gallery"], ["Location", "/location"], ["Contact", "/contact"],
] as const;

export const meta = (title: string, description: string, image?: string) => [
  { title }, { name: "description", content: description }, { property: "og:title", content: title },
  { property: "og:description", content: description }, { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
];
