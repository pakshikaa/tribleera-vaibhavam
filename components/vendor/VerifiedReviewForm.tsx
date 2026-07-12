"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { formatDateShort } from "@/lib/utils/format";

interface UserReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface StoredBooking {
  status?: string;
  adminVerified?: boolean;
  items?: { vendorId?: string; vendorSlug?: string }[];
}

function reviewsKey(vendorSlug: string) {
  return `TRIBLEERA-user-reviews-${vendorSlug}`;
}

/** True when this browser has a confirmed (admin-verified) booking with the vendor. */
function hasConfirmedBooking(vendorSlug: string): boolean {
  const matchesVendor = (booking: StoredBooking) =>
    Boolean(
      booking.items?.some((item) => item.vendorId === vendorSlug || item.vendorSlug === vendorSlug) &&
        (booking.adminVerified === true || booking.status === "confirmed" || booking.status === "completed")
    );
  try {
    const last = readLocalStorage<StoredBooking | null>("TRIBLEERA-last-booking", null);
    if (last && matchesVendor(last)) return true;
    const all = readLocalStorage<StoredBooking[]>("tv-bookings", []);
    return all.some(matchesVendor);
  } catch {
    return false;
  }
}

/**
 * Review submission gated on a verified booking — anyone can read reviews,
 * but only customers this platform has actually seen book the vendor can
 * write one. Keeps the review wall honest (W-17).
 */
export function VerifiedReviewForm({ vendorSlug, vendorName }: { vendorSlug: string; vendorName: string }) {
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEligible(hasConfirmedBooking(vendorSlug));
    setMyReviews(readLocalStorage<UserReview[]>(reviewsKey(vendorSlug), []));
  }, [vendorSlug]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    let author = "TRIBLEERA customer";
    try {
      author = sessionStorage.getItem("customer-name") || author;
    } catch {}
    const review: UserReview = {
      id: `UR-${Date.now()}`,
      author,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    const next = [review, ...myReviews];
    setMyReviews(next);
    writeLocalStorage(reviewsKey(vendorSlug), next);
    setComment("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  if (eligible === null) return null;

  return (
    <div className="mt-5 space-y-4">
      {/* Reviews written from this browser (already verified) */}
      {myReviews.map((review) => (
        <div key={review.id} className="rounded-[8px] border border-gold/25 bg-gold/[0.04] p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <Avatar name={review.author} size={38} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate">{review.author}</p>
              <p className="text-xs text-slate-soft">{formatDateShort(review.date)}</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12} className={star <= review.rating ? "fill-gold text-gold" : "text-slate/20"} />
              ))}
              <span className="ml-1 text-[10px] font-semibold text-success">✓ Verified booking</span>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-soft">{review.comment}</p>
        </div>
      ))}

      {eligible ? (
        <form onSubmit={handleSubmit} className="rounded-[8px] border border-success/25 bg-success-pale/30 p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate">
            <CheckCircle2 size={15} className="text-success" aria-hidden="true" /> Share your experience with {vendorName}
          </p>
          <p className="mt-1 text-xs text-slate-soft">
            Your booking is verified — this review will carry the verified badge.
          </p>
          <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star size={22} className={star <= rating ? "fill-gold text-gold" : "text-slate/25 hover:text-gold"} />
              </button>
            ))}
          </div>
          <div className="mt-3">
            <Textarea
              label="Your review"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the service, the communication, the final result?"
            />
          </div>
          <Button type="submit" className="mt-3">
            Post verified review
          </Button>
          {submitted && <p className="mt-2 text-xs font-semibold text-success">✓ Review posted — nandri!</p>}
        </form>
      ) : (
        <div className="flex items-start gap-3 rounded-[8px] border border-slate/10 bg-ivory p-5">
          <Lock size={16} className="mt-0.5 shrink-0 text-slate-soft" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-slate">Reviews are from verified bookings only</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-soft">
              Book {vendorName} through TRIBLEERA and, once your booking is confirmed, you can share your experience
              here.{" "}
              <Link href={`/vendors/${vendorSlug}/packages`} className="font-semibold text-burgundy hover:underline">
                View packages →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
