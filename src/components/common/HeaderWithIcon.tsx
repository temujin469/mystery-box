"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface HeaderWithIconProps {
  /** The icon to display - can be emoji string or React component */
  icon: ReactNode;
  /** The main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional action button */
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    icon?: ReactNode;
  };
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Reusable header component with icon and optional action button.
 * 
 * Features:
 * - Displays icon (emoji or React component) in a styled container
 * - Shows title and optional subtitle
 * - Optional action button with customizable variant and icon
 * - Responsive design (button text hidden on small screens)
 * - Consistent styling across profile pages
 * 
 * @example
 * ```tsx
 * <HeaderWithIcon
 *   icon="📬"
 *   title="Хүргэлтийн хаяг"
 *   actionButton={{
 *     label: "Шинэ хаяг нэмэх",
 *     onClick: () => console.log("Add new"),
 *     variant: "secondary",
 *     icon: "＋"
 *   }}
 * />
 * ```
 */
export default function HeaderWithIcon({
  icon,
  title,
  subtitle,
  actionButton,
  className = "",
}: HeaderWithIconProps) {
  return (
    <div className={`flex items-center justify-between mb-8 lg:mb-5 lg:p-3 lg:rounded-lg lg:bg-card  ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {typeof icon === "string" ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            icon
          )}
        </div>
        <div>
          <h1 className="text-lg xl:text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-xs xl:text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          variant={actionButton.variant || "secondary"}
          className="flex items-center gap-2 h-11 sm:h-12"
        >
          {actionButton.icon && (
            <span className="text-xl">{actionButton.icon}</span>
          )}
          <span className="hidden sm:block">{actionButton.label}</span>
        </Button>
      )}
    </div>
  );
}
