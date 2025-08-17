"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Order, OrderStatus, ShippingMethod } from "@/types/order";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  onViewDetail?: (orderId: number) => void;
}

export function OrderCard({ order, onClick, onViewDetail }: OrderCardProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: "Хүлээгдэж байна",
          color: "bg-amber-500/10 text-amber-700 border-amber-700",
          dotColor: "bg-amber-400",
          icon: Clock,
        };
      case OrderStatus.CONFIRMED:
        return {
          label: "Баталгаажсан",
          color: "bg-blue-500/10 text-blue-700 border-blue-700",
          dotColor: "bg-blue-400",
          icon: CheckCircle,
        };
      case OrderStatus.DELIVERED:
        return {
          label: "Хүргэгдсэн",
          color: "bg-green-500/10 text-green-700 border-green-700",
          dotColor: "bg-green-400",
          icon: Package,
        };
      case OrderStatus.CANCELLED:
        return {
          label: "Цуцлагдсан",
          color: "bg-red-500/10 text-red-700 border-red-700",
          dotColor: "bg-red-400",
          icon: XCircle,
        };
      default:
        return {
          label: "Тодорхойгүй",
          color: "bg-gray-500/10 text-gray-700 border-gray-700",
          dotColor: "bg-gray-400",
          icon: Clock,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const getShippingMethodIcon = (method: ShippingMethod) => {
    return method === ShippingMethod.DELIVERY ? (
      <Truck className="w-4 h-4" />
    ) : (
      <Package className="w-4 h-4" />
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  return (
    <Card
      className={`border-0 py-1 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-5">
        {/* Header - Order Number & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-lg truncate mb-3">
              #{order.order_number}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {formatDate(order.created_at, "MMM D, HH:mm")}
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
          >
            <div className={`w-2 h-2 hidden rounded-full ${statusConfig.dotColor}`} />
            <span className="text-[9px] sm:text-base">
              {statusConfig.label}
            </span>
            <StatusIcon className="w-3 h-3 sm:hidden" />
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {getShippingMethodIcon(order.shipping_method)}
            <span>
              {order.shipping_method === ShippingMethod.DELIVERY
                ? "Хүргэлт"
                : "Өөрөө авах"}
            </span>
          </div>

          {/* {order.tracking_number && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {order.tracking_number}
              </span>
            </div>
          )} */}
        </div>

        {/* Footer - Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-muted/50">
          <div className="flex items-center">
            {order.shipping_fee > 0 && (
              <div className="text-sm text-muted-foreground pr-4">
                <span>+{formatCurrency(order.shipping_fee)} хүргэлт</span>
              </div>
            )}

            {onViewDetail && (
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(order.id);
                }}
              >
                <span>Дэлгэрэнгүй</span>
                <ArrowRight />
              </Button>
            )}
          </div>

          <div className="text-right">
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
