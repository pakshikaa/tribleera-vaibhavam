import { Review, Vendor, VendorPackage } from "@/types";
import { getCategoryImage } from "./images";

const INCLUSIONS: Record<
  string,
  { essential: string[]; signature: string[]; heritage: string[] }
> = {
  photography: {
    essential: ["1 photographer, 6 hours", "150 edited digital photos", "Private online gallery"],
    signature: ["2 photographers + 1 cinematographer", "Full-day coverage", "Highlight film", "400 edited photos", "1 premium album"],
    heritage: ["3 photographers + 2 cinematographers", "2-day coverage", "Drone footage", "4K wedding film", "2 luxury albums"],
  },
  cakes: {
    essential: ["2-tier cake, serves 50", "1 flavour", "Basic fondant finish"],
    signature: ["3-tier cake, serves 120", "2 flavours", "Custom floral fondant design", "Dessert table, 4 items"],
    heritage: ["4-tier showpiece cake, serves 250", "3 flavours", "Hand-piped sugar floral work", "Full dessert table, 8 items"],
  },
  decoration: {
    essential: ["Entrance arch", "Stage backdrop, fresh flowers", "Basic fairy lighting"],
    signature: ["Floral mandap design", "Entrance + stage + aisle decor", "Designer fairy & uplighting", "Photo booth corner"],
    heritage: ["Imported & exotic floral mandap", "Full-venue transformation", "Ceiling drapery + chandeliers", "Custom LED stage design"],
  },
  "bridal-makeup": {
    essential: ["Bridal makeup, 1 look", "Basic hairstyling"],
    signature: ["Bridal makeup, 2 looks (ceremony + reception)", "Hairstyling + saree draping", "Trial session included"],
    heritage: ["Bridal makeup, 3 looks", "HD + airbrush finish", "Family glam team, up to 6", "On-call touch-up all day"],
  },
  invitation: {
    essential: ["Digital e-invite design", "1 round of revisions"],
    signature: ["Printed invites, 150 sets", "Custom design with motif", "Matching envelopes", "E-invite included"],
    heritage: ["Premium boxed invites, 150 sets", "Handcrafted wrapping", "Personalised guest names", "Matching thank-you suite"],
  },
};

const TIER_COPY = {
  essential: "Thoughtfully scoped for an intimate celebration without compromising on craft.",
  signature: "Our most-booked package — complete coverage for a grand, full-day celebration.",
  heritage: "The full TRIBLEERA experience. Every premium detail, handled end to end.",
};

function round500(n: number) {
  return Math.round(n / 500) * 500;
}

function buildPackages(vendorId: string, categorySlug: string, basePrice: number): VendorPackage[] {
  const inc = INCLUSIONS[categorySlug];
  return [
    {
      id: `${vendorId}-essential`,
      name: "Essential",
      tier: "Essential",
      price: round500(basePrice * 0.55),
      description: TIER_COPY.essential,
      inclusions: inc.essential,
    },
    {
      id: `${vendorId}-signature`,
      name: "Signature",
      tier: "Signature",
      price: basePrice,
      description: TIER_COPY.signature,
      inclusions: inc.signature,
      recommended: true,
    },
    {
      id: `${vendorId}-heritage`,
      name: "Heritage",
      tier: "Heritage",
      price: round500(basePrice * 1.75),
      description: TIER_COPY.heritage,
      inclusions: inc.heritage,
    },
  ];
}

