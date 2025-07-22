import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Paper, HeaderWithIcon } from "@/components/common";

export function ItemsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon icon="📦" title="Миний агуулах" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Paper key={i} variant="compact" className="animate-pulse">
            <Skeleton className="aspect-square rounded-md mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default ItemsLoadingSkeleton;
