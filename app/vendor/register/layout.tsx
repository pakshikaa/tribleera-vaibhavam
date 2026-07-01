import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a vendor",
  description:
    "List your photography, decoration, bridal makeup, cake or invitation business on TRIBLERERA VAIBHAVAM — Jaffna's premium wedding marketplace.",
  alternates: { canonical: "/vendor/register" },
};

export default function VendorRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
