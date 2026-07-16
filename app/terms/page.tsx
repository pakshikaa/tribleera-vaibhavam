import { Container } from "@/components/ui/Container";
import { BackButton } from "@/components/ui/BackButton";

const disputeSteps = [
  {
    title: "Step 1: Raise the dispute within 48 hours",
    body: "Customers or vendors must submit the issue through TRIBLEERA support within 48 hours of the disputed service milestone or event completion. The report must include booking ID, summary of the issue, and any available photo, video, or message evidence.",
  },
  {
    title: "Step 2: Initial review within 2 business days",
    body: "TRIBLEERA acknowledges the complaint, freezes any escrowed amount still under platform control, and confirms whether the dispute is about service quality, vendor no-response, cancellation, damage, delay, or payment conduct.",
  },
  {
    title: "Step 3: Evidence window of 3 business days",
    body: "Both sides receive a request for evidence and must respond within 3 business days. If one side does not respond within that window, TRIBLEERA may decide based on the records already available.",
  },
  {
    title: "Step 4: Mediation outcome within 7 business days",
    body: "TRIBLEERA issues a written outcome covering refund, partial release, re-performance support, or closure. Where only part of the booking is in dispute, undisputed amounts may still be released.",
  },
  {
    title: "Step 5: Escalation review within 5 business days",
    body: "If either side contests the decision, one escalation request may be filed within 5 business days of the written outcome. A senior TRIBLEERA reviewer re-checks the file and issues the final platform decision on escrowed funds.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-ivory py-16 md:py-24">
      <Container>
        <BackButton href="/" label="Home" className="mb-8" />
        <article className="mx-auto max-w-3xl font-body text-slate">
          <h1 className="mb-2 font-display text-4xl font-bold text-burgundy-deep">
            Terms &amp; Conditions
          </h1>
          <p className="mb-12 text-sm text-slate-soft">Effective date: January 1, 2026</p>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">1. Introduction</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA VAIBHAVAM (&ldquo;TRIBLEERA&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a curated wedding services
              marketplace connecting Tamil couples with verified vendors across Sri Lanka. By
              accessing or using our platform, you agree to be bound by these Terms &amp; Conditions.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">2. User Accounts &amp; Eligibility</h2>
            <p className="leading-relaxed text-slate-soft">
              You must be at least 18 years old to use this platform. You are responsible for
              maintaining the confidentiality of your account credentials and for all activity
              that occurs under your account.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>One account per individual or business</li>
              <li>Accurate information must be provided at registration</li>
              <li>Accounts may be suspended for violations of these terms</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">3. Booking Process</h2>
            <p className="leading-relaxed text-slate-soft">
              Bookings on TRIBLEERA follow a three-stage process:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li><strong>Request:</strong> Customer selects a package and submits a booking request</li>
              <li><strong>Acceptance:</strong> Vendor confirms availability and accepts the request</li>
              <li><strong>Payment:</strong> Customer pays the advance and platform fee to confirm the booking</li>
            </ul>
            <p className="leading-relaxed text-slate-soft">
              A booking is only confirmed once payment is successfully processed and the vendor
              has accepted the request.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">4. Payment Terms</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA operates on a milestone-payment model:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li><strong>Advance (20%):</strong> Paid at booking confirmation and held in TRIBLEERA escrow where applicable</li>
              <li><strong>Platform fee (3%):</strong> Non-refundable fee charged to the customer on the service value</li>
              <li><strong>Balance (80%):</strong> Paid directly to the vendor after successful service delivery unless otherwise documented in writing</li>
            </ul>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA does not receive commission from vendors. The 3% platform fee is the sole
              revenue mechanism from customers.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">5. Cancellation &amp; Refund Policy</h2>
            <div className="overflow-x-auto rounded-[8px] border border-slate/10">
              <table className="w-full text-sm">
                <thead className="bg-ivory-deep">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate">Notice period</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate">Advance refund</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate">Platform fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/8 bg-white">
                  <tr>
                    <td className="px-4 py-3 text-slate-soft">30+ days before event</td>
                    <td className="px-4 py-3 text-slate-soft">50% refunded</td>
                    <td className="px-4 py-3 text-slate-soft">Non-refundable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-soft">7–29 days before event</td>
                    <td className="px-4 py-3 text-slate-soft">25% refunded</td>
                    <td className="px-4 py-3 text-slate-soft">Non-refundable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-soft">Under 7 days</td>
                    <td className="px-4 py-3 text-slate-soft">No refund</td>
                    <td className="px-4 py-3 text-slate-soft">Non-refundable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-soft">Vendor cancels</td>
                    <td className="px-4 py-3 text-slate-soft">100% refunded</td>
                    <td className="px-4 py-3 text-slate-soft">100% refunded</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">6. Vendor Obligations</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>Maintain accurate business information, service scope, and pricing</li>
              <li>Complete verification, contract execution, and onboarding checks required by TRIBLEERA</li>
              <li>Honour accepted bookings and deliver services as described</li>
              <li>Communicate professionally with all customers and respond within the agreed platform window</li>
              <li>Not solicit customers to bypass the TRIBLEERA platform for active bookings</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">7. Customer Obligations</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>Provide accurate event information at the time of booking</li>
              <li>Make advance payments within 24 hours of vendor acceptance unless a different payment deadline is shown</li>
              <li>Pay remaining balance to the vendor as agreed after service delivery</li>
              <li>Communicate service issues within 48 hours of the relevant delivery milestone</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">8. Dispute Resolution Process</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA acts as a mediator for disputes tied to bookings made on the platform. The dispute process below governs cancellations, vendor no-response, service quality concerns, delivery delays, partial fulfilment, and escrow release questions.
            </p>
            <div className="space-y-4">
              {disputeSteps.map((step) => (
                <div key={step.title} className="rounded-[10px] border border-slate/10 bg-white p-5 shadow-soft">
                  <h3 className="text-base font-semibold text-slate">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-soft">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">9. Escrow, Holds, and Evidence Rules</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>TRIBLEERA may temporarily hold escrowed funds while a dispute is under review</li>
              <li>Evidence may include chat records, call summaries, invoices, photos, videos, delivery proofs, and signed change requests</li>
              <li>If a party refuses to engage with the dispute process, TRIBLEERA may decide using the available booking record</li>
              <li>TRIBLEERA may partially release or partially refund escrow where only some deliverables are disputed</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">10. Final Escalation and External Remedies</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA&rsquo;s final escalation decision applies to funds held under platform control. If either side seeks remedies beyond escrow allocation, they remain responsible for pursuing those remedies directly under applicable Sri Lankan law. TRIBLEERA may share relevant booking records when legally required.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">11. Limitation of Liability</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA is a marketplace platform. We are not liable for the quality, safety, or
              legality of vendor services. Our total liability to any user shall not exceed the
              platform fee paid for the transaction in dispute, except where applicable law requires otherwise.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">12. Changes to Terms</h2>
            <p className="leading-relaxed text-slate-soft">
              We may update these terms from time to time. Continued use of the platform after
              changes constitutes acceptance of the updated terms. We will notify registered users
              of material changes via email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">13. Contact</h2>
            <p className="leading-relaxed text-slate-soft">
              For questions about these terms or for dispute notices, contact us at{" "}
              <a href="mailto:hello@TRIBLEERA.com" className="text-burgundy underline-offset-2 hover:underline">
                hello@TRIBLEERA.com
              </a>
              .
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
