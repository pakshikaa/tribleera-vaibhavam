const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90`;

export const categoryImages: Record<string, string[]> = {
  photography: [
    u("photo-1606216794074-735e91aa2c92"),
    u("photo-1583939003579-730e3918a45a"),
    u("photo-1519741497674-611481863552"),
    u("photo-1529634806980-85c3dd6d34ac"),
  ],
  cakes: [
    u("photo-1464195244916-405fa0a82545"),
    u("photo-1535254973040-607b474cb50d"),
    u("photo-1571115177098-24ec42ed204d"),
    u("photo-1488477181946-6428a0291777"),
  ],
  decoration: [
    u("photo-1519225421980-715cb0215aed"),
    u("photo-1478146059778-26028b07395a"),
    u("photo-1519167758481-83f29c8e8ee0"),
    u("photo-1561128290-006dc4827214"),
  ],
  "bridal-makeup": [
    u("photo-1522335789203-aabd1fc54bc9"),
    u("photo-1487412947147-5cebf100ffc2"),
    u("photo-1519699047748-de8e457a634e"),
    u("photo-1560066984-138dadb4c035"),
  ],
  invitation: [
    u("photo-1606293459339-aa5ce4a2d8c8"),
    u("photo-1607344645866-009c320c5ab0"),
    u("photo-1530103862676-de8c9debad1d"),
    u("photo-1565043589221-1a6fd9ae45c7"),
  ],
};

export const heroImage = u("photo-1583939003579-730e3918a45a", 1920);
export const trustSectionImage = u("photo-1519167758481-83f29c8e8ee0", 1600);
// Golden-hour lakeside bride & groom, formally dressed, both faces visible —
// warm gold palette matches the admin portal's gold styling. Chosen after
// visual inspection; must stay clearly distinct from vendorLoginImage below.
export const adminLoginImage = u("photo-1591604466107-ec97de577aff", 1920) + "&q=95";
// Beach couple wrapped in a flowing veil — soft, simple, romantic, and a
// completely different scene from both the admin image and the homepage hero
// (the two portals previously read as "the same image" to the team).
export const vendorLoginImage = u("photo-1537633552985-df8429e8048b", 1920) + "&q=95";

export const galleryImages = [
  u("photo-1606216794074-735e91aa2c92"),
  u("photo-1583939003579-730e3918a45a"),
  u("photo-1519741497674-611481863552"),
  u("photo-1465495976277-4387d4b0b4c6"),
  u("photo-1519225421980-715cb0215aed"),
  u("photo-1522335789203-aabd1fc54bc9"),
];

export function getCategoryImage(categorySlug: string, index = 0): string | undefined {
  const pool = categoryImages[categorySlug];
  if (!pool || pool.length === 0) return undefined;
  return pool[index % pool.length];
}
