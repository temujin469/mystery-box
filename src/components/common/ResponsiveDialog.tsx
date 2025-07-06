"use client";

import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Function to call when dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Content to display in the dialog body */
  children?: ReactNode;
  /** Primary action button text */
  confirmText?: string;
  /** Secondary action button text */
  cancelText?: string;
  /** Function to call when confirm button is clicked */
  onConfirm?: () => void;
  /** Function to call when cancel button is clicked */
  onCancel?: () => void;
  /** Whether the confirm action is loading */
  isLoading?: boolean;
  /** Variant for the confirm button */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Custom footer content (overrides default buttons) */
  footer?: ReactNode;
  /** Whether to show the dialog on mobile as drawer */
  useDrawerOnMobile?: boolean;
}

/**
 * Responsive dialog component that uses Dialog on desktop and Drawer on mobile.
 * 
 * Features:
 * - Automatically detects screen size and uses appropriate component
 * - Consistent API for both Dialog and Drawer
 * - Customizable buttons and actions
 * - Loading states support
 * - Flexible content and footer
 * 
 * @example
 * ```tsx
 * <ResponsiveDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Confirm Delete"
 *   description="Are you sure you want to delete this item?"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   confirmVariant="destructive"
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsOpen(false)}
 *   isLoading={isDeleting}
 * />
 * ```
 */
export default function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmText = "Тийм",
  cancelText = "Цуцлах",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmVariant = "default",
  footer,
  useDrawerOnMobile = true,
}: ResponsiveDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const defaultFooter = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? "Уншиж байна..." : confirmText}
      </Button>
    </div>
  );

  if (useDrawerOnMobile && isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          {children && (
            <div className="px-4 pb-4">
              {children}
            </div>
          )}
          <DrawerFooter className="pt-2">
            {footer || defaultFooter}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}
        <DialogFooter>
          {footer || defaultFooter}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
