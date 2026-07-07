import type { Metadata } from "next";

export const metadata: Metadata = {
  // absolute: bare "About TRIBLEERA VAIBHAVAM" was getting the root layout's
  // "%s | TRIBLEERA VAIBHAVAM" template applied on top, doubling the brand name.
  title: { absolute: "About TRIBLEERA VAIBHAVAM" },
  description: "How TRIBLEERA VAIBHAVAM curates verified wedding vendors for Jaffna couples — our story and mission.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
