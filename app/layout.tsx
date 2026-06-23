import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartProvider } from "@/context/CartContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tribleera-vaibhavam.example.com"),
  title: {
    default: "TRIBLEERA VAIBHAVAM | Premium Tamil Wedding Marketplace",
    template: "%s | TRIBLEERA VAIBHAVAM",
  },
  description:
    "Discover and book verified photographers, cake artists, decorators, bridal makeup artists and invitation designers for your Jaffna wedding. Transparent pricing, secure milestone payments, curated for the discerning couple.",
  keywords: [
    "Jaffna wedding planning",
    "wedding vendors Jaffna",
    "Tamil wedding marketplace Sri Lanka",
    "Jaffna bridal makeup",
    "Sri Lanka wedding photography",
  ],
  openGraph: {
    title: "TRIBLEERA VAIBHAVAM | Premium Tamil Wedding Marketplace",
    description: "தேர்வின் செம்மை, வைபவத்தின் பெருமை — curated vendors for your Jaffna wedding.",
    type: "website",
    locale: "en_LK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* This rule targets the legacy Pages Router's pages/_document.js;
            in App Router, app/layout.tsx IS the single shared shell for
            every route, so a <link> here is the documented, correct pattern. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tribleera Vaibhavam",
              alternateName: "TRIBLEERA VAIBHAVAM",
              url: "https://tribleera-vaibhavam.example.com",
              logo: "https://tribleera-vaibhavam.example.com/logo/tribleera-mark-512.png",
              description:
                "A curated wedding services marketplace for Jaffna, Sri Lanka — verified photographers, decorators, bridal makeup artists, cake ateliers and invitation designers.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaffna",
                addressCountry: "LK",
              },
              areaServed: "LK",
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-burgundy focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lift"
        >
          Skip to main content
        </a>
        <CartProvider>
          <ShortlistProvider>
            <MotionProvider>
              <Header />
              <main id="main-content" className="min-h-screen pb-20 md:pb-0">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <MobileBottomNav />
            </MotionProvider>
          </ShortlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
