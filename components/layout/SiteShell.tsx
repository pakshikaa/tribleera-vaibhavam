"use client";

import { usePathname } from "next/navigation";
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

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = PORTAL_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPortal) {
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
