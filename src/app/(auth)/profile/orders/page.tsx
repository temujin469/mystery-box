"use client";

import React, { useState } from "react";
import { useMyOrders } from "@/hooks/api/useOrder";
import { HeaderWithIcon, Pagination } from "@/components/common";
import { OrderCard, OrderDetailSlide } from "@/components/features/order";
import { Order } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  XCircle
} from "lucide-react";

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailSlideOpen, setIsDetailSlideOpen] = useState(false);
  
  const { data: ordersResponse, isLoading, error } = useMyOrders({ 
    page: currentPage,
    limit:5
  });
  
  const orders = ordersResponse?.data || [];
  const pagination = ordersResponse?.pagination;

  const handleViewDetail = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailSlideOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailSlideOpen(false);
    setSelectedOrderId(null);
  };

  if (isLoading) {
    return <OrdersLoadingSkeleton />;
  }

  if (error) {
    return <OrdersError />;
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-6">
      <HeaderWithIcon
        icon="🚚"
        title="Миний захиалга"
        subtitle={`${pagination?.total || orders.length} захиалга`}
      />

      {/* All Orders */}
      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      {/* Order Detail Slide */}
      <OrderDetailSlide
        isOpen={isDetailSlideOpen}
        onClose={handleCloseDetail}
        orderId={selectedOrderId}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={setCurrentPage}
            showInfo={true}
            showFirstLast={true}
            size="lg"
          />
        </div>
      )}
    </div>
  );
};

// Loading Component
function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderWithIcon
        icon="🛒"
        title="Миний захиалга"
        subtitle="Ачааллаж байна..."
      />
      
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-0 py-4 shadow-sm animate-pulse">
            <CardContent className="p-4 sm:p-5">
              {/* Header - Order Number & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 sm:h-5 w-32 mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>

              {/* Quick Info Row */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Footer - Price and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-muted/50">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-24 mr-4" />
                  <Skeleton className="h-9 w-28 rounded" />
                </div>
                <Skeleton className="h-5 sm:h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
function OrdersError() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-red-500/30">
        <XCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Захиалга ачаалахад алдаа гарлаа
      </h3>
      <p className="text-muted-foreground mb-4">
        Дахин оролдож үзнэ үү
      </p>
    </div>
  );
}

// Empty State Component
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
        <Package className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Захиалга байхгүй байна
      </h3>
      <p className="text-muted-foreground mb-6">
        Та одоогоор ямар нэгэн захиалга хийгээгүй байна
      </p>
    </div>
  );
}

export default OrdersPage;
