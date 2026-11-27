import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--garden-gold)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--garden-leaf)] text-[var(--garden-mist)] hover:bg-[var(--garden-deep)] shadow-sm",
        secondary:
          "bg-[var(--garden-mist)] text-[var(--garden-deep)] hover:bg-white/90 border border-[var(--garden-leaf)]/20",
        outline:
          "border border-[var(--garden-leaf)]/35 bg-transparent text-[var(--garden-deep)] hover:bg-[var(--garden-leaf)]/8",
        ghost: "hover:bg-[var(--garden-leaf)]/10 text-[var(--garden-deep)]",
        soft: "bg-[var(--garden-gold)] text-[var(--garden-deep)] hover:brightness-105 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";
