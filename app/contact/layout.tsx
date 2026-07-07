import type { Metadata } from "next";

export const metadata: Metadata = {
  // absolute: bare "Contact TRIBLEERA VAIBHAVAM" was getting the root layout's
  // "%s | TRIBLEERA VAIBHAVAM" template applied on top, doubling the brand name.
  title: { absolute: "Contact TRIBLEERA VAIBHAVAM" },
  description: "Get in touch with the TRIBLEERA VAIBHAVAM team for support with your Jaffna wedding booking.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
