"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-accent bg-[length:200%_200%] text-white
    border border-white/20 shadow-btn-primary
    hover:shadow-glow hover:border-white/30
    animate-gradient-shift
  `,
  secondary: `
    bg-themed-glass text-themed-primary
    border border-[color:var(--color-glass-border-lg)] backdrop-blur-md
    hover:bg-themed-glass-hover hover:border-[color:var(--color-border-strong)]
    hover:shadow-glow-sm
  `,
  ghost: `
    bg-transparent text-themed-muted
    hover:text-themed-primary hover:bg-themed-glass-hover
  `,
  danger: `
    bg-rose-500/10 text-rose-400
    border border-rose-500/25 backdrop-blur-md
    hover:bg-rose-500/15 hover:border-rose-500/40
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          btn-glow inline-flex items-center justify-center gap-2 font-semibold
          transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          focus-visible:ring-offset-2 focus-visible:ring-offset-surface
          disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none
          active:scale-[0.96]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