const REVIEW_POOL: { author: string; rating: number; comment: string }[] = [
  { author: "Priya & Kajan", rating: 5, comment: "From the first call to the big day, everything was effortless. Highly recommend booking through Tribleera." },
  { author: "Tharani Selvam", rating: 4.8, comment: "Professional, punctual, and exactly as promised in the package. Worth every rupee we paid." },
  { author: "Divya Yogeswaran", rating: 5, comment: "They understood our vision immediately and delivered beyond what we expected for the day." },
  { author: "Arun Sivakumar", rating: 4.3, comment: "Communication could have been a little faster early on, but the final outcome was genuinely beautiful." },
  { author: "Meena Rajaratnam", rating: 4.9, comment: "Booked through Tribleera and the whole process felt transparent — the escrow payment gave us real peace of mind." },
  { author: "Suresh & Anitha", rating: 5, comment: "Our families are still talking about how smooth the day went. Thank you for the wonderful work." },
  { author: "Kavitha Mohan", rating: 4.7, comment: "Premium quality, premium service. We compared a few vendors on the platform and this was clearly the best." },
  { author: "Vimal Rajendran", rating: 4.4, comment: "A couple of timing hiccups, but the team resolved everything quietly before any guest noticed." },
];

function buildReviews(seed: number, n = 2): Review[] {
  const out: Review[] = [];
  for (let i = 0; i < n; i++) {
    const idx = (seed * 3 + i * 5) % REVIEW_POOL.length;
    const r = REVIEW_POOL[idx];
    out.push({
      id: `rev-${seed}-${i}`,
      author: r.author,
      rating: r.rating,
      date: new Date(2026, (seed + i * 2) % 6, 4 + ((seed * 7 + i) % 24)).toISOString(),
      comment: r.comment,
    });
  }
  return out;
}

interface VendorSeed {
  id: string;
  name: string;
  categorySlug: string;
  location: string;
  city: string;
  tagline: string;
  description: string;
  basePrice: number;
  trustScore: number;
  verified: boolean;
  status: "approved" | "pending" | "suspended";
  experienceYears: number;
  eventsCompleted: number;
  responseTime: string;
  tags: string[];
  motif: Vendor["motif"];
  tone: Vendor["tone"];
}

