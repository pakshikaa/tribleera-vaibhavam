"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [customerAuth, setCustomerAuth] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        setCustomerAuth(sessionStorage.getItem("customer-auth"));
      } catch {
        setCustomerAuth(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (customerAuth === undefined) {
      return;
    }

    if (!customerAuth) {
      router.replace("/login?redirect=/");
    }
  }, [customerAuth, router]);

  if (!customerAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
