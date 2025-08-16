"use client";

import React from "react";
import { useMyOrderById } from "@/hooks/api/useOrder";
import { Slide } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { OrderStatus, ShippingMethod } from "@/types/order";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/currency";

interface OrderDetailSlideProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

export function OrderDetailSlide({
  isOpen,
  onClose,
  orderId,
}: OrderDetailSlideProps) {
  const { data: response, isLoading, error } = useMyOrderById(orderId || 0);
  const order = response?.data;

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: "Хүлээгдэж байна",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          dotColor: "bg-amber-400",
          icon: Clock,
        };
      case OrderStatus.CONFIRMED:
        return {
          label: "Баталгаажсан",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          dotColor: "bg-blue-400",
          icon: CheckCircle,
        };
      case OrderStatus.DELIVERED:
        return {
          label: "Хүргэгдсэн",
          color: "bg-green-50 text-green-700 border-green-200",
          dotColor: "bg-green-400",
          icon: Package,
        };
      case OrderStatus.CANCELLED:
        return {
          label: "Цуцлагдсан",
          color: "bg-red-50 text-red-700 border-red-200",
          dotColor: "bg-red-400",
          icon: XCircle,
        };
      default:
        return {
          label: "Тодорхойгүй",
          color: "bg-gray-50 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
          icon: Clock,
        };
    }
  };

  const getShippingMethodLabel = (method: ShippingMethod) => {
    return method === ShippingMethod.DELIVERY ? "Хүргэлт" : "Өөрөө авах";
  };

  const getShippingMethodIcon = (method: ShippingMethod) => {
    return method === ShippingMethod.DELIVERY ? (
      <Truck className="w-4 h-4" />
    ) : (
      <Package className="w-4 h-4" />
    );
  };

  const getOrderStatusSteps = (currentStatus: OrderStatus) => {
    const steps = [
      {
        status: OrderStatus.PENDING,
        label: "Хүлээгдэж байна",
        icon: Clock,
        description: "Захиалга хүлээн авсан",
      },
      {
        status: OrderStatus.CONFIRMED,
        label: "Баталгаажсан",
        icon: CheckCircle,
        description: "Захиалга баталгаажсан",
      },
      {
        status: OrderStatus.DELIVERED,
        label: "Хүргэгдсэн",
        icon: Package,
        description: "Захиалга хүргэгдсэн",
      },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.status === currentStatus
    );

    return steps.map((step, index) => ({
      ...step,
      isCompleted:
        index <= currentIndex && currentStatus !== OrderStatus.CANCELLED,
      isCurrent:
        index === currentIndex && currentStatus !== OrderStatus.CANCELLED,
      isActive: currentStatus !== OrderStatus.CANCELLED,
    }));
  };

  const renderStatusProgress = (status: OrderStatus) => {
    // Don't show progress for cancelled orders
    if (status === OrderStatus.CANCELLED) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">
              Захиалга цуцлагдсан
            </span>
          </div>
        </div>
      );
    }

    const steps = getOrderStatusSteps(status);

    return (
      <div className="py-4">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{
                width:
                  steps.filter((s) => s.isCompleted).length > 1
                    ? `${
                        ((steps.filter((s) => s.isCompleted).length - 1) /
                          (steps.length - 1)) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.status} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      step.isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : step.isCurrent
                        ? "bg-background border-primary text-primary animate-pulse"
                        : "bg-background border-muted text-muted-foreground"
                    }
                  `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center max-w-20">
                    <p
                      className={`text-xs font-medium ${
                        step.isCompleted || step.isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading || !order) {
      return <OrderDetailSkeleton />;
    }

    if (error) {
      return <OrderDetailError />;
    }

    const statusConfig = getStatusConfig(order.status);

    return (
      <div className="space-y-4">
        {/* Order detail Header */}
        <div className="space-y-4">
          {/* Main Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-primary">
                #{order.order_number}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}
              />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Order Progress */}
        <div className="border-t border-dashed border-muted pt-6">
          {renderStatusProgress(order.status)}
        </div>

        {/* Items */}
        <div className="space-y-1">
          {order.order_items?.map((item, index) => (
            <div
              key={`${item.order_id}-${item.item_id}-${index}`}
              className="flex justify-between items-start text-sm border-b border-dotted border-muted/50 pb-1"
            >
              <div className="flex-1">
                <p className="font-medium">{item.item_name}</p>
                {/* Show SKU if available from either relation or snapshot */}
                {(item.item?.sku || item.item_sku) && (
                  <p className="text-xs text-muted-foreground font-mono">
                    SKU: {item.item?.sku || item.item_sku}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unit_price)}
                </p>
              </div>
              <p className="font-medium ml-2">
                {formatCurrency(item.total_price)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1 border-t border-dashed border-muted pt-2">
          <div className="flex justify-between text-sm">
            <span>Барааны дүн:</span>
            <span>
              {formatCurrency(order.total_amount - order.shipping_fee)}
            </span>
          </div>

          {order.shipping_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Хүргэлт:</span>
              <span>{formatCurrency(order.shipping_fee)}</span>
            </div>
          )}

          {order.discount_amount && order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Хөнгөлөлт:</span>
              <span>-{formatCurrency(order.discount_amount)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t border-dashed border-muted pt-1">
            <span>НИЙТ ДҮН:</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="text-sm border-t border-dashed border-muted pt-3">
          <p className="font-medium mb-1">Захиалагч:</p>
          <p>{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">
            {order.customer_email}
          </p>
        </div>

        {/* Delivery Info */}
        <div className="text-sm border-t border-dashed border-muted pt-3">
          <div className="flex items-center gap-1 mb-1">
            {getShippingMethodIcon(order.shipping_method)}
            <span className="font-medium">
              {getShippingMethodLabel(order.shipping_method)}
            </span>
          </div>

          {order.shipping_method === ShippingMethod.DELIVERY &&
            order.shipping_address && (
              <div className="text-xs text-muted-foreground space-y-1">
                {order.shipping_address.recipient_name && (
                  <p className="font-medium text-foreground">
                    {order.shipping_address.recipient_name}
                  </p>
                )}
                {order.shipping_address.title && (
                  <p className="font-medium text-foreground">
                    {order.shipping_address.title}
                  </p>
                )}
                {order.shipping_address.city && (
                  <p>Хот: {order.shipping_address.city}</p>
                )}
                {order.shipping_address.district && (
                  <p>Дүүрэг: {order.shipping_address.district}</p>
                )}
                {order.shipping_address.khoroo && (
                  <p>Хороо: {order.shipping_address.khoroo}</p>
                )}
                {order.shipping_address.postal_code && (
                  <p>Шуудангийн код: {order.shipping_address.postal_code}</p>
                )}
                {order.shipping_address.full_address && (
                  <p className="pt-1 border-t border-dotted border-muted/50">
                    Гудамж: {order.shipping_address.full_address}
                  </p>
                )}
                {order.shipping_address.phone && (
                  <p>Утасны дугаар: {order.shipping_address.phone}</p>
                )}
                {order.shipping_address.notes && (
                  <p className="italic text-amber-600 pt-1">
                    💡 {order.notes}
                  </p>
                )}
              </div>
            )}
        </div>

        {/* Tracking */}
        {order.tracking_number && (
          <div className="text-sm border-t border-dashed border-muted pt-3">
            <p className="font-medium mb-1">Дагалдах дугаар:</p>
            <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {order.tracking_number}
            </p>
            {order.carrier && (
              <p className="text-xs text-muted-foreground mt-1">
                {order.carrier}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Slide
      isOpen={isOpen}
      onClose={onClose}
      title={"Захиалгын дэлгэрэнгүй"}
      maxWidth="lg"
    >
      {renderContent()}
    </Slide>
  );
}

// Loading Skeleton Component
function OrderDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-40 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>

      {/* Status */}
      <div className="text-center">
        <Skeleton className="h-8 w-20 mx-auto rounded-full" />
      </div>

      {/* Items */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

// Error Component
function OrderDetailError() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-red-500/30">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Захиалга ачаалахад алдаа гарлаа
      </h3>
      <p className="text-muted-foreground">
        Энэ захиалга олдсонгүй эсвэл танд үүнийг үзэх эрх байхгүй байна
      </p>
    </div>
  );
}
