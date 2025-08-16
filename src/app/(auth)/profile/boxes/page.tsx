"use client";

import React, { useState } from "react";
import { useMyBoxOpenHistory } from "@/hooks/api";
import { HeaderWithIcon, Pagination } from "@/components/common";
import { Paper } from "@/components/common/Paper";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { getRarityColors, getRarityName } from "@/lib/rarity-colors";
import { formatCurrency } from "@/lib/currency";
import clsx from "clsx";
import { formatDate } from "@/lib/date";

const BoxHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 5;

  const {
    data: response,
    isPending,
    error,
  } = useMyBoxOpenHistory({
    page: currentPage,
    limit: pageLimit,
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <HeaderWithIcon
          icon="📦"
          title="Хайрцгийн түүх"
          subtitle="Таны нээсэн бүх хайрцгийн түүх"
        />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Paper key={i} variant="compact" className="md:variant-default animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Box Section Skeleton */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Box Image Skeleton */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted"></div>

                  {/* Box Details Skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 md:h-5 bg-muted rounded w-2/3"></div>
                    <div className="h-3 md:h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>

                {/* Arrow Divider Skeleton - Hidden on mobile */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-5 h-5 bg-muted rounded"></div>
                </div>

                {/* Mobile Divider */}
                <div className="md:hidden h-px bg-muted"></div>

                {/* Item Section Skeleton */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Item Image Skeleton */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted">
                    {/* Rarity indicator skeleton */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-muted-foreground"></div>
                  </div>

                  {/* Item Details Skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 bg-muted rounded w-16"></div>
                    <div className="h-4 md:h-5 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            </Paper>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="mt-8">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-muted rounded"></div>
              <div className="h-9 w-9 bg-muted rounded"></div>
              <div className="h-9 w-9 bg-muted rounded"></div>
              <div className="h-9 w-9 bg-muted rounded"></div>
              <div className="h-9 w-9 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <HeaderWithIcon
          icon="📦"
          title="Хайрцгийн түүх"
          subtitle="Таны нээсэн бүх хайрцгийн түүх"
        />
        <Paper className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Алдаа гарлаа
          </h3>
          <p className="text-muted-foreground mb-4">
            Хайрцгийн түүхийг ачаалахад алдаа гарлаа
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Дахин оролдох
          </Button>
        </Paper>
      </div>
    );
  }

  const hasHistory = response?.history && response.history.length > 0;

  if (!hasHistory) {
    return (
      <div className="space-y-6">
        <HeaderWithIcon
          icon="📦"
          title="Хайрцгийн түүх"
          subtitle="Таны нээсэн бүх хайрцгийн түүх"
        />
        <Paper className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Хайрцгийн түүх хоосон байна
          </h3>
          <p className="text-muted-foreground mb-4">
            Та хараахан ямар ч хайрцаг нээж байгаагүй байна
          </p>
          <Button
            onClick={() => (window.location.href = "/boxes")}
            variant="outline"
          >
            Хайрцаг нээх
          </Button>
        </Paper>
      </div>
    );
  }

  const totalPages = response.pagination?.totalPages || 10;
  

  return (
    <div className="space-y-6">
      <HeaderWithIcon
        icon="📦"
        title="Хайрцгийн түүх"
        subtitle={`Нийт ${response?.history?.length || 0} хайрцаг нээсэн байна`}
      />

      <div className="space-y-3">
        {response?.history?.map((history) => {
          const rarityColors = getRarityColors(history.item?.rarity || 5); // Default to common (5)

          return (
            <Paper
              key={history.id}
              variant="compact"
              className="md:variant-default"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Box Section */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Box Image */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted/20 p-2 flex items-center justify-center">
                    <Image
                      src={history.box?.image_url || "/box.png"}
                      alt={history.box?.name || "Хайрцаг"}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>

                  {/* Box Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-base md:text-lg truncate">
                      {history.box?.name || "Тодорхойгүй хайрцаг"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {formatDate(history.opened_at)}
                      </span>
                    </div>
                    <div className="inline-block px-2 py-0.5 mt-1 rounded bg-muted text-muted-foreground text-xs">
                      {formatCurrency(history.box?.price || 0)}
                    </div>
                  </div>
                </div>

                {/* Arrow Divider - Hidden on mobile */}
                <div className="hidden md:flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Mobile Divider */}
                <div className="md:hidden h-px bg-border"></div>

                {/* Item Section */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted/20 p-2 flex items-center justify-center">
                    <Image
                      src={history.item?.image_url || "/item.webp"}
                      alt={history.item?.name || "Эд зүйл"}
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                    {/* Rarity indicator */}
                    <div
                      className={clsx(
                        "absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center",
                        rarityColors.bg
                      )}
                    >
                      <Sparkles className="w-2 h-2 md:w-3 md:h-3 text-white" />
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span
                        className={clsx(
                          "text-xs font-medium",
                          rarityColors.text
                        )}
                      >
                        {getRarityName(history.item?.rarity || 5)}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground text-base md:text-lg truncate">
                      {history.item?.name || "Тодорхойгүй эд зүйл"}
                    </h4>
                    <div className="inline-block px-2 py-0.5 mt-1 rounded bg-green-50 text-green-700 text-xs">
                      {formatCurrency(history.item?.price || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={response.pagination?.total || 0}
            itemsPerPage={pageLimit}
            onPageChange={setCurrentPage}
            showInfo={true}
            showFirstLast={true}
            size="md"
          />
        </div>
      )}
    </div>
  );
};

export default BoxHistoryPage;
