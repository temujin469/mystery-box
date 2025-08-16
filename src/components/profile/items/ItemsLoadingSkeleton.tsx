import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Paper, HeaderWithIcon } from "@/components/common";
import { ShoppingCart } from "lucide-react";

export function ItemsLoadingSkeleton() {
  return (
    <div>
      <HeaderWithIcon 
        icon="📦" 
        title="Миний агуулах" 
        subtitle="Ачааллаж байна..."
        actionButton={{
          label: "Захиалга үүсгэх",
          onClick: () => {},
          icon: <ShoppingCart className="w-4 h-4" />,
          variant: "default"
        }}
      />

      {/* Items Grid - Match exact layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 12 }).map((_, i) => (
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

      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

export default ItemsLoadingSkeleton;
