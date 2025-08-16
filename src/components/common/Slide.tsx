"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A reusable slide-out panel component that animates from the right side of the screen.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   
 *   return (
 *     <Slide
 *       isOpen={isOpen}
 *       onClose={() => setIsOpen(false)}
 *       title="My Slide Panel"
 *       maxWidth="lg"
 *       footer={
 *         <div className="flex gap-2">
 *           <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *           <Button variant="default">Confirm</Button>
 *         </div>
 *       }
 *     >
 *       <div className="p-6">
 *         Your content here
 *       </div>
 *     </Slide>
 *   );
 * }
 * ```
 */

interface SlideProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showHeader?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function Slide({
  isOpen,
  onClose,
  title,
  maxWidth = "md",
  showHeader = true,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: SlideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready for animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-black/95 backdrop-blur-md border-l border-gray-700/30 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          maxWidthClasses[maxWidth],
          isAnimating ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Header */}
        {showHeader && (
          <div
            className={cn(
              "flex items-center justify-between p-4 sm:p-6 sm:py-4 border-b border-gray-700/20 flex-shrink-0",
              headerClassName
            )}
          >
            {title && (
              <h2 className="text-[16px] font-semibold text-foreground bg-clip-text">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors group ml-auto"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            "flex-1 overflow-y-auto scroll-smooth px-5 py-10",
            contentClassName
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(75, 85, 99, 0.5) rgba(55, 65, 81, 0.5)",
            // maxHeight: footer 
            //   ? showHeader ? "calc(100vh - 176px)" : "calc(100vh - 88px)"
            //   : showHeader ? "calc(100vh - 88px)" : "100vh",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "flex-shrink-0 p-4 sm:p-5 sm:py-4 border-t border-gray-700/20 bg-gray-900/30 backdrop-blur-sm",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
