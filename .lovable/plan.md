# Update Al Hayat Hotel Sharjah

## Goal
Rebuild the current public hotel site inside this project while preserving its established navy, gold, cream visual identity, typography, motion, and multi-page structure. Replace only the requested content, imagery, contact details, forms, and interactive features.

## Pages and shared experience
- Build the shared sticky header, mobile menu, footer, newsletter field, page transitions, scroll reveals, image fallbacks, and site-wide WhatsApp shortcut.
- Create the requested routes: Home, Hotel, Rooms, Dining, Recreation, Offers, Gallery, Contact, and Book.
- Keep the current site's page composition and visual language, using the exact existing logo found on the supplied site in the header, footer, and favicon.
- Apply the supplied real address, phone, email, WhatsApp, website, four-star branding, and SEO details everywhere; remove all placeholder staff and old contact information.

## Page content
- Home: video-first full-screen welcome with slideshow fallback, audio control, option cards, director section, highlights, reception contact, and three experience previews.
- Hotel: supplied location/about copy, hotel photography, and service highlights.
- Rooms: four responsive room cards with exact room names, prices, amenity icons, and room-aware booking links.
- Dining: five-image carousel/lightbox, meal timings, restaurant copy, and conference-room contact card.
- Recreation: seven requested wellness cards and opening hours.
- Offers: editable, price-free placeholder cards in the established style.
- Gallery: masonry image collection with keyboard-accessible lightbox.
- Contact: WhatsApp-ready form, real details, map, and nearby attractions.
- Book: validated booking form with room preselection, automatic nights/rate/estimate, editable calculated fields, and a prefilled WhatsApp request.

## Assets and resilience
- Download and serve the supplied hotel photos through the project asset flow rather than hotlinking them.
- Use `/public/videos/hero.mp4` when present; otherwise keep the animated slideshow visible without a broken media state.
- Use meaningful alt text, lazy loading below the first view, and branded fallbacks for failed images.

## Validation
- Add focused tests for room rates and booking calculations.
- Verify all routes and key interactions on desktop and mobile, including navigation, menu, gallery/lightbox, room preselection, booking validation, total calculation, WhatsApp links, and media fallbacks.
- Confirm route-specific metadata and a clean preview build.
