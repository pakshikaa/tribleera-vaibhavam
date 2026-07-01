import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <div className="bg-ivory py-16 md:py-24">
      <Container>
        <article className="mx-auto max-w-3xl font-body text-slate">
          <h1 className="mb-2 font-display text-4xl font-bold text-burgundy-deep">
            Privacy Policy
          </h1>
          <p className="mb-12 text-sm text-slate-soft">Effective date: January 1, 2026</p>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">1. What Data We Collect</h2>
            <p className="leading-relaxed text-slate-soft">
              When you use TRIBLERERA VAIBHAVAM, we collect the following information:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li><strong>Identity:</strong> Full name, profile photo (optional)</li>
              <li><strong>Contact:</strong> Phone number, email address</li>
              <li><strong>Event details:</strong> Wedding date, location, guest count, service preferences</li>
              <li><strong>Payment:</strong> Transaction references (we do not store card numbers)</li>
              <li><strong>Usage:</strong> Pages visited, searches performed, shortlisted vendors</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">2. How We Use Your Data</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>Matching you with relevant vendors based on your event details</li>
              <li>Processing and tracking payments and bookings</li>
              <li>Sending booking confirmations and service updates</li>
              <li>Improving our platform and personalising your experience</li>
              <li>Mediating disputes between customers and vendors</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">3. Who We Share It With</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>
                <strong>Vendors:</strong> Your name, event date, and contact number are shared with a
                vendor only after you confirm a booking with them.
              </li>
              <li>
                <strong>Payment processors:</strong> Transaction data is shared with our payment
                gateway partners to process advances and refunds.
              </li>
              <li>
                <strong>Legal authorities:</strong> We may disclose data if required by Sri Lankan law
                or a valid court order.
              </li>
            </ul>
            <p className="leading-relaxed text-slate-soft">
              We do not sell your personal data to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">4. Data Storage</h2>
            <p className="leading-relaxed text-slate-soft">
              Your data is stored on encrypted cloud infrastructure. We follow industry-standard
              security practices including encryption at rest and in transit. Data is retained for
              the duration of your account plus 3 years for legal compliance.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">5. Your Rights</h2>
            <p className="leading-relaxed text-slate-soft">You have the right to:</p>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate information</li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and data, subject to
                legal retention requirements
              </li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">6. Cookies</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li><strong>Session cookies:</strong> Keep you logged in during your visit</li>
              <li><strong>Preference cookies:</strong> Remember your shortlist, cart, and search filters</li>
              <li><strong>Analytics cookies:</strong> Help us understand how users navigate the platform</li>
            </ul>
            <p className="leading-relaxed text-slate-soft">
              You can disable cookies in your browser settings, though some features may not work
              correctly without them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">7. Contact for Privacy Concerns</h2>
            <p className="leading-relaxed text-slate-soft">
              To exercise your privacy rights or raise a concern, email us at{" "}
              <a href="mailto:hello@triblerera.com" className="text-burgundy underline-offset-2 hover:underline">
                hello@triblerera.com
              </a>
              . We will respond within 5 business days.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
