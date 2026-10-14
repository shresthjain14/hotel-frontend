import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, MessageCircle, Mail, MapPin, Phone, Globe, ChevronRight, Star, UserRound, Quote } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo-clear.png";
import logoFooter from "@/assets/logo-clear.png";
import { CONTACT, hotelLeadership, navItems } from "@/lib/hotel";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => setOpen(false), [path]);
  return <header className={`site-header ${scrolled || path !== "/" ? "site-header-solid" : ""}`}>
    <div className="top-strip"><span>Welcome to Al Hayat Hotel Sharjah</span><span className="top-contact"><a href={CONTACT.phoneHref}>{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span></div>
    <div className="nav-wrap">
      <Link to="/" aria-label="Al Hayat Hotel home"><img className="brand-logo" src={logo} alt="Al Hayat Hotel logo" /></Link>
      <nav className={`main-nav ${open ? "main-nav-open" : ""}`} aria-label="Main navigation">
        {navItems.map(([label, to]) => <Link key={to} to={to} activeOptions={{ exact: to === "/" }} activeProps={{ className: "active" }}>{label}</Link>)}
        <Link to="/book" className="button button-gold mobile-book">Book Now</Link>
      </nav>
      <Link to="/book" className="button button-gold desktop-book">Book Now</Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="footer"><div className="footer-grid">
    <div><img src={logoFooter} alt="Al Hayat Hotel logo" className="footer-logo" /><div className="stars" aria-label="4-star hotel">{[1,2,3,4].map(n => <Star key={n} fill="currentColor" />)}</div><p>Al Hayat Hotel Sharjah</p><strong>Discover Life...</strong></div>
    <div><h3>Quick Links</h3><div className="footer-links">{navItems.map(([label,to]) => <Link key={to} to={to}><ChevronRight />{label}</Link>)}</div></div>
    <div><h3>Contact</h3><ul className="contact-list"><li><MapPin />{CONTACT.address}</li><li><Phone /><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li><li><MessageCircle /><a href={CONTACT.whatsappUrl}>{CONTACT.whatsapp}</a></li><li><Mail /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li><li><Globe />{CONTACT.website}</li></ul></div>
    <div><h3>Newsletter</h3><p>Receive hotel news and special offers.</p><form className="newsletter" onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" maxLength={255}/><button type="submit" aria-label="Subscribe"><ChevronRight /></button></form></div>
  </div><div className="footer-bottom">© 2026 Al Hayat Hotel Sharjah. All Rights Reserved.</div></footer>;
}

export function WhatsAppButton() { return <a className="whatsapp-float" href={CONTACT.whatsappUrl} aria-label="Chat with Al Hayat Hotel on WhatsApp" target="_blank" rel="noreferrer"><MessageCircle /></a>; }

export function Stars() { return <div className="hero-stars" aria-label="4-star hotel">{[1,2,3,4].map(n => <Star key={n} fill="currentColor" />)}</div>; }

export function PageHero({ title, eyebrow, image }: { title: string; eyebrow?: string; image: string }) { return <section className="page-hero"><SafeImage src={image} alt="" eager/><div className="page-hero-overlay"/><div className="page-hero-content">{eyebrow && <span>{eyebrow}</span>}<h1>{title}</h1><div className="gold-rule"/></div></section>; }

export function SafeImage({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}><span>Al Hayat Hotel</span></div>;
  return <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />;
}

export function SectionTitle({ eyebrow, children, centered = true }: { eyebrow: string; children: ReactNode; centered?: boolean }) { return <div className={`section-title ${centered ? "centered" : ""}`}><span>{eyebrow}</span><h2>{children}</h2><div className="gold-rule"/></div>; }

export function ContactActions() { return <div className="button-row"><a className="button button-navy" href={CONTACT.phoneHref}><Phone />Call</a><a className="button button-outline" href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></div>; }

export function LeadershipSection({ kind }: { kind: "owner" | "manager" }) {
  const person = hotelLeadership[kind];
  const compact = kind === "manager";
  return <section className={`section leadership-section ${compact ? "leadership-compact section-muted" : ""}`} aria-label={compact ? "A message from the manager" : "A message from the hotel owner"}>
    <div className="section-inner leadership-layout">
      <div className="leadership-portrait">
        {person.photo ? <SafeImage src={person.photo} alt={person.role} /> : <div className="leadership-photo-pending" role="img" aria-label={`${person.role} portrait awaiting photo`}><UserRound aria-hidden="true" /><span>{compact ? "Hotel Manager" : "Hotel Arbab"}</span></div>}
      </div>
      <div className="leadership-message">
        <SectionTitle
  eyebrow={compact ? "A Personal Welcome" : "Our Hospitality, Our Promise"}
  centered={false}
>
  {compact ? "A Message from the Manager" : "A Message from the Managing Director"}
</SectionTitle>
        <Quote className="leadership-quote-mark" aria-hidden="true" />
        <blockquote><p>{person.quote}</p></blockquote>
        <p className="leadership-role">{person.role}</p>
      </div>
    </div>
  </section>;
}
