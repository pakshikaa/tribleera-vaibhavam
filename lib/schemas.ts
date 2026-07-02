import { z } from "zod";

/** Accepts +94 77 410 0012, 0774100012, +94774100012, etc. */
const sriLankanMobile = /^(\+94|0)?\s?7\d[\s-]?\d{3}[\s-]?\d{4}$/;

export const vendorRegisterSchema = z.object({
  // Step 1 — Identity
  businessName: z.string().trim().min(2, "Business name is required").max(80),
  ownerName: z.string().trim().min(2, "Owner name is required").max(80),
  phone: z.string().trim().regex(sriLankanMobile, "Enter a valid Sri Lankan mobile, e.g. +94 77 410 0012"),
  whatsapp: z.string().trim().regex(sriLankanMobile, "Enter a valid WhatsApp number"),
  email: z.string().trim().email("Enter a valid email address"),

  // Step 2 — Service
  category: z.string().min(1, "Select a category"),
  city: z.enum(["Jaffna", "Colombo", "Trincomalee", "Batticaloa", "Kandy", "Vavuniya", "Other"] as const, {
    error: "Select a city",
  }),
  location: z.string().trim().min(5, "Enter your area/street — e.g. Nallur, Jaffna"),
  tagline: z.string().trim().min(10, "Min 10 characters").max(100),
  about: z.string().trim().min(30, "Min 30 characters").max(600),
  experienceYears: z.coerce.number({ message: "Enter a number" }).int("Whole years only").min(0).max(60),
  startingPrice: z.coerce.number({ message: "Enter a number" }).min(1000, "Minimum LKR 1,000"),

  // Step 3 — Portfolio
  portfolioCount: z.coerce.number().min(3, "Upload at least 3 portfolio photos"),

  // Step 4 — Terms
  agreeTerms: z.literal(true, "You must agree to the vendor terms"),
  agreeEscrow: z.literal(true, "You must acknowledge the escrow policy"),
});

export type VendorRegisterInput = z.input<typeof vendorRegisterSchema>;
export type VendorRegisterValues = z.output<typeof vendorRegisterSchema>;

export const customerDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(sriLankanMobile, "Enter a valid Sri Lankan mobile number, e.g. +94 77 410 0012"),
  email: z.string().trim().email("Enter a valid email address"),
  eventDate: z
    .string()
    .min(1, "Select your event date")
    .refine((d) => new Date(d).getTime() > Date.now(), "Event date must be in the future"),
});

export type CustomerDetailsValues = z.infer<typeof customerDetailsSchema>;
