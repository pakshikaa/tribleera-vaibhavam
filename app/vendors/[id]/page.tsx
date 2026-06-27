import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, ShieldCheck, Phone, MessageCircle,
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
import { ShareVendorButton } from "@/components/vendor/ShareVendorButton";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { getVendorBySlug, vendors } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";
import { galleryImages } from "@/lib/data/images";
import { SmartImage } from "@/components/ui/SmartImage";

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.slug }));
}

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
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-ivory border-b border-slate/8">
        <Container className="py-2">
          <ol className="flex items-center gap-2 text-xs text-slate-soft">
            <li><Link href="/" className="hover:text-burgundy">Home</Link></li>
            <li className="text-slate/30">/</li>
            <li><Link href="/vendors" className="hover:text-burgundy">Vendors</Link></li>
            <li className="text-slate/30">/</li>
            {category && (
              <>
                <li>
                  <Link href={`/vendors?category=${vendor.categorySlug}`} className="hover:text-burgundy">
                    {category.name}
                  </Link>
                </li>
                <li className="text-slate/30">/</li>
              </>
            )}
            <li className="max-w-[200px] truncate font-medium text-slate">{vendor.name}</li>
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
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to top, rgba(92,4,39,0.95) 0%, rgba(92,4,39,0.65) 30%, rgba(21,4,12,0.30) 70%, transparent 100%)" }} />
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
                className="mb-1 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shrink-0"
              />
              <ShareVendorButton vendorName={vendor.name} />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <div className="border-b border-slate/8 bg-white">
        <Container className="grid grid-cols-3 divide-x divide-slate/10 py-4 text-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Trust Score</p>
            <p className="mt-1 font-display text-xl text-burgundy-deep">{Math.round(vendor.trustScore * 20)}%</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Response</p>
            <p className="mt-1 font-display text-xl text-burgundy-deep">{vendor.responseTime.match(/\d+\s*\w+/)?.[0] ?? "Fast"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Experience</p>
            <p className="mt-1 font-display text-xl text-burgundy-deep">{vendor.experienceYears}Y+</p>
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
                <a
                  href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#25D366] px-5 py-2.5 text-[15px] font-semibold text-white transition-all hover:bg-[#22C55E] hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
                <Button href={`tel:${vendor.phone}`} variant="secondary" icon={<Phone size={15} />} fullWidth>
                  Call vendor
                </Button>
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
