import { z } from "zod";

/** Accepts +94 77 410 0012, 0774100012, +94774100012, etc. */
const sriLankanMobile = /^(\+94|0)?\s?7\d[\s-]?\d{3}[\s-]?\d{4}$/;

export const vendorRegisterSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(80),
  ownerName: z.string().trim().min(2, "Owner name is required").max(80),
  phone: z.string().trim().regex(sriLankanMobile, "Enter a valid Sri Lankan mobile number, e.g. +94 77 410 0012"),
  email: z.string().trim().email("Enter a valid email address"),
  category: z.string().min(1, "Select a category"),
  city: z.string().trim().min(2, "City is required").max(60),
  experienceYears: z.coerce
    .number({ message: "Enter a number" })
    .int("Whole years only")
    .min(0, "Can't be negative")
    .max(60, "That's a lot of years — double-check this"),
  about: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — at least 20 characters")
    .max(600, "Keep it under 600 characters"),
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
