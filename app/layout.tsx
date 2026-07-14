import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    description: "Jaffna's most trusted wedding vendors — verified, bookable, secure.",
    type: "website",
    locale: "en_LK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
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
              name: "TRIBLEERA VAIBHAVAM",
              alternateName: "TRIBLEERA",
              url: "https://tribleera-vaibhavam.vercel.app",
              logo: "https://tribleera-vaibhavam.vercel.app/logo/tribleera-mark-512.png",
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
        <ToastProvider>
          <NotificationProvider>
            <CartProvider>
              <ShortlistProvider>
                <CompareProvider>
                  <MotionProvider>
                    <SiteShell>{children}</SiteShell>
                  </MotionProvider>
                </CompareProvider>
              </ShortlistProvider>
            </CartProvider>
          </NotificationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
