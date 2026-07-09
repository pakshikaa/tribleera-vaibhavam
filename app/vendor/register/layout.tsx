import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register your business",
  description:
    "List your photography, decoration, bridal makeup, cake or invitation business on TRIBLEERA VAIBHAVAM — Jaffna's premium wedding marketplace.",
  alternates: { canonical: "/vendor/register" },
};

export default function VendorRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
