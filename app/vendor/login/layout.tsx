import type { Metadata } from "next";

// Root layout applies the "%s | TRIBLEERA VAIBHAVAM" template, so the title
// here is just the page name — spelling out the brand again rendered
// "Vendor Login | TRIBLEERA VAIBHAVAM | TRIBLEERA VAIBHAVAM".
export const metadata: Metadata = {
  title: "Vendor Portal",
  description: "Sign in to your TRIBLEERA VAIBHAVAM vendor partner portal.",
};

export default function VendorLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