const seeds: VendorSeed[] = [
  {
    id: "jaffna-frames-studio",
    name: "Jaffna Frames Studio",
    categorySlug: "photography",
    location: "Nallur, Jaffna",
    city: "Jaffna",
    tagline: "Editorial candid photography rooted in Jaffna's wedding traditions.",
    description: "A five-member team known for unposed, story-led wedding photography across the peninsula — frames that read like a film still, built around Jaffna's Hindu and Christian ceremony traditions alike.",
    basePrice: 120000,
    trustScore: 4.9,
    verified: true,
    status: "approved",
    experienceYears: 9,
    eventsCompleted: 164,
    responseTime: "Usually responds within 1 hour",
    tags: ["Candid", "Drone", "Same-day Edit"],
    motif: "lotus",
    tone: "burgundy",
  },
  {
    id: "lumiere-wedding-films",
    name: "Lumière Wedding Films",
    categorySlug: "photography",
    location: "Wellawatte, Colombo",
    city: "Colombo",
    tagline: "Cinematic wedding films shot like a feature.",
    description: "Lumière specialises in moody, colour-graded wedding films with a strong focus on Poruwa and Kasi Yatra ceremonies, paired with crisp traditional stills — frequently travelling up to Jaffna for destination weddings.",
    basePrice: 145000,
    trustScore: 4.7,
    verified: true,
    status: "approved",
    experienceYears: 7,
    eventsCompleted: 121,
    responseTime: "Usually responds within 2 hours",
    tags: ["Cinematic Film", "Travels Island-wide"],
    motif: "diya",
    tone: "gold",
  },
  {
    id: "pixel-and-petal-photography",
    name: "Pixel & Petal Photography",
    categorySlug: "photography",
    location: "Town Centre, Trincomalee",
    city: "Trincomalee",
    tagline: "Classic album-style photography, modern retouching.",
    description: "A newer studio building its name in the Eastern Province with timeless, well-lit album photography and a fast 7-day delivery turnaround.",
    basePrice: 78000,
    trustScore: 4.2,
    verified: false,
    status: "pending",
    experienceYears: 3,
    eventsCompleted: 28,
    responseTime: "Usually responds within 5 hours",
    tags: ["Album Specialist", "Fast Delivery"],
    motif: "knot",
    tone: "slate",
  },
  {
    id: "royal-icing-cake-house",
    name: "Royal Icing Cake House",
    categorySlug: "cakes",
    location: "Hospital Road, Jaffna",
    city: "Jaffna",
    tagline: "Jaffna's most-booked wedding cake atelier.",
    description: "A family-run bakery crafting custom fondant and hand-piped wedding cakes, scaled from intimate two-tier cakes to grand showpiece dessert tables.",
    basePrice: 26000,
    trustScore: 4.8,
    verified: true,
    status: "approved",
    experienceYears: 12,
    eventsCompleted: 310,
    responseTime: "Usually responds within 3 hours",
    tags: ["Custom Fondant", "Dessert Tables"],
    motif: "garland",
    tone: "gold",
  },
  {
    id: "sweet-nilavu-cakes",
    name: "Sweet Nilavu Cakes",
    categorySlug: "cakes",
    location: "Central Road, Batticaloa",
    city: "Batticaloa",
    tagline: "Naturally flavoured cakes with a modern, minimal finish.",
    description: "Known across the Eastern Province for naturally flavoured sponge cakes and a clean, minimalist sugar-flower style that photographs beautifully.",
    basePrice: 19000,
    trustScore: 4.5,
    verified: true,
    status: "approved",
    experienceYears: 5,
    eventsCompleted: 96,
    responseTime: "Usually responds within 4 hours",
    tags: ["Natural Flavours", "Minimal Style"],
    motif: "diya",
    tone: "rose",
  },
  {
    id: "pushpa-florals-and-decor",
    name: "Pushpa Florals & Decor",
    categorySlug: "decoration",
    location: "Kandy Road, Jaffna",
    city: "Jaffna",
    tagline: "Flower-laden mandaps built fresh, the morning of.",
    description: "Pushpa's team sources fresh jasmine, rose and marigold daily from local growers, building elaborate mandap installations assembled on-site the morning of the event.",
    basePrice: 165000,
    trustScore: 4.7,
    verified: true,
    status: "approved",
    experienceYears: 13,
    eventsCompleted: 198,
    responseTime: "Usually responds within 3 hours",
    tags: ["Fresh Florals", "Mandap Design"],
    motif: "garland",
    tone: "rose",
  },
  {
    id: "thiruvizha-decor-studio",
    name: "Thiruvizha Decor Studio",
    categorySlug: "decoration",
    location: "Bambalapitiya, Colombo",
    city: "Colombo",
    tagline: "Contemporary stagecraft for the design-led couple.",
    description: "A Colombo studio merging clean modern stagecraft with traditional Tamil floral motifs — best known for their LED-lit reception stage designs.",
    basePrice: 195000,
    trustScore: 4.6,
    verified: true,
    status: "approved",
    experienceYears: 8,
    eventsCompleted: 142,
    responseTime: "Usually responds within 4 hours",
    tags: ["Modern Stagecraft", "LED Design"],
    motif: "arch",
    tone: "slate",
  },
  {
    id: "vanam-decor-co",
    name: "Vanam Decor Co",
    categorySlug: "decoration",
    location: "Dockyard Road, Trincomalee",
    city: "Trincomalee",
    tagline: "Boutique courtyard and beachside decor installations.",
    description: "A small but ambitious studio building a name for beachside and courtyard mandap installations along the Eastern coastline.",
    basePrice: 110000,
    trustScore: 4.3,
    verified: false,
    status: "pending",
    experienceYears: 4,
    eventsCompleted: 41,
    responseTime: "Usually responds within 6 hours",
    tags: ["Boutique Studio", "Beachside Weddings"],
    motif: "garland",
    tone: "burgundy",
  },
  {
    id: "anjali-bridal-studio",
    name: "Anjali Bridal Studio",
    categorySlug: "bridal-makeup",
    location: "Stanley Road, Jaffna",
    city: "Jaffna",
    tagline: "Fine-line bridal artistry with a modern motif library.",
    description: "Anjali's signature technique blends traditional Tamil bridal looks with contemporary finishing, including full mehendi artistry for the whole wedding week.",
    basePrice: 38000,
    trustScore: 4.9,
    verified: true,
    status: "approved",
    experienceYears: 10,
    eventsCompleted: 286,
    responseTime: "Usually responds within 1 hour",
    tags: ["HD Makeup", "Mehendi Included"],
    motif: "paisley",
    tone: "burgundy",
  },
  {
    id: "glow-by-niranjana",
    name: "Glow by Niranjana",
    categorySlug: "bridal-makeup",
    location: "Kollupitiya, Colombo",
    city: "Colombo",
    tagline: "Airbrush bridal glam for the whole wedding week.",
    description: "A six-artist team covering bridal makeup, hairstyling and family glam across every function from Nichayathartham to the reception.",
    basePrice: 42000,
    trustScore: 4.6,
    verified: true,
    status: "approved",
    experienceYears: 6,
    eventsCompleted: 154,
    responseTime: "Usually responds within 2 hours",
    tags: ["Airbrush Finish", "Multi-day Team"],
    motif: "lotus",
    tone: "rose",
  },
  {
    id: "yaazh-invites-and-stationery",
    name: "Yaazh Invites & Stationery",
    categorySlug: "invitation",
    location: "Temple Road, Jaffna",
    city: "Jaffna",
    tagline: "Hand-finished invites with traditional Yaazhpaanam motifs.",
    description: "A family press known for gold-foil Yaazhpaanam art motifs and meticulous bilingual (Tamil/English) typesetting on every invitation.",
    basePrice: 19000,
    trustScore: 4.8,
    verified: true,
    status: "approved",
    experienceYears: 20,
    eventsCompleted: 540,
    responseTime: "Usually responds within 1 day",
    tags: ["Gold Foil", "Bilingual Typesetting"],
    motif: "knot",
    tone: "gold",
  },
  {
    id: "inked-petals-studio",
    name: "Inked Petals Studio",
    categorySlug: "invitation",
    location: "Havelock Town, Colombo",
    city: "Colombo",
    tagline: "Minimal, modern invites for the design-led couple.",
    description: "A small design studio crafting clean, contemporary invitation suites — including matching e-invites, save-the-dates and day-of signage.",
    basePrice: 15000,
    trustScore: 4.5,
    verified: true,
    status: "approved",
    experienceYears: 4,
    eventsCompleted: 88,
    responseTime: "Usually responds within 1 hour",
    tags: ["Modern Design", "E-invite Suite"],
    motif: "knot",
    tone: "slate",
  },
];

