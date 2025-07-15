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
  const { data, isLoading, error } = useBoxes({
    isFeatured,
    categoryId,
    page: 1,
    limit: 50, // Fetch more boxes to ensure we have enough for filtering
  });

  const boxes = data?.data || [];

  // const filteredBoxes = useMemo(() => {
  //   if (!data?.data) return [];

  //   // If category is "all", return all boxes
  //   if (category === "all") {
  //     return data.data;
  //   }

  //   });
  // }, [data?.data]);

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
      </div>
    );
  }

  if (!boxes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {categoryId === null
            ? "Хайрцаг олдсонгүй"
            : "Энэ ангилалд хайрцаг олдсонгүй"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {boxes.map((box) => (
        <Link href={`/boxes/${box.id}`} key={box.id}>
          <BoxCard box={box} />
        </Link>
      ))}
    </div>
  );
}
