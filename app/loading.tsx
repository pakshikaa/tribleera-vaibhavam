import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-ink">
      {/* Gold arch watermark */}
      <svg
        className="mb-6 w-16 text-gold/20"
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

      {/* Logo */}
      <Image
        src="/logo/tribleera-mark-192.png"
        alt="TRIBLEERA"
        width={56}
        height={56}
        className="mb-4 rounded-[12px]"
        style={{ boxShadow: "0 0 30px rgba(212,175,106,0.3)" }}
      />

      {/* Brand name */}
      <p className="font-display text-xl tracking-widest text-cream">TRIBLEERA</p>
      <p className="mb-6 mt-0.5 font-display text-[10px] tracking-[0.35em] text-gold/60">VAIBHAVAM</p>

      {/* Gold shimmer bar */}
      <div className="h-0.5 w-32 overflow-hidden rounded-full bg-cream/10">
        <div className="h-full w-full animate-[loading_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
