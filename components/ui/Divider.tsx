export function KnotDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/60 to-gold/60" />
      <svg width="22" height="22" viewBox="0 0 200 200" className="shrink-0 text-gold">
        <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
          <path d="M100 60 C70 60 70 90 100 100 C130 110 130 140 100 140" />
          <path d="M100 60 C130 60 130 90 100 100 C70 110 70 140 100 140" />
        </g>
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/60 to-gold/60" />
    </div>
  );
}
