"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CookieConsent } from "@/components/ui/CookieConsent";

// Vendor/admin portal routes get their own dedicated layout (sidebar or a
// standalone login screen) and must not show the public marketing chrome.
const PORTAL_PREFIXES = ["/dashboard/admin", "/admin/", "/dashboard/vendor", "/vendor/"];
const AUTH_ROUTES = ["/login", "/signup"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerAuth, setCustomerAuth] = useState<string | null | undefined>(undefined);
  const isPortal = PORTAL_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (isPortal || typeof window === "undefined") {
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
  }, [isPortal, pathname]);

  useEffect(() => {
    if (isPortal || customerAuth === undefined) {
      return;
    }

    if (!customerAuth && !isAuthRoute) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (customerAuth && isAuthRoute) {
      router.replace("/dashboard/customer");
    }
  }, [customerAuth, isAuthRoute, isPortal, pathname, router]);

  if (isPortal) {
    return <>{children}</>;
  }

  if (customerAuth === undefined && !isAuthRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content" className="min-h-screen pb-20 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFloat />
      <BackToTop />
      <CookieConsent />
    </>
  );
}
