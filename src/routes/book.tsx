
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Lock,
  MessageCircle,
  Minus,
  Plus,
} from "lucide-react";

import { PageHero, SectionTitle } from "@/components/site";
import {
  CONTACT,
  ROOM_RATES,
  addDays,
  formatAED,
  formatDate,
  meta,
  nightsBetween,
  photos,
  roomTypes,
  toISODate,
  type RoomType,
} from "@/lib/hotel";

const BILLING = "Direct Payment";
const TAX_RATE = 0.05;

const API_BASE_URL =
  import.meta.env["VITE_API_BASE_URL"] || "http://127.0.0.1:8000";

const ROOM_CATEGORY_IDS: Record<RoomType, number> = {
  Queen: 1,
  Twin: 2,
  Deluxe: 3,
  Suite: 4,
  "Standard Connecting Family Room": 5,
};

// Must match room_categories.max_guests in PostgreSQL.
const ROOM_CAPACITY: Record<RoomType, number> = {
  Queen: 4,
  Twin: 4,
  Deluxe: 4,
  Suite: 4,
  "Standard Connecting Family Room": 8,
};

const ROOM_GUEST_LIMITS: Record<
  RoomType,
  { adults: number; children: number }
> = {
  Queen: { adults: 2, children: 2 },
  Twin: { adults: 2, children: 2 },
  Deluxe: { adults: 2, children: 2 },
  Suite: { adults: 2, children: 2 },
  "Standard Connecting Family Room": { adults: 4, children: 4 },
};

type Booking = {
  guest: string;
  email: string;
  phone: string;
  company: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room: RoomType;
};

type CreatedBooking = {
  message: string;
  booking_id: number;
  booking_reference: string;
  status: string;
  customer_id?: number;
  room_category?: string;
  check_in?: string;
  check_out?: string;
  nights?: number;
  total_amount: number;
  currency: string;
  available_rooms_after_booking?: number;
};

const today = toISODate(new Date());

const initial: Booking = {
  guest: "",
  email: "",
  phone: "",
  company: "",
  checkIn: today,
  checkOut: addDays(today, 1),
  adults: 1,
  children: 0,
  room: "Queen",
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(roomTypes.includes(search["room"] as RoomType)
      ? { room: search["room"] as RoomType }
      : {}),
  }),

  head: () => ({
    meta: meta(
      "Book Your Stay | Al Hayat Hotel Sharjah",
      "Book a Queen, Twin, Deluxe or Suite room at Al Hayat Hotel Sharjah.",
      photos.room,
    ),
  }),

  component: Book,
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getRoomDisplayName(room: RoomType): string {
  switch (room) {
    case "Deluxe":
      return "Deluxe King Room";
    case "Suite":
      return "Deluxe Suite Room";
    case "Standard Connecting Family Room":
      return "Standard Connecting Family Room";
    default:
      return `${room} Room`;
  }
}

