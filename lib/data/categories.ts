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
    imageUrl: img("photo-1487412947147-5cebf100ffc2"),
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
    imageUrl: img("photo-1607344645866-009c320c5ab0"),
  },
];

export const comingSoonCategories: Category[] = [
  {
    id: "cat-venues",
    slug: "venues",
    name: "Venues & Halls",
    tamilName: "மண்டபம்",
    description: "Wedding halls and event venues across the Jaffna peninsula.",
    motif: "arch",
    tone: "burgundy",
    vendorCount: 0,
    comingSoon: true,
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
  },
  {
    id: "cat-music",
    slug: "music",
    name: "Music & Entertainment",
    tamilName: "இசை",
    description: "Live bands, DJs and traditional Nadaswaram ensembles.",
    motif: "diya",
    tone: "slate",
    vendorCount: 0,
    comingSoon: true,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? comingSoonCategories.find((c) => c.slug === slug);
}
