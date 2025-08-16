"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 7,
  className,
  size = "md",
}: PaginationProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      button: "h-8 w-8 text-xs",
      spacing: "gap-1",
      text: "text-xs",
    },
    md: {
      button: "h-9 w-9 text-sm",
      spacing: "gap-2",
      text: "text-sm",
    },
    lg: {
      button: "h-10 w-10 text-base",
      spacing: "gap-3",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  // Calculate visible page numbers
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  // Calculate item range for info display
  const getItemRange = () => {
    if (!totalItems || !itemsPerPage) return null;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    return { start, end };
  };

  const itemRange = getItemRange();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Info Section */}
      {showInfo && itemRange && (
        <div className={cn("text-muted-foreground", config.text)}>
          <span>
            {itemRange.start}-{itemRange.end} / {totalItems?.toLocaleString()} үр дүн
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className={cn("flex items-center", config.spacing)}>
        {/* First Page Button */}
        {showFirstLast && (
          <Button
            variant="secondary"
            size="icon"
            className={config.button}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="Эхний хуудас"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Previous Page Button */}
        <Button
        variant="secondary"
          size="icon"
          className={config.button}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Өмнөх хуудас"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* First Page (if not in visible range) */}
        {showStartEllipsis && (
          <>
            <Button
              variant="secondary"
              className={config.button}
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            <div className="flex items-center justify-center w-8">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "secondary"}
            className={cn(
              config.button,
              page === currentPage && "bg-primary text-primary-foreground"
            )}
            onClick={() => handlePageChange(page)}
            aria-label={`Хуудас ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}

        {/* Last Page (if not in visible range) */}
        {showEndEllipsis && (
          <>
            <div className="flex items-center justify-center w-8">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
                variant="secondary"
              className={config.button}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Page Button */}
        <Button
          variant="secondary"
          size="icon"
          className={config.button}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Дараах хуудас"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page Button */}
        {showFirstLast && (
          <Button
             variant="secondary"
            size="icon"
            className={config.button}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Сүүлийн хуудас"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Mobile-friendly info (only show on small screens if main info is hidden) */}
      {!showInfo && itemRange && (
        <div className={cn("sm:hidden text-muted-foreground", config.text)}>
          {currentPage}/{totalPages}
        </div>
      )}
    </div>
  );
}
