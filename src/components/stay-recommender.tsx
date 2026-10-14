import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ConciergeBell, LoaderCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site";
import { recommendStay } from "@/lib/recommendations.functions";

export function StayRecommender() {
  const recommend = useServerFn(recommendStay);
  const [needs, setNeeds] = useState("");
  const [pending, setPending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    if (needs.trim().length < 10) { setError("Please describe your travel needs in at least 10 characters."); return; }
    setPending(true); setError(""); setText("");
    try {
      const result = await recommend({ data: { needs } });
      setText(result.text); setError(result.error);
    } catch { setError("Recommendations are unavailable right now. Please contact reception."); }
    finally { setPending(false); }
  }
  return <section className="section section-muted"><div className="section-inner">
    <SectionTitle eyebrow="Your Personal Concierge">Plan Your Stay</SectionTitle>
    <form onSubmit={submit} className="stay-form">
      <label className="field" htmlFor="travel-needs"><span>Your travel needs</span>
        <textarea id="travel-needs" rows={4} maxLength={1500} required minLength={10} value={needs} onChange={e => setNeeds(e.target.value)} placeholder="A family stay with time by the pool, relaxed dining, and a room within AED 350 per night…" />
      </label>
      <Button type="submit" className="button button-gold" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <ConciergeBell />}{pending ? "Finding your options…" : "Get AI Recommendations"}</Button>
    </form>
    <div aria-live="polite" aria-busy={pending}>
      {error && <p className="field-error recommendation-error" role="alert">{error}</p>}
      {text && <div className="stay-result"><h3>Your Al Hayat Stay</h3><p>{text}</p><div className="button-row"><Button asChild className="button button-navy"><Link to="/book">Book Now<ArrowRight /></Link></Button><Link className="text-link" to="/rooms">Rooms</Link><Link className="text-link" to="/dining">Dining</Link><Link className="text-link" to="/recreation">Recreation</Link></div><p className="note">Subject to availability. Please confirm your preferences with reception.</p></div>}
    </div>
  </div></section>;
}