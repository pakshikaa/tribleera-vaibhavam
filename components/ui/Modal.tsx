"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Modal({
  title,
  description,
  children,
  open,
  onOpenChange,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-slate/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[71] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white p-6 shadow-lift focus:outline-none",
            "data-[state=open]:animate-scale-in"
          )}
        >
          <DialogPrimitive.Title className="font-display text-xl text-burgundy-deep">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="mt-1 text-sm text-slate-soft">
              {description}
            </DialogPrimitive.Description>
          ) : null}
          <div className="mt-5">{children}</div>
          <DialogPrimitive.Close className="absolute right-5 top-5 text-slate hover:text-burgundy" aria-label="Close modal">
            <X size={20} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
