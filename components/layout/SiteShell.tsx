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

// Sign-in is asked for at the point of commitment, not at the door. Browsing
// the directory, a vendor's profile and their packages stays open: couples
// compare before they commit, and these are the pages that need to be
// crawlable. Everything that touches money or a customer's own records is
// behind the wall.
const PROTECTED_PREFIXES = ["/dashboard/customer", "/booking"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerAuth, setCustomerAuth] = useState<string | null | undefined>(undefined);
  const isPortal = PORTAL_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

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

    // Send them back to what they were actually trying to reach — bouncing a
    // customer to the homepage after they sign in loses the cart they came for.
    if (!customerAuth && isProtected) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (customerAuth && isAuthRoute) {
      router.replace("/");
    }
  }, [customerAuth, isAuthRoute, isProtected, isPortal, pathname, router]);

  if (isPortal) {
    return <>{children}</>;
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Only the protected routes wait on the auth check. Public pages render
  // straight through — holding them behind a spinner meant the server sent a
  // loading state and nothing else, so crawlers saw an empty site.
  if (isProtected && !customerAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
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
