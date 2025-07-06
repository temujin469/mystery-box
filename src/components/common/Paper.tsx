import React from "react";
import { cn } from "@/lib/utils";

interface PaperProps {
  /** Content to be rendered inside the card */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the card */
  className?: string;
  /** Card size variant */
  variant?: "default" | "compact" | "spacious";
  /** Whether to show entrance animation */
  animated?: boolean;
}

/**
 * Reusable Paper component with consistent styling across the application.
 * 
 * Features:
 * - Consistent bg-card, rounded-xl, border, shadow-sm styling
 * - Three padding variants: compact (p-3 sm:p-4), default (p-4 sm:p-8), spacious (p-6 sm:p-10)
 * - Optional entrance animation
 * - Customizable with additional className
 * 
 * @example
 * ```tsx
 * <Paper variant="compact" animated>
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Paper>
 * ```
 */
const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ children, className, variant = "default", animated = false, ...props }, ref) => {
    const baseClasses = "bg-card rounded-xl border shadow-sm";
    
    const variantClasses = {
      default: "p-4 sm:p-8",
      compact: "p-3 sm:p-4",
      spacious: "p-6 sm:p-10",
    };
    
    const animationClasses = animated 
      ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-300" 
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          animationClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Paper.displayName = "Paper";

export { Paper };
export default Paper;
