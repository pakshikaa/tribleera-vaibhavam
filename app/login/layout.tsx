import type { Metadata } from "next";

// Root layout appends "| TRIBLEERA VAIBHAVAM" via its title template — repeating
// the brand here double-printed it.
export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to plan your Tamil wedding with TRIBLEERA VAIBHAVAM.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
