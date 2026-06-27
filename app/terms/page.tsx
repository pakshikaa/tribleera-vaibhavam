import { Container } from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <div className="bg-ivory py-16 md:py-24">
      <Container>
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
              <li><strong>Advance (20%):</strong> Paid at booking confirmation, held in TRIBLEERA escrow</li>
              <li><strong>Platform fee (3%):</strong> Non-refundable fee charged to the customer on the service value</li>
              <li><strong>Balance (80%):</strong> Paid directly to the vendor after successful service delivery</li>
            </ul>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA does not receive commission from vendors. The 3% platform fee is the sole
              revenue mechanism from customers.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibond text-slate">5. Cancellation &amp; Refund Policy</h2>
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
              <li>Maintain accurate business information and portfolio</li>
              <li>Complete background verification as required by TRIBLEERA</li>
              <li>Honour accepted bookings and deliver services as described</li>
              <li>Communicate professionally with all customers</li>
              <li>Not solicit customers to bypass the TRIBLEERA platform</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">7. Customer Obligations</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-soft">
              <li>Provide accurate event information at the time of booking</li>
              <li>Make advance payments within 24 hours of vendor acceptance</li>
              <li>Pay remaining balance to the vendor as agreed after service delivery</li>
              <li>Communicate any issues within 48 hours of service delivery</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">8. Dispute Resolution</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA acts as a mediator in disputes between customers and vendors. To raise a
              dispute, contact us within 48 hours of service completion. TRIBLEERA&rsquo;s decision
              following mediation is final with respect to escrow funds.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">9. Limitation of Liability</h2>
            <p className="leading-relaxed text-slate-soft">
              TRIBLEERA is a marketplace platform. We are not liable for the quality, safety, or
              legality of vendor services. Our total liability to any user shall not exceed the
              platform fee paid for the transaction in dispute.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">10. Changes to Terms</h2>
            <p className="leading-relaxed text-slate-soft">
              We may update these terms from time to time. Continued use of the platform after
              changes constitutes acceptance of the updated terms. We will notify registered users
              of material changes via email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-slate">11. Contact</h2>
            <p className="leading-relaxed text-slate-soft">
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@tribleera.com" className="text-burgundy underline-offset-2 hover:underline">
                hello@tribleera.com
              </a>
              .
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
