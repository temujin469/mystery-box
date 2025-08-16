import Link from "next/link";
import { BoxCard } from "@/components/card";
import { Box } from "@/types";
import { useBoxes } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

type BoxesGridProps = {
  categoryId?: number;
  isFeatured?: boolean;
};

export function BoxesGrid({ categoryId, isFeatured }: BoxesGridProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useBoxes({
    isFeatured: isFeatured ? "true" : undefined,
    categoryId,
    page: 1,
    limit: 50, // Fetch more boxes to ensure we have enough for filtering
  });

  const boxes = response?.boxes || [];
  const pagination = response?.pagination;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="relative border-0 py-0 rounded-[5px] overflow-hidden bg-card animate-pulse"
          >
            {/* Main content area */}
            <div className="relative px-4 md:px-6 pt-4 pb-12">
              {/* Box image skeleton */}
              <div className="mb-2 aspect-square w-full relative">
                <div className="w-full h-full rounded-lg bg-muted animate-pulse" />
              </div>

              {/* Title skeleton */}
              <div className="h-6 w-3/4 mb-4 rounded bg-muted animate-pulse" />

              {/* Price text skeleton */}
              <div className="h-5 w-20 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Хайрцгууд ачаалахад алдаа гарлаа. Дахин оролдоно уу.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-500 mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  if (!boxes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {categoryId ? "Энэ ангилалд хайрцаг олдсонгүй" : "Хайрцаг олдсонгүй"}
        </p>
        {response?.success === false && response?.message && (
          <p className="text-xs text-muted-foreground mt-2">
            {response.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {boxes.map((box: Box) => (
          <Link href={`/boxes/${box.id}`} key={box.id}>
            <BoxCard box={box} />
          </Link>
        ))}
      </div>

      {/* Show pagination info or success message in development mode */}
      {pagination && process.env.NODE_ENV === "development" && (
        <div className="text-xs text-muted-foreground mb-4">
          Showing {boxes.length} of {pagination.total} boxes
          {pagination.totalPages > 1 &&
            ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </div>
      )}
    </div>
  );
}
