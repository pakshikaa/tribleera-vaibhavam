import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

const MISSION_CARDS = [
  {
    title: "Heritage First",
    body: "Every vendor is chosen for cultural fit, not just portfolio size.",
  },
  {
    title: "Transparent Always",
    body: "No hidden fees. No surprise commissions. One clear 20% advance.",
  },
  {
    title: "Trustworthy By Design",
    body: "Background-checked vendors. Escrow payments. Dispute resolution. Built in.",
  },
];

const TIMELINE = [
  { year: "2024", event: "TRIBLEERA concept born in Jaffna" },
  { year: "2025", event: "First 10 vendors onboarded across photography and decoration" },
  { year: "2026", event: "Phase 1 launch: 5 categories, 25 verified studios, 5 cities" },
  { year: "2026+", event: "Mobile app and vendor tools in development" },
];

export default function AboutPage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-ink py-24 md:py-36">
        <Container className="max-w-3xl text-center">
          <div className="mb-8 flex justify-start">
            <BackButton href="/" label="Home" dark />
          </div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
            Our Story
          </p>
          <h1 className="font-display font-bold leading-tight text-cream" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", textShadow: "0 2px 30px rgba(21,4,12,0.8)" }}>
            Built for Jaffna&rsquo;s most important day.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream-dim">
            TRIBLEERA VAIBHAVAM was founded on one belief — Tamil couples deserve a wedding
            platform that understands their heritage, honours their traditions, and removes the
            chaos from one of life&rsquo;s most meaningful moments.
          </p>
        </Container>
      </section>

      {/* MISSION */}
      <section className="bg-ivory py-20 md:py-28">
        <Container>
          <h2 className="mb-12 text-center font-display text-slate" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            What we stand for
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {MISSION_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-[12px] border border-gold/20 bg-white p-8 shadow-soft"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-gold" />
                <h3 className="mb-3 font-display text-xl font-semibold text-burgundy-deep">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-soft">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TIMELINE */}
      <section className="bg-white py-20 md:py-28">
        <Container className="max-w-3xl">
          <h2 className="mb-14 text-center font-display text-slate" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            How we got here
          </h2>
          <div className="relative">
            <div className="absolute left-[72px] top-2 bottom-2 w-px bg-gold/20 hidden md:block" />
            <div className="space-y-10">
              {TIMELINE.map((item) => (
                <div key={item.year} className="flex items-start gap-8">
                  <div className="w-16 shrink-0 text-right">
                    <span className="font-display text-sm font-semibold text-gold-deep">
                      {item.year}
                    </span>
                  </div>
                  <div className="relative mt-0.5 hidden md:flex h-5 w-5 shrink-0 items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-gold" />
                    <div className="absolute h-5 w-5 rounded-full border border-gold/30" />
                  </div>
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-soft pt-0.5">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-20 md:py-28">
        <Container className="text-center">
          <h2 className="mb-8 font-display font-bold text-cream" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            Ready to plan your celebration?
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/vendors" variant="gold" size="lg">
              Browse vendors
            </Button>
            <Button href="/vendor/register" variant="glass" size="lg">
              Register as a vendor
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
