"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  MapPin, ShieldCheck,
  Clock, Award, Users, ArrowRight, Star,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { SubHeading } from "@/components/ui/SubHeading";
import { VendorPackagesSection } from "@/components/vendor/VendorPackagesSection";
import { VendorGalleryClient } from "@/components/vendor/VendorGalleryClient";
import { VendorMobileBookBar } from "@/components/vendor/VendorMobileBookBar";
import { ShortlistButton } from "@/components/vendor/ShortlistButton";
import { PriceCalculator } from "@/components/vendor/PriceCalculator";
import { SimilarVendors } from "@/components/vendor/SimilarVendors";
import { ShareButton } from "@/components/vendor/ShareButton";
import { VendorContactClient } from "@/components/vendor/VendorContactClient";
import { AvailabilityBadge } from "@/components/vendor/AvailabilityBadge";
import { BackToResults } from "@/components/vendor/BackToResults";
import { RecentlyViewedTracker } from "@/components/vendor/RecentlyViewed";
import { VerifiedReviewForm } from "@/components/vendor/VerifiedReviewForm";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import { galleryImages } from "@/lib/data/images";
import { SmartImage } from "@/components/ui/SmartImage";
import { BackButton } from "@/components/ui/BackButton";
import { Vendor } from "@/types";
import { recordVendorProfileView } from "@/lib/utils/vendorMetrics";

