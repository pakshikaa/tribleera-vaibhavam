import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { heroImage, trustSectionImage } from "@/lib/data/images";

type AuthShellProps = {
  mode: "login" | "signup";
  eyebrow: string;
  title: string;
  subtitle: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  children: React.ReactNode;
};

const HIGHLIGHTS = [
  "Verified Tamil wedding specialists",
  "Transparent pricing and secure bookings",
  "Faster planning without inquiry fatigue",
];

export function AuthShell({
  mode,
  eyebrow,
  title,
  subtitle,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}: AuthShellProps) {
  const featureImage = mode === "signup" ? heroImage : trustSectionImage;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6ede2] text-slate">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,106,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(92,4,39,0.10),transparent_34%)]" />
      <div className="absolute left-[6%] top-14 h-48 w-48 rounded-full bg-gold/18 blur-3xl" />
      <div className="absolute bottom-12 right-[8%] h-52 w-52 rounded-full bg-burgundy/8 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1420px] items-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[30px] border border-white/60 bg-[#fffaf4]/82 shadow-[0_28px_90px_rgba(67,28,36,0.12)] backdrop-blur-xl lg:min-h-[calc(100vh-64px)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative min-h-[420px] overflow-hidden lg:min-h-full">
            <Image
              src={featureImage}
              alt="Tamil wedding celebration"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover object-[center_24%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,4,12,0.30)_0%,rgba(21,4,12,0.44)_32%,rgba(21,4,12,0.70)_72%,rgba(21,4,12,0.88)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(21,4,12,0.08)_0%,rgba(21,4,12,0.14)_35%,rgba(21,4,12,0.72)_100%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-28 bg-[linear-gradient(90deg,rgba(21,4,12,0)_0%,rgba(21,4,12,0.55)_40%,rgba(255,250,244,0.86)_100%)] lg:block" />

            <div className="relative flex h-full flex-col justify-between p-6 text-[#F7EEE2] sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <Link href="/" className="inline-flex items-center gap-3">
                  <Image
                    src="/logo/tribleera-mark-192.png"
                    alt="TRIBLEERA"
                    width={44}
                    height={44}
                    className="rounded-[10px] border border-white/20 shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
                  />
                  <span className="flex flex-col leading-none">
                    <span className="font-display text-[15px] font-bold tracking-[0.16em] text-white">TRIBLEERA</span>
                    <span className="mt-1 font-display text-[8px] font-medium tracking-[0.34em] text-white/70">
                      VAIBHAVAM
                    </span>
                  </span>
                </Link>

                <div className="hidden rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.12em] text-white/82 backdrop-blur md:inline-flex">
                  Premium wedding planning
                </div>
              </div>

              <div className="max-w-[540px] pt-16 sm:pt-20 lg:pt-24">
                <p className="inline-flex rounded-full border border-gold/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light backdrop-blur">
                  {eyebrow}
                </p>
                <h1 className="mt-5 max-w-[9ch] font-display text-[clamp(2.8rem,5vw,5.2rem)] font-bold leading-[0.9] tracking-[-0.045em] text-[#7A103B] text-shadow-dark sm:max-w-[8ch]">
                  {title}
                </h1>
                <p className="mt-4 max-w-[44ch] text-[15px] leading-7 text-white/84 sm:text-[16px]">
                  {subtitle}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {HIGHLIGHTS.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-white/14 bg-[rgba(255,255,255,0.09)] p-4 backdrop-blur-sm"
                    >
                      <CheckCircle2 size={16} className="text-gold-light" />
                      <p className="mt-3 text-[14px] leading-5 text-white/84">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex items-center bg-[linear-gradient(180deg,#fffaf5_0%,#fffdf9_100%)] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[470px]">
              <div className="rounded-[26px] border border-[rgba(92,4,39,0.08)] bg-white/96 p-5 shadow-[0_20px_65px_rgba(92,4,39,0.10)] sm:p-7 lg:p-8">
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-burgundy/60">
                    Customer Access
                  </p>
                  <h2 className="mt-2 font-display text-[2.05rem] font-bold leading-[1.02] text-burgundy-deep sm:text-[2.35rem]">
                    {mode === "login" ? "Welcome back" : "Start your planning journey"}
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-slate/70">
                    {mode === "login"
                      ? "Continue to your bookings, shortlist, and wedding planning dashboard."
                      : "Create your account once and continue browsing vendors without friction."}
                  </p>
                </div>

                {children}

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate/10 pt-5 text-sm">
                  <p className="text-slate/65">
                    {alternateLabel}{" "}
                    <Link href={alternateHref} className="font-semibold text-burgundy transition-colors hover:text-burgundy-deep">
                      {alternateText}
                    </Link>
                  </p>
                  <Link
                    href={alternateHref}
                    aria-label={alternateText}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-burgundy/15 text-burgundy transition-all hover:-translate-y-0.5 hover:border-burgundy/30 hover:bg-burgundy/5"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate/45">
                <span>Secure session</span>
                <span className="h-1 w-1 rounded-full bg-slate/25" />
                <span>Fast entry</span>
                <span className="h-1 w-1 rounded-full bg-slate/25" />
                <span>No inquiry overload</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
