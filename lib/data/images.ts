/**
 * Curated photography for the Phase 1 categories.
 *
 * These are hot-linked from Unsplash (free to use, including commercially,
 * under the Unsplash License — https://unsplash.com/license) purely as
 * realistic mock imagery for the pre-launch, pre-backend stage. Every
 * place these are used goes through <SmartImage>, which falls back to the
 * brand's MotifArt illustration automatically if a specific photo URL
 * ever fails to load — so the UI never shows a broken-image icon.
 *
 * Swap these for real vendor photography (Cloudinary/S3) once the backend
 * is live — see VendorSeed.imageUrl in lib/data/vendors.ts.
 */

const u = (id: string, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categoryImages: Record<string, string[]> = {
  "photography": [
    u("photo-1606800052052-a08af7148866"),
    u("photo-1519741497674-611481863552"),
    u("photo-1465495976277-4387d4b0b4c6"),
    u("photo-1606216794074-735e91aa2c92"),
  ],
  "cakes": [
    u("photo-1535254973040-607b474cb50d"),
    u("photo-1486427944299-d1955d23e34d"),
    u("photo-1571115177098-24ec42ed204d"),
    u("photo-1464195244916-405fa0a82545"),
  ],
  "decoration": [
    u("photo-1478146059778-26028b07395a"),
    u("photo-1519167758481-83f29c8e8ee0"),
    u("photo-1519225421980-715cb0215aed"),
    u("photo-1561128290-006dc4827214"),
  ],
  "bridal-makeup": [
    u("photo-1487412947147-5cebf100ffc2"),
    u("photo-1522335789203-aabd1fc54bc9"),
    u("photo-1487412720507-e7ab37603c6f"),
    u("photo-1519699047748-de8e457a634e"),
  ],
  "invitation": [
    u("photo-1607344645866-009c320c5ab0"),
    u("photo-1606293459339-aa5ce4a2d8c8"),
    u("photo-1530103862676-de8c9debad1d"),
    u("photo-1465495976277-4387d4b0b4c6"),
  ],
};

export const heroImage = u("photo-1519167758481-83f29c8e8ee0", 1920);
export const trustSectionImage = u("photo-1519741497674-611481863552", 1200);

// Pool of gallery images for mock vendor profiles
export const galleryImages = [
  u("photo-1606800052052-a08af7148866"),
  u("photo-1519741497674-611481863552"),
  u("photo-1465495976277-4387d4b0b4c6"),
  u("photo-1606216794074-735e91aa2c92"),
  u("photo-1478146059778-26028b07395a"),
  u("photo-1487412947147-5cebf100ffc2"),
];

export function getCategoryImage(categorySlug: string, index = 0): string | undefined {
  const pool = categoryImages[categorySlug];
  if (!pool || pool.length === 0) return undefined;
  return pool[index % pool.length];
}