export function VendorProfileContent({ vendor }: { vendor: Vendor }) {
  useEffect(() => {
    recordVendorProfileView(vendor.slug);
  }, [vendor.slug]);

  const category = getCategoryBySlug(vendor.categorySlug);
  const imgs = Array.from({ length: vendor.gallerySeeds }, (_, i) => ({
    src: vendor.galleryUrls?.[i % (vendor.galleryUrls?.length || 1)] ?? galleryImages[i % galleryImages.length],
    alt: `${vendor.name} — past event ${i + 1}`,
  }));

  const totalReviews = vendor.reviews.length;
  const avgRating = totalReviews > 0
    ? vendor.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : vendor.trustScore;

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: vendor.reviews.filter((review) => Math.round(review.rating) === star).length,
    pct: totalReviews > 0
      ? Math.round((vendor.reviews.filter((review) => Math.round(review.rating) === star).length / totalReviews) * 100)
      : star === 5 ? 100 : 0,
  }));

  return (
    <div className="bg-ivory pb-24 md:pb-0">
      <RecentlyViewedTracker vendorSlug={vendor.slug} />
      <BackButton href="/vendors" label="Vendors" variant="floating" />

      <nav aria-label="Breadcrumb" className="overflow-x-auto whitespace-nowrap border-b border-slate/8 bg-ivory scrollbar-hide">
        <Container className="flex items-center justify-between gap-3 py-2.5">
          <ol className="flex items-center gap-2 text-xs text-slate-soft">
            <li><BackButton href="/vendors" label="Vendors" /></li>
            <li className="text-slate/25">/</li>
            {category && (
              <>
                <li>
                  <Link href={`/vendors?category=${vendor.categorySlug}`} className="transition-colors hover:text-burgundy">
                    {category.name}
                  </Link>
                </li>
                <li className="text-slate/25">/</li>
              </>
            )}
            <li className="max-w-[180px] truncate font-medium text-slate">{vendor.name}</li>
          </ol>
          <BackToResults className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-burgundy transition-colors hover:text-burgundy-deep" />
        </Container>
      </nav>

      <section className="relative h-[260px] overflow-hidden md:h-[360px]">
        <SmartImage
          src={vendor.imageUrl}
          alt={`${vendor.name} — ${vendor.tagline}`}
          fallbackVariant={vendor.motif}
          fallbackTone={vendor.tone}
          fallbackSeed={vendor.id.length}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(92,4,39,0.97) 0%,rgba(92,4,39,0.70) 28%,rgba(21,4,12,0.30) 65%,transparent 100%)" }} />
        <Container className="relative flex h-full flex-col justify-end pb-6 md:pb-10">
          <div className="flex flex-wrap items-center gap-2">
            {vendor.verified && (
              <Badge tone="rose" icon={<ShieldCheck size={12} />} className="bg-white/90">
                Verified Partner
              </Badge>
            )}
            {vendor.trustBadges.map((badge) => (
              <Badge key={badge} tone="gold" className="bg-white/15 text-white">
                {badge}
              </Badge>
            ))}
            {category && (
              <Badge tone="slate" className="bg-white/15 text-white">
                {category.name}
              </Badge>
            )}
            <AvailabilityBadge vendorSlug={vendor.slug} />
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-display-md text-white" style={{ textShadow: "0 2px 20px rgba(21,4,12,0.8)" }}>{vendor.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 8px rgba(21,4,12,0.6)" }}>
                <span className="flex items-center gap-1"><MapPin size={13} /> {vendor.location}</span>
                <Rating value={vendor.trustScore} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShortlistButton
                slug={vendor.slug}
                size={22}
                className="mb-1 h-11 w-11 shrink-0 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 md:h-10 md:w-10"
              />
              <ShareButton vendorName={vendor.name} />
            </div>
          </div>
        </Container>
      </section>

      <div className="border-b border-slate/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <Container className="grid grid-cols-3 divide-x divide-slate/20 py-3 text-center md:py-5">
          <div className="px-2 py-1 md:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Trust Score</p>
            <p className="mt-1 font-display text-xl font-bold text-burgundy-deep md:mt-1.5 md:text-2xl">{Math.round(vendor.trustScore * 20)}%</p>
          </div>
          <div className="px-2 py-1 md:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Response</p>
            <p className="mt-1 font-display text-xl font-bold text-burgundy-deep md:mt-1.5 md:text-2xl">{vendor.responseTime.match(/\d+\s*\w+/)?.[0] ?? "Fast"}</p>
          </div>
          <div className="px-2 py-1 md:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Experience</p>
            <p className="mt-1 font-display text-xl font-bold text-burgundy-deep md:mt-1.5 md:text-2xl">{vendor.experienceYears}Y+</p>
          </div>
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-10 py-10 md:grid-cols-[1fr_340px] md:py-14">
        <div className="space-y-12">
          <div>
            <SubHeading className="text-display-sm">About the Studio</SubHeading>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-soft">{vendor.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {vendor.tags.map((tag, index) => (
                <Badge key={tag} tone={index % 2 === 0 ? "rose" : "gold"}>{tag}</Badge>
              ))}
            </div>
          </div>

          <div>
            <SubHeading className="text-display-sm">Verification & Trust</SubHeading>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {vendor.trustBadges.map((badge) => (
                <div key={badge} className="rounded-[10px] border border-slate/8 bg-white p-4 shadow-soft">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate">
                    <ShieldCheck size={14} className="text-burgundy" />
                    {badge}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-soft">
                    {badge === "Background checked" && "Identity, business registration, and primary contact details reviewed by TRIBLEERA."}
                    {badge === "Contract signed" && "Vendor accepted marketplace service standards, payment milestones, and dispute cooperation rules."}
                    {badge === "Insured" && "Operational risk review completed and required coverage or substitute safeguards documented during onboarding."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SubHeading className="text-display-sm">Gallery</SubHeading>
            <VendorGalleryClient images={imgs} />
            <p className="mt-3 text-xs text-slate-soft">
              Tamil wedding imagery shown here reflects TRIBLEERA-approved profile presentation for this vendor.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <SubHeading className="text-display-sm">Curated Packages</SubHeading>
              <Link href={`/vendors/${vendor.slug}/packages`} className="flex items-center gap-1 text-sm font-semibold text-burgundy hover:underline">
                View all packages <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-5">
              <VendorPackagesSection
                vendorSlug={vendor.slug}
                staticPackages={vendor.packages}
                motif={vendor.motif}
                tone={vendor.tone}
                seed={vendor.id.length}
              />
            </div>
            <Button href={`/vendors/${vendor.slug}/packages`} className="mt-6" fullWidth>
              View packages &amp; book
            </Button>
          </div>

          <div>
            <SubHeading className="text-display-sm">
              Reviews <span className="text-base font-normal text-slate-soft">({totalReviews} verified)</span>
            </SubHeading>

            {totalReviews > 0 ? (
              <>
                <div className="mb-6 mt-5 rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-display text-4xl font-bold text-burgundy-deep">{avgRating.toFixed(1)}</p>
                      <div className="mt-1 flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={13} className={star <= Math.round(avgRating) ? "fill-gold text-gold" : "text-slate/20"} />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-slate-soft">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {starCounts.map(({ star, pct }) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 text-right text-[11px] text-slate-soft">{star}</span>
                          <Star size={10} className="shrink-0 fill-gold text-gold" />
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate/10">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-7 text-[11px] text-slate-soft">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {vendor.reviews.map((review) => (
                    <div key={review.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                      <div className="flex items-center gap-3">
                        <Avatar name={review.author} size={38} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate">{review.author}</p>
                          <p className="text-xs text-slate-soft">{formatDateShort(review.date)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Rating value={review.rating} />
                          <span className="ml-1 text-[10px] font-semibold text-success">✓ Verified booking</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-soft">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-slate">Newly approved partner</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-soft">
                  This vendor is live and bookable immediately after verification. Reviews will appear here once completed TRIBLEERA bookings are delivered.
                </p>
              </div>
            )}

            <VerifiedReviewForm vendorSlug={vendor.slug} vendorName={vendor.name} />
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-5">
            <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-wide text-slate-soft">Starting at</p>
              <p className="mt-1 font-display text-2xl text-burgundy-deep">{formatLKR(vendor.startingPrice)}</p>
              <div className="mt-5 space-y-3 border-t border-slate/8 pt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-soft">
                  <Award size={15} className="text-gold-deep" /> {vendor.experienceYears} years experience
                </div>
                <div className="flex items-center gap-2 text-slate-soft">
                  <Users size={15} className="text-gold-deep" /> {vendor.eventsCompleted}+ events completed
                </div>
                <div className="flex items-center gap-2 text-slate-soft">
                  <Clock size={15} className="text-gold-deep" /> {vendor.responseTime}
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button href={`/vendors/${vendor.slug}/packages`} variant="gold" fullWidth>
                  View packages
                </Button>
                <VendorContactClient
                  vendorId={vendor.id}
                  phone={vendor.phone}
                  whatsapp={vendor.whatsapp}
                  packagesHref={`/vendors/${vendor.slug}/packages`}
                />
              </div>
            </div>
            <div className="rounded-[8px] border border-gold/20 bg-gold/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold-deep">
                Quick cost estimate
              </p>
              <PriceCalculator startingPrice={vendor.startingPrice} packages={vendor.packages} />
            </div>
            <div className="rounded-[8px] border border-burgundy/15 bg-burgundy/5 p-4">
              <p className="text-xs font-semibold text-burgundy-deep">TRIBLEERA Verification Stack</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-soft">
                Background check, signed marketplace contract, and dispute-ready onboarding are completed before a vendor goes live. <Link href="/trust" className="font-medium text-burgundy underline-offset-2 hover:underline">Learn how</Link>
              </p>
            </div>
          </div>
        </aside>
      </Container>

      <SimilarVendors categorySlug={vendor.categorySlug} currentSlug={vendor.slug} />
      <VendorMobileBookBar vendor={vendor} />
    </div>
  );
}
