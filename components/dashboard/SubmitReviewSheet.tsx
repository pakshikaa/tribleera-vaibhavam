"use client";

import { useId, useState } from "react";
import { Star } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorById } from "@/lib/data/vendors";

interface ReviewRecord {
  id: string;
  vendorId: string;
  bookingId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export function SubmitReviewSheet({
  bookingId,
  vendorId,
  author,
  open,
  onOpenChange,
  onSubmitted,
}: {
  bookingId: string;
  vendorId: string;
  author: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}) {
  const vendor = getVendorById(vendorId);
  const fileInputId = useId();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("");
  const { showToast } = useToast();

  function submitReview() {
    if (rating < 1 || comment.trim().length < 20) {
      showToast("Please add a rating and at least 20 characters.", "error");
      return;
    }

    const reviews = readLocalStorage<ReviewRecord[]>("tribleera-reviews", []);
    const nextReview: ReviewRecord = {
      id: `review-${Date.now()}`,
      bookingId,
      vendorId,
      author,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    writeLocalStorage("tribleera-reviews", [nextReview, ...reviews]);
    showToast("Thank you! Your review helps other couples.", "success");
    onSubmitted();
    onOpenChange(false);
    setRating(0);
    setHovered(0);
    setComment("");
    setFileName("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-lg">
        <SheetTitle>Leave a Review</SheetTitle>
        <div className="mt-6 space-y-6">
          <div>
            <p className="font-display text-2xl text-slate">{vendor?.name ?? "Vendor"}</p>
            <p className="mt-1 text-sm text-slate-soft">
              {vendor ? getCategoryBySlug(vendor.categorySlug)?.name : "Wedding vendor"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate">Rate your experience</p>
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const filled = value <= (hovered || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(value)}
                    className="rounded-full p-1"
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  >
                    <Star size={24} className={filled ? "fill-gold text-gold" : "text-slate/20"} />
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            label="Your review"
            rows={6}
            minLength={20}
            maxLength={500}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            hint={`${comment.length}/500 characters`}
          />
          <div>
            <label htmlFor={fileInputId} className="block text-sm font-medium text-slate">
              Upload a photo
            </label>
            <input
              id={fileInputId}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              className="mt-2 block w-full rounded-[4px] border border-dashed border-slate/20 bg-white px-3 py-3 text-sm text-slate"
            />
            {fileName && <p className="mt-2 text-xs text-slate-soft">{fileName}</p>}
          </div>
          <Button onClick={submitReview} variant="gold" fullWidth>
            Submit Review
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
