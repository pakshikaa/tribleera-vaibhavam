import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | TRIBLEERA VAIBHAVAM",
  description: "Sign in to plan your Tamil wedding with TRIBLEERA VAIBHAVAM.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
