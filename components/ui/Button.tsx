import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-[4px] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-burgundy text-white hover:bg-burgundy-deep shadow-soft hover:shadow-lift active:scale-[0.98]",
        secondary:
          "bg-transparent text-burgundy border border-burgundy/40 hover:border-burgundy hover:bg-burgundy/5 active:scale-[0.98]",
        tertiary: "bg-transparent text-gold-deep hover:text-burgundy underline-offset-4 hover:underline",
        "ghost-light":
          "bg-white/10 text-white border border-white/40 backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]",
        /* Dark-luxury system additions */
        gold: "bg-gradient-to-br from-gold-light via-gold to-gold-deep text-ink shadow-glow hover:-translate-y-0.5 active:scale-[0.98]",
        glass: "glass text-cream hover:border-gold hover:text-gold-light hover:-translate-y-0.5 active:scale-[0.98]",
      },
      size: {
        sm: "text-sm px-4 py-2 gap-1.5",
        md: "text-[15px] px-5 py-2.5 gap-2",
        lg: "text-base px-7 py-3.5 gap-2.5",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface BaseProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconRight?: ReactNode;
  asChild?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  variant,
  size,
  className,
  children,
  icon,
  iconRight,
  fullWidth,
  asChild,
  href,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (href) {
    const { target, rel } = props as LinkButtonProps;
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {icon}
        {children}
        {iconRight}
      </Link>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {icon}
      {children}
      {iconRight}
    </Comp>
  );
}
