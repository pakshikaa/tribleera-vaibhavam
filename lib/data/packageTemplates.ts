export interface PackageField {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  unit?: string;
  placeholder?: string;
}

export interface PackageTemplate {
  name: string;
  tier: "Essential" | "Signature" | "Heritage";
  basePrice: number;
  fields: PackageField[];
}

export const PACKAGE_TEMPLATES: Record<string, PackageTemplate[]> = {
  photography: [
    {
      name: "Essential Coverage",
      tier: "Essential",
      basePrice: 50000,
      fields: [
        { id: "hours", label: "Coverage hours", type: "number", unit: "hrs", placeholder: "4" },
        { id: "photos", label: "Edited photos", type: "number", unit: "photos", placeholder: "150" },
        { id: "album", label: "Album included", type: "select", options: ["No", "Yes - 20 pages"] },
        { id: "delivery", label: "Delivery time", type: "text", placeholder: "2 weeks" },
        { id: "shooters", label: "Photographers", type: "number", unit: "persons", placeholder: "1" },
      ],
    },
    {
      name: "Signature Day",
      tier: "Signature",
      basePrice: 100000,
      fields: [
        { id: "hours", label: "Coverage hours", type: "number", unit: "hrs", placeholder: "8" },
        { id: "photos", label: "Edited photos", type: "number", unit: "photos", placeholder: "400" },
        { id: "video", label: "Video included", type: "select", options: ["No", "Yes - 5 min highlight"] },
        { id: "album", label: "Album included", type: "select", options: ["Yes - 30 pages", "Yes - 40 pages"] },
        { id: "delivery", label: "Delivery time", type: "text", placeholder: "1 week" },
        { id: "shooters", label: "Photographers", type: "number", unit: "persons", placeholder: "2" },
      ],
    },
    {
      name: "Heritage Complete",
      tier: "Heritage",
      basePrice: 180000,
      fields: [
        { id: "hours", label: "Coverage hours", type: "text", placeholder: "Full day" },
        { id: "photos", label: "Edited photos", type: "text", placeholder: "700+" },
        { id: "video", label: "Cinema film", type: "select", options: ["Yes - 15 min feature"] },
        { id: "album", label: "Premium album", type: "select", options: ["Yes - 50 pages, leather"] },
        { id: "delivery", label: "Delivery time", type: "text", placeholder: "1 week" },
        { id: "shooters", label: "Team size", type: "number", unit: "persons", placeholder: "3" },
        { id: "drone", label: "Drone shots", type: "select", options: ["Included"] },
      ],
    },
  ],
  cakes: [
    {
      name: "Classic Tier",
      tier: "Essential",
      basePrice: 8000,
      fields: [
        { id: "tiers", label: "Number of tiers", type: "select", options: ["1 tier", "2 tiers", "3 tiers"] },
        { id: "servings", label: "Servings", type: "number", unit: "persons", placeholder: "50" },
        { id: "flavor", label: "Flavors", type: "text", placeholder: "Vanilla, Chocolate" },
        { id: "icing", label: "Icing type", type: "select", options: ["Buttercream", "Fondant"] },
        { id: "delivery", label: "Delivery included", type: "select", options: ["Yes", "No - pickup only"] },
      ],
    },
    {
      name: "Grand Celebration",
      tier: "Signature",
      basePrice: 18000,
      fields: [
        { id: "tiers", label: "Number of tiers", type: "select", options: ["3 tiers", "4 tiers", "5 tiers"] },
        { id: "servings", label: "Servings", type: "number", unit: "persons", placeholder: "150" },
        { id: "flavor", label: "Flavors", type: "text", placeholder: "Custom - up to 3" },
        { id: "icing", label: "Icing type", type: "select", options: ["Premium Fondant", "Sugar flowers"] },
        { id: "design", label: "Design rounds", type: "number", unit: "revisions", placeholder: "3" },
        { id: "delivery", label: "Delivery included", type: "select", options: ["Yes - with setup"] },
      ],
    },
    {
      name: "Heritage Masterpiece",
      tier: "Heritage",
      basePrice: 35000,
      fields: [
        { id: "tiers", label: "Tiers", type: "select", options: ["5+", "Custom structure"] },
        { id: "servings", label: "Servings", type: "text", placeholder: "300+" },
        { id: "flavor", label: "Flavors", type: "text", placeholder: "Fully custom" },
        { id: "design", label: "Custom design", type: "text", placeholder: "Bespoke Tamil motifs" },
        { id: "floral", label: "Sugar flowers", type: "select", options: ["Included - handcrafted"] },
        { id: "delivery", label: "Full setup", type: "select", options: ["Yes - 2-person team"] },
      ],
    },
  ],
  decoration: [
    {
      name: "Traditional Mandap",
      tier: "Essential",
      basePrice: 80000,
      fields: [
        { id: "mandap", label: "Mandap type", type: "select", options: ["Floral", "Fabric", "Combination"] },
        { id: "tables", label: "Tables decorated", type: "number", unit: "tables", placeholder: "10" },
        { id: "entrance", label: "Entrance arch", type: "select", options: ["Yes", "No"] },
        { id: "flowers", label: "Flower budget", type: "select", options: ["Standard", "Premium"] },
        { id: "lighting", label: "Fairy lights", type: "select", options: ["Included", "Not included"] },
      ],
    },
    {
      name: "Grand Reception",
      tier: "Signature",
      basePrice: 180000,
      fields: [
        { id: "mandap", label: "Mandap style", type: "select", options: ["Luxury floral", "Architectural"] },
        { id: "tables", label: "Tables decorated", type: "number", unit: "tables", placeholder: "25" },
        { id: "entrance", label: "Floral arch", type: "select", options: ["Grand - 8ft width"] },
        { id: "aisle", label: "Aisle decor", type: "select", options: ["Full floral runner"] },
        { id: "stage", label: "Stage design", type: "select", options: ["Custom backdrop included"] },
        { id: "lighting", label: "Lighting design", type: "select", options: ["Ambient + fairy + spots"] },
      ],
    },
    {
      name: "Heritage Palace",
      tier: "Heritage",
      basePrice: 350000,
      fields: [
        { id: "concept", label: "Theme concept", type: "text", placeholder: "Fully custom Tamil theme" },
        { id: "tables", label: "Tables", type: "text", placeholder: "40+" },
        { id: "flowers", label: "Flower sourcing", type: "select", options: ["Premium imported + local"] },
        { id: "stage", label: "Stage design", type: "text", placeholder: "Bespoke heritage stage" },
        { id: "lighting", label: "Full lighting", type: "select", options: ["Cinematic setup"] },
        { id: "props", label: "Props & rentals", type: "select", options: ["Included"] },
      ],
    },
  ],
  "bridal-makeup": [
    {
      name: "Bridal Glow",
      tier: "Essential",
      basePrice: 15000,
      fields: [
        { id: "trial", label: "Trial session", type: "select", options: ["1 trial included", "Not included"] },
        { id: "hair", label: "Hair styling", type: "select", options: ["Included", "Not included"] },
        { id: "saree", label: "Saree draping", type: "select", options: ["Included", "Not included"] },
        { id: "touch", label: "Touch-up kit", type: "select", options: ["Provided", "Not provided"] },
        { id: "duration", label: "Getting ready time", type: "text", placeholder: "3 hours" },
      ],
    },
    {
      name: "Tamil Bride Complete",
      tier: "Signature",
      basePrice: 28000,
      fields: [
        { id: "trial", label: "Trial sessions", type: "number", unit: "sessions", placeholder: "2" },
        { id: "hair", label: "Hair styling", type: "select", options: ["Full bridal hair"] },
        { id: "saree", label: "Saree draping", type: "select", options: ["Kanjivaram draping specialist"] },
        { id: "jewel", label: "Jewellery assist", type: "select", options: ["Included"] },
        { id: "touch", label: "Touch-up coverage", type: "text", placeholder: "Full day touch-up" },
        { id: "duration", label: "Session time", type: "text", placeholder: "5-6 hours" },
      ],
    },
    {
      name: "Heritage Bridal",
      tier: "Heritage",
      basePrice: 50000,
      fields: [
        { id: "trial", label: "Trial sessions", type: "number", unit: "sessions", placeholder: "3" },
        { id: "airbrush", label: "Airbrush makeup", type: "select", options: ["HD Airbrush included"] },
        { id: "hair", label: "Hair extensions", type: "select", options: ["Available if needed"] },
        { id: "family", label: "Family makeup", type: "select", options: ["4 family members included"] },
        { id: "saree", label: "Saree draping", type: "select", options: ["Bride + bridesmaids"] },
        { id: "duration", label: "Full-day coverage", type: "select", options: ["From morning through reception"] },
      ],
    },
  ],
  invitation: [
    {
      name: "Classic Print",
      tier: "Essential",
      basePrice: 5000,
      fields: [
        { id: "count", label: "Card quantity", type: "number", unit: "cards", placeholder: "100" },
        { id: "size", label: "Card size", type: "select", options: ["A5", "A4", "DL envelope"] },
        { id: "print", label: "Print type", type: "select", options: ["Digital print", "Offset"] },
        { id: "design", label: "Design rounds", type: "number", unit: "revisions", placeholder: "2" },
        { id: "delivery", label: "Delivery", type: "select", options: ["Courier - within Jaffna"] },
      ],
    },
    {
      name: "Heritage Prestige",
      tier: "Signature",
      basePrice: 15000,
      fields: [
        { id: "count", label: "Card quantity", type: "number", unit: "cards", placeholder: "250" },
        { id: "finish", label: "Finishing", type: "select", options: ["Gold foil", "Embossed", "Spot UV"] },
        { id: "insert", label: "Insert cards", type: "select", options: ["RSVP + venue map included"] },
        { id: "envelope", label: "Envelopes", type: "select", options: ["Custom printed envelopes"] },
        { id: "design", label: "Design rounds", type: "number", unit: "revisions", placeholder: "4" },
        { id: "motif", label: "Tamil motifs", type: "select", options: ["Traditional kolam", "Temple art"] },
      ],
    },
    {
      name: "Royal Keepsake",
      tier: "Heritage",
      basePrice: 30000,
      fields: [
        { id: "count", label: "Card quantity", type: "text", placeholder: "500+" },
        { id: "material", label: "Card material", type: "select", options: ["Velvet", "Handmade paper", "Acrylic"] },
        { id: "custom", label: "Custom artwork", type: "select", options: ["Bespoke hand-illustrated"] },
        { id: "box", label: "Gift box option", type: "select", options: ["Luxury box with ribbon"] },
        { id: "digital", label: "E-invite", type: "select", options: ["Animated digital version"] },
        { id: "design", label: "Designer calls", type: "text", placeholder: "Unlimited revisions" },
      ],
    },
  ],
};
