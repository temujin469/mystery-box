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
  /** Click handler for the paper component */
  onClick?: () => void;
}

/**
 * Reusable Paper component with consistent styling across the application.
 * 
 * Features:
 * - Consistent bg-card, rounded-xl, border, shadow-sm styling
 * - Three padding variants: compact (p-3 sm:p-4), default (p-4 sm:p-8), spacious (p-6 sm:p-10)
 * - Optional entrance animation
 * - Optional click handler with automatic hover effects
 * - Customizable with additional className
 * 
 * @example
 * ```tsx
 * <Paper variant="compact" animated onClick={() => console.log('clicked')}>
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Paper>
 * ```
 */
const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ children, className, variant = "default", animated = false, onClick, ...props }, ref) => {
    const baseClasses = "bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl rounded-xl shadow-2xl";
    
    const variantClasses = {
      default: "p-4 sm:p-8",
      compact: "p-3 sm:p-4",
      spacious: "p-6 sm:p-10",
    };
    
    const animationClasses = animated 
      ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-300" 
      : "";

    const clickableClasses = onClick 
      ? "cursor-pointer hover:shadow-xl hover:bg-muted" 
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          animationClasses,
          clickableClasses,
          className
        )}
        onClick={onClick}
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
