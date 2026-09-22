import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--clay)] text-white hover:bg-[#ad5735]",
        secondary: "bg-[var(--sand)] text-[var(--pine)] hover:bg-[#ddd1c0]",
        outline: "border border-[color:var(--pine)/25%] text-[var(--pine)] hover:bg-[var(--sand)]",
        ghost: "text-[var(--pine)] hover:bg-[var(--sand)]",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        link: "text-[var(--clay)] underline-offset-4 hover:underline",
        admin: "rounded-md bg-slate-900 text-white hover:bg-slate-800",
        adminOutline: "rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        adminGhost: "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, variant, size, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild) {
      return React.cloneElement(React.Children.only(children) as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (React.Children.only(children) as React.ReactElement<{ className?: string }>).props.className),
      });
    }
    return <button className={classes} ref={ref} {...props}>{children}</button>;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };