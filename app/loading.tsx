import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-burgundy/15 border-t-burgundy" />
          <Image src="/logo/tribleera-mark-64.png" alt="TRIBLEERA VAIBHAVAM" width={32} height={32} className="rounded-sm" />
        </div>
        <p className="font-display text-sm text-slate-soft">TRIBLEERA VAIBHAVAM</p>
      </div>
    </div>
  );
}