export const vendors: Vendor[] = seeds.map((s, i) => ({
  id: s.id,
  slug: s.id,
  name: s.name,
  categorySlug: s.categorySlug,
  location: s.location,
  city: s.city,
  tagline: s.tagline,
  description: s.description,
  startingPrice: round500(s.basePrice * 0.55),
  trustScore: s.trustScore,
  verified: s.verified,
  status: s.status,
  experienceYears: s.experienceYears,
  eventsCompleted: s.eventsCompleted,
  responseTime: s.responseTime,
  tags: s.tags,
  motif: s.motif,
  tone: s.tone,
  gallerySeeds: 6,
  imageUrl: getCategoryImage(s.categorySlug, i),
  galleryUrls: [0, 1, 2, 3].map((n) => getCategoryImage(s.categorySlug, i + n)).filter((u): u is string => !!u),
  packages: buildPackages(s.id, s.categorySlug, s.basePrice),
  reviews: buildReviews(i),
  phone: `+94 7${(7100000 + i * 137).toString().slice(0, 7)}`,
  whatsapp: `+94 7${(7100000 + i * 137).toString().slice(0, 7)}`,
  joinedDate: new Date(2024, (i * 3) % 12, 10 + (i % 18)).toISOString(),
}));

export function getVendorBySlug(slug: string) {
  return vendors.find((v) => v.slug === slug);
}

export function getVendorsByCategory(categorySlug: string) {
  return vendors.filter((v) => v.categorySlug === categorySlug);
}
