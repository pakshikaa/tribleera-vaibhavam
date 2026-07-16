import { Category } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=90`;

export const categories: Category[] = [
  {
    id: "cat-photography",
    slug: "photography",
    name: "Photography",
    tamilName: "புகைப்படம்",
    description: "Candid wedding photography and cinematic films from Jaffna's most trusted studios.",
    motif: "lotus",
    tone: "slate",
    vendorCount: 5,
    imageUrl: img("photo-1606216794074-735e91aa2c92"),
  },
  {
    id: "cat-cakes",
    slug: "cakes",
    name: "Cakes",
    tamilName: "கேக்",
    description: "Custom wedding cakes and dessert tables, baked fresh for your celebration.",
    motif: "garland",
    tone: "gold",
    vendorCount: 5,
    imageUrl: img("photo-1535254973040-607b474cb50d"),
  },
  {
    id: "cat-decoration",
    slug: "decoration",
    name: "Decoration",
    tamilName: "அலங்காரம்",
    description: "Floral mandap design, stage backdrops and full-venue decor transformations.",
    motif: "garland",
    tone: "rose",
    vendorCount: 5,
    imageUrl: img("photo-1519225421980-715cb0215aed"),
  },
  {
    id: "cat-bridal-makeup",
    slug: "bridal-makeup",
    name: "Bridal Makeup",
    tamilName: "மணப்பெண் அலங்காரம்",
    description: "Bridal makeup, hairstyling and mehendi artistry for the whole wedding week.",
    motif: "paisley",
    tone: "burgundy",
    vendorCount: 5,
    imageUrl: img("photo-1522335789203-aabd1fc54bc9"),
  },
  {
    id: "cat-invitation",
    slug: "invitation",
    name: "Invitation",
    tamilName: "அழைப்பிதழ்",
    description: "Handcrafted and digital wedding invitations, designed and printed in Jaffna.",
    motif: "knot",
    tone: "gold",
    vendorCount: 5,
    imageUrl: img("photo-1606293459339-aa5ce4a2d8c8"),
  },
];

export const comingSoonCategories: Category[] = [
  {
    id: "cat-venues",
    slug: "venues",
    name: "Wedding Halls & Venues",
    tamilName: "மண்டபம்",
    description: "Kalyana mandapams, banquet halls and open-air venues across the Jaffna peninsula.",
    motif: "arch",
    tone: "burgundy",
    vendorCount: 0,
    comingSoon: true,
    imageUrl: img("photo-1519167758481-83f550bb49b3"),
  },
  {
    id: "cat-wedding-cars",
    slug: "wedding-cars",
    name: "Wedding Cars & Vehicle Rental",
    tamilName: "திருமண வாகனங்கள்",
    description: "Decorated bridal cars, vintage classics and guest transport fleets with chauffeurs.",
    motif: "knot",
    tone: "slate",
    vendorCount: 0,
    comingSoon: true,
    // Local CC0 asset — decorated vintage wedding car with rose bouquet.
    imageUrl: "/images/portal/wedding-cars.jpg",
  },
  {
    id: "cat-music",
    slug: "music",
    name: "DJ Music & Lights",
    tamilName: "டிஜே இசை",
    description: "Professional DJs, dance-floor lighting rigs and sound systems for receptions and sangeet nights.",
    motif: "diya",
    tone: "gold",
    vendorCount: 0,
    comingSoon: true,
    imageUrl: img("photo-1470225620780-dba8ba36b745"),
  },
  {
    id: "cat-catering",
    slug: "catering",
    name: "Catering",
    tamilName: "சாப்பாடு",
    description: "Traditional sapadu and multi-cuisine catering for large gatherings.",
    motif: "diya",
    tone: "gold",
    vendorCount: 0,
    comingSoon: true,
    imageUrl: img("photo-1414235077428-338989a2e8c0"),
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? comingSoonCategories.find((c) => c.slug === slug);
}
