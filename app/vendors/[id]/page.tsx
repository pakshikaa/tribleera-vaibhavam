import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
import { PackageCard } from "@/components/vendor/PackageCard";
import { VendorGalleryClient } from "@/components/vendor/VendorGalleryClient";
import { VendorMobileBookBar } from "@/components/vendor/VendorMobileBookBar";
import { ShortlistButton } from "@/components/vendor/ShortlistButton";
import { PriceCalculator } from "@/components/vendor/PriceCalculator";
import { SimilarVendors } from "@/components/vendor/SimilarVendors";
import { ShareButton } from "@/components/vendor/ShareButton";
import { VendorContactClient } from "@/components/vendor/VendorContactClient";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { getVendorBySlug, vendors } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";
import { galleryImages } from "@/lib/data/images";
import { SmartImage } from "@/components/ui/SmartImage";
import { BackButton } from "@/components/ui/BackButton";

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.slug }));
}

// Without this, a request for a slug outside the static list gets rendered
// on demand and Next.js caches the notFound() result as a 200 — the HTTP
// status doesn't actually reflect the 404 boundary being hit.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) return {};
  return {
    title: vendor.name,
    description: `${vendor.tagline} ${vendor.description}`.slice(0, 155),
    openGraph: {
      title: `${vendor.name} | TRIBLEERA VAIBHAVAM`,
      description: vendor.tagline,
    },
  };
}

export default async function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) notFound();

  const category = getCategoryBySlug(vendor.categorySlug);

  // Build gallery image list
  const imgs = Array.from({ length: vendor.gallerySeeds }, (_, i) => ({
    src: vendor.galleryUrls?.[i % (vendor.galleryUrls?.length || 1)] ?? galleryImages[i % galleryImages.length],
    alt: `${vendor.name} — past event ${i + 1}`,
  }));

  // Star breakdown from reviews
  const totalReviews = vendor.reviews.length;
  const avgRating = totalReviews > 0
    ? vendor.reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : vendor.trustScore;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: vendor.reviews.filter((r) => Math.round(r.rating) === s).length,
    pct: totalReviews > 0 ? Math.round((vendor.reviews.filter((r) => Math.round(r.rating) === s).length / totalReviews) * 100) : s === 5 ? 100 : 0,
  }));

  return (
    <div className="bg-ivory pb-24 md:pb-0">
      <BackButton href="/vendors" label="Vendors" variant="floating" />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="overflow-x-auto scrollbar-hide whitespace-nowrap bg-ivory border-b border-slate/8">
        <Container className="py-2.5">
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
        </Container>
      </nav>

      {/* Hero banner */}
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
            {category && (
              <Badge tone="slate" className="bg-white/15 text-white">
                {category.name}
              </Badge>
            )}
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
                className="mb-1 h-11 w-11 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shrink-0 md:h-10 md:w-10"
              />
              <ShareButton vendorName={vendor.name} />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats strip */}
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
        {/* Main column */}
        <div className="space-y-12">
          {/* About */}
          <div>
            <SubHeading className="text-display-sm">About the Studio</SubHeading>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-soft">{vendor.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {vendor.tags.map((t, i) => (
                <Badge key={t} tone={i % 2 === 0 ? "rose" : "gold"}>{t}</Badge>
              ))}
            </div>
          </div>

          {/* Gallery with lightbox */}
          <div>
            <SubHeading className="text-display-sm">Gallery</SubHeading>
            <VendorGalleryClient images={imgs} />
            <p className="mt-3 text-xs text-slate-soft">
              Portfolio preview - {vendor.name} will add their own work once onboarded.
            </p>
          </div>

          {/* Packages */}
          <div>
            <div className="flex items-center justify-between">
              <SubHeading className="text-display-sm">Curated Packages</SubHeading>
              <Link href={`/vendors/${vendor.slug}/packages`} className="flex items-center gap-1 text-sm font-semibold text-burgundy hover:underline">
                Compare all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {vendor.packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} motif={vendor.motif} tone={vendor.tone} seed={vendor.id.length} />
              ))}
            </div>
            <Button href={`/vendors/${vendor.slug}/packages`} className="mt-6" fullWidth>
              View packages &amp; book
            </Button>
          </div>

          {/* Reviews */}
          <div>
            <SubHeading className="text-display-sm">
              Reviews <span className="text-base font-normal text-slate-soft">({totalReviews} verified)</span>
            </SubHeading>

            {/* Star breakdown */}
            {totalReviews > 0 && (
              <div className="mt-5 mb-6 rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-4xl font-bold text-burgundy-deep">{avgRating.toFixed(1)}</p>
                    <div className="mt-1 flex justify-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={13} className={s <= Math.round(avgRating) ? "fill-gold text-gold" : "text-slate/20"} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-soft">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {starCounts.map(({ star, pct }) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-3 text-right text-[11px] text-slate-soft">{star}</span>
                        <Star size={10} className="fill-gold text-gold shrink-0" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate/10">
                          <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-7 text-[11px] text-slate-soft">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {vendor.reviews.map((r) => (
                <div key={r.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.author} size={38} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate">{r.author}</p>
                      <p className="text-xs text-slate-soft">{formatDateShort(r.date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Rating value={r.rating} />
                      <span className="ml-1 text-[10px] font-semibold text-success">✓ Verified booking</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-soft">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop sticky sidebar */}
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
              <PriceCalculator startingPrice={vendor.startingPrice} />
            </div>
            <div className="rounded-[8px] border border-burgundy/15 bg-burgundy/5 p-4">
              <p className="text-xs font-semibold text-burgundy-deep">🔒 TRIBLEERA Escrow Protection</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-soft">
                Your advance is held safely until service milestones are completed. <Link href="/trust" className="font-medium text-burgundy underline-offset-2 hover:underline">Learn how</Link>
              </p>
            </div>
          </div>
        </aside>
      </Container>

      {/* Similar vendors */}
      <SimilarVendors categorySlug={vendor.categorySlug} currentSlug={vendor.slug} />

      {/* Mobile bottom booking bar */}
      <VendorMobileBookBar vendor={vendor} />
    </div>
  );
}
