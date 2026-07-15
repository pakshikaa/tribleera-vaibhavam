import type { Metadata } from "next";

// Root layout appends "| TRIBLEERA VAIBHAVAM" via its title template — repeating
// the brand here double-printed it.
export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