function Book() {
  const { room } = Route.useSearch();

  const [data, setData] = useState<Booking>(() =>
    room ? { ...initial, room } : initial,
  );
  const roomDisplayName =
  data.room === "Deluxe"
    ? "Deluxe King Room"
    : data.room === "Suite"
      ? "Deluxe Suite Room"
      : `${data.room} Room`;


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailTouched, setEmailTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const [createdBooking, setCreatedBooking] =
    useState<CreatedBooking | null>(null);

  const [apiError, setApiError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const nights = nightsBetween(data.checkIn, data.checkOut);
  const rate = ROOM_RATES[data.room];
  const totalGuests = data.adults + data.children;
  const capacity = ROOM_CAPACITY[data.room];

  const subtotal = rate * Math.max(0, nights);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const emailInvalid =
    data.email.trim().length > 0 && !isValidEmail(data.email);

  const emailError =
    emailTouched && emailInvalid
      ? "Please enter a valid email address, e.g. name@example.com."
      : errors["email"];

  const set = <K extends keyof Booking>(
    key: K,
    value: Booking[K],
  ) => {
    setSent(false);
    setCreatedBooking(null);
    setApiError("");

    setData((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "checkIn" && typeof value === "string" && value) {
        if (
          !next.checkOut ||
          nightsBetween(value, next.checkOut) < 1
        ) {
          next.checkOut = addDays(value, 1);
        }
      }

      return next;
    });

    setErrors((prev) => {
      if (!prev[key as string]) return prev;

      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const updateGuestCount = (
  type: "adults" | "children",
  value: number,
) => {
  const maxForType = ROOM_GUEST_LIMITS[data.room][type];
  const otherType = type === "adults" ? data.children : data.adults;

  const nextValue = Math.max(
    type === "adults" ? 1 : 0,
    Math.min(maxForType, value, capacity - otherType),
  );

  set(type, nextValue);
};

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};

    if (data.guest.trim().length < 2) {
      next["guest"] = "Please enter the guest name.";
    }

    if (!data.email.trim()) {
      next["email"] = "Email address is required.";
    } else if (!isValidEmail(data.email)) {
      next["email"] = "Please enter a valid email address.";
    }

    if (data.phone.trim().length < 7) {
      next["phone"] = "Please enter a valid phone number.";
    }

    if (!data.checkIn) {
      next["checkIn"] = "Select a check-in date.";
    } else if (data.checkIn < today) {
      next["checkIn"] = "Check-in cannot be in the past.";
    }

    if (!data.checkOut) {
      next["checkOut"] = "Select a check-out date.";
    } else if (nights < 1) {
      next["checkOut"] =
        "Check-out must be at least one night after check-in.";
    }

   const limits = ROOM_GUEST_LIMITS[data.room];

if (data.adults < 1 || data.adults > limits.adults) {
  next["adults"] =
    `Choose between 1 and ${limits.adults} adults.`;
}

if (data.children < 0 || data.children > limits.children) {
  next["children"] =
    `Choose between 0 and ${limits.children} children.`;
}

    if (totalGuests > capacity) {
      next["guests"] =
        `${data.room} Room allows a maximum of ${capacity} total guests.`;
    }

    return next;
  };

  const valid = useMemo(
    () => Object.keys(validate()).length === 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  // Existing WhatsApp reservation flow.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailTouched(true);

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    const msg = `Hello Al Hayat Hotel, I would like to make a reservation:
Guest Name: ${data.guest.trim()}
Email: ${data.email.trim()}
Phone: ${data.phone.trim()}
Company: ${data.company.trim() || "-"}
Check-in: ${formatDate(data.checkIn)} (from 2:00 PM)
Check-out: ${formatDate(data.checkOut)} (until 12:00 PM)
Adults: ${data.adults}
Children: ${data.children}
Total Guests: ${totalGuests}
Room Type: ${roomDisplayName}
No. of Nights: ${nights}
Rate per Night: AED ${formatAED(rate)}
Estimated Total (incl. 5% tax): AED ${formatAED(total)}
Billing Instruction: ${BILLING}`;

    window.open(
      `${CONTACT.whatsappUrl}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setSent(true);
  };

  // Create a pending booking in PostgreSQL through FastAPI.
  const bookNow = async () => {
    setEmailTouched(true);

    const next = validate();
    setErrors(next);
    setApiError("");
    setCreatedBooking(null);

    if (Object.keys(next).length > 0) return;

    setBookingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.guest.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          address: null,
          room_category_id: ROOM_CATEGORY_IDS[data.room],
          check_in: data.checkIn,
          check_out: data.checkOut,
          adults: data.adults,
          children: data.children,
          guests: totalGuests,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === "string"
            ? result.detail
            : "Booking could not be created. Please try again.",
        );
      }

      setCreatedBooking(result as CreatedBooking);
      setSent(false);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Could not connect to the booking server.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Download the PDF generated by FastAPI.
  const downloadReceipt = async () => {
    if (!createdBooking) return;

    setPdfLoading(true);
    setApiError("");

    let downloadUrl: string | undefined;

    try {
      const params = new URLSearchParams({
        email: data.email.trim(),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${encodeURIComponent(
          createdBooking.booking_reference,
        )}/receipt?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Booking not found. Please verify your booking details."
            : "Unable to download the booking PDF.",
        );
      }

      const blob = await response.blob();
      downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `booking-${createdBooking.booking_reference}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Could not download the PDF.",
      );
    } finally {
      if (downloadUrl) {
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl!), 1000);
      }

      setPdfLoading(false);
    }
  };

  return (
    <main>
      <PageHero
        title="Book Your Stay"
        eyebrow="Reservations"
        image={photos.suite}
      />

      <section className="section">
        <div className="section-inner">
          <SectionTitle eyebrow="Al Hayat Hotel Sharjah">
            Reservation Details
          </SectionTitle>

          {sent && (
            <p className="success-message" role="status">
              <CheckCircle2 />
              Your reservation request has been prepared. Please send it
              on WhatsApp to confirm.
            </p>
          )}

          <form className="booking-form" onSubmit={submit} noValidate>
            <div className="form-grid">
              <Field label="Guest Name" error={errors["guest"]}>
                <input
                  value={data.guest}
                  maxLength={100}
                  autoComplete="name"
                  onChange={(e) => set("guest", e.target.value)}
                />
              </Field>

             
<Field label="Email Address">
  <input
    type="email"
    value={data.email}
    maxLength={255}
    autoComplete="email"
    aria-invalid={Boolean(emailError)}
    aria-describedby={emailError ? "booking-email-error" : undefined}
    onBlur={() => setEmailTouched(true)}
    onChange={(e) => {
      const value = e.target.value;

      set("email", value);
      setEmailTouched(true);

      setErrors((prev) => {
        const updated = { ...prev };

        if (!value.trim()) {
          updated["email"] = "Email address is required.";
        } else if (!isValidEmail(value)) {
          updated["email"] = "Please enter a valid email address.";
        } else {
          delete updated["email"];
        }

        return updated;
      });
    }}
  />

  {emailError && (
    <span
      id="booking-email-error"
      className="field-error"
      role="alert"
    >
      {emailError}
    </span>
  )}
</Field>


              <Field label="Phone Number" error={errors["phone"]}>
                <input
                  type="tel"
                  value={data.phone}
                  maxLength={20}
                  autoComplete="tel"
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>

              <Field label="Company (optional)">
                <input
                  value={data.company}
                  maxLength={100}
                  autoComplete="organization"
                  onChange={(e) => set("company", e.target.value)}
                />
              </Field>

              <Field label="Check-in Date" error={errors["checkIn"]}>
                <input
                  type="date"
                  min={today}
                  value={data.checkIn}
                  onChange={(e) => set("checkIn", e.target.value)}
                />
              </Field>

              <Field label="Check-out Date" error={errors["checkOut"]}>
                <input
                  type="date"
                  min={data.checkIn ? addDays(data.checkIn, 1) : addDays(today, 1)}
                  value={data.checkOut}
                  onChange={(e) => set("checkOut", e.target.value)}
                />
              </Field>

              <p className="date-note field-full">
                <Clock3 />
                Standard check-in: 2:00 PM &nbsp;|&nbsp; Check-out: 12:00 PM
              </p>

              <div className="field">
                <span>Adults</span>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Remove adult"
                    disabled={data.adults <= 1}
                    onClick={() =>
                      updateGuestCount("adults", data.adults - 1)
                    }
                  >
                    <Minus />
                  </button>
                  <span aria-live="polite">{data.adults}</span>
                  <button
                    type="button"
                    aria-label="Add adult"
                    disabled={
  data.adults >= ROOM_GUEST_LIMITS[data.room].adults ||
  totalGuests >= capacity
}
                    onClick={() =>
                      updateGuestCount("adults", data.adults + 1)
                    }
                  >
                    <Plus />
                  </button>
                </div>
                
                {errors["adults"] && (
                  <span className="field-error">{errors["adults"]}</span>
                )}
              </div>

              <div className="field">
                <span>Children</span>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Remove child"
                    disabled={data.children <= 0}
                    onClick={() =>
                      updateGuestCount("children", data.children - 1)
                    }
                  >
                    <Minus />
                  </button>
                  <span aria-live="polite">{data.children}</span>
                  <button
  type="button"
  aria-label="Add child"
  disabled={
  data.children >= ROOM_GUEST_LIMITS[data.room].children ||
  totalGuests >= capacity
}
  onClick={() =>
    updateGuestCount("children", data.children + 1)
  }
>
  <Plus />
</button>
                    
                </div>
                
                {errors["children"] && (
                  <span className="field-error">{errors["children"]}</span>
                )}
              </div>

              <Field label="Room Type" error={errors["room"]}>
  <select
    value={data.room}
    onChange={(e) => set("room", e.target.value as RoomType)}
  >
    {roomTypes.map((type) => (
      <option key={type} value={type}>
        {getRoomDisplayName(type)}
      </option>
    ))}
  </select>
</Field>

              <Field label="No. of Nights" locked>
                <div className="field-locked" aria-live="polite">
                  <Lock />
                  <span>
                    {nights} night{nights === 1 ? "" : "s"}
                  </span>
                </div>
              </Field>

              <Field label="Rate per Night (AED)" locked>
                <div className="field-locked" aria-live="polite">
                  <Lock />
                  <span>AED {formatAED(rate)}</span>
                </div>
              </Field>

              <Field label="Billing Instruction" locked full>
                <div className="field-locked">
                  <Lock />
                  <span>{BILLING}</span>
                </div>
              </Field>
            </div>

            {totalGuests > capacity && (
              <p className="field-error" role="alert">
                {data.room} Room allows a maximum of {capacity} total guests.
              </p>
            )}

            <div className="booking-summary" aria-live="polite">
              <div className="summary-lines">
                <p>
                  <span>Room rate</span>
                  <span>
                    AED {formatAED(rate)} × {nights} night
                    {nights === 1 ? "" : "s"} = AED {formatAED(subtotal)}
                  </span>
                </p>
                <p>
                  <span>Tax (5%)</span>
                  <span>AED {formatAED(tax)}</span>
                </p>
                <p className="summary-total">
                  <span>Estimated Total</span>
                  <strong>AED {formatAED(total)}</strong>
                </p>
              </div>

              <div className="booking-actions">
                <button
                  className="button button-gold"
                  type="submit"
                  disabled={!valid || bookingLoading}
                >
                  <MessageCircle />
                  Confirm via WhatsApp
                </button>

                <button
                  className="button button-gold"
                  type="button"
                  disabled={!valid || bookingLoading}
                  onClick={bookNow}
                >
                  {bookingLoading ? "Creating Booking..." : "Book Now"}
                </button>
              </div>
            </div>

            {apiError && (
              <p className="field-error" role="alert">
                {apiError}
              </p>
            )}

            {createdBooking && (
              <div className="success-message" role="status">
                <CheckCircle2 />
                <div>
                  <strong>Booking created successfully!</strong>
                  <p>
                    Reference: <strong>{createdBooking.booking_reference}</strong>
                  </p>
                  <p>Status: {createdBooking.status}</p>
                  <p>
                    Backend total: {createdBooking.currency}{" "}
                    {formatAED(createdBooking.total_amount)}
                  </p>
                  <button
                    className="button button-gold"
                    type="button"
                    disabled={pdfLoading}
                    onClick={downloadReceipt}
                  >
                    <Download />
                    {pdfLoading ? "Preparing PDF..." : "Download Booking PDF"}
                  </button>
                </div>
              </div>
            )}

            <p className="note">
              All rates are subject to tax. Final confirmation is by the hotel
              reception. Booking through this form creates a pending
              reservation and does not process payment.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  locked = false,
  full = false,
  children,
}: {
  label: string;
  error?: string | undefined;
  locked?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`field ${full ? "field-full" : ""} ${
        locked ? "field-readonly" : ""
      }`}
    >
      <span>{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
