import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="text-center">
        {/* Gold arch watermark */}
        <svg
          className="mx-auto mb-6 w-24 text-gold/20"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180"
            stroke="currentColor"
            strokeWidth="5"
          />
          <path
            d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180"
            stroke="currentColor"
            strokeWidth="5"
          />
        </svg>

        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">404</p>

        <h1 className="mb-4 font-display text-4xl font-bold text-cream md:text-6xl">
          Page not found.
        </h1>

        <p className="mx-auto mb-8 max-w-md text-lg text-cream-dim">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>

        <div className="flex justify-center gap-3">
          <Button href="/" variant="gold">
            Go to homepage
          </Button>
          <Button href="/vendors" variant="glass">
            Browse vendors
          </Button>
        </div>
      </div>
    </div>
  );
}
