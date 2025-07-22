"use client";

import React, { useState } from "react";
import { useMyBoxOpenHistory } from "@/hooks/api";
import HeaderWithIcon from "@/components/common/HeaderWithIcon";
import { Paper } from "@/components/common/Paper";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { getRarityColors, getRarityName } from "@/lib/rarity-colors";
import { formatCurrency } from "@/lib/currency";
import clsx from "clsx";

// Simple date formatter that works consistently on server and client
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const BoxHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const { data, isPending, error } = useMyBoxOpenHistory({
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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Paper key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
              </div>
            </Paper>
          ))}
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

  const hasHistory = data?.data && data.data.length > 0;

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

  const totalPages = Math.ceil((data?.meta?.total || 0) / pageLimit);

  return (
    <div className="space-y-6">
      <HeaderWithIcon
        icon="📦"
        title="Хайрцгийн түүх"
        subtitle={`Нийт ${data?.meta?.total || 0} хайрцаг нээсэн байна`}
      />

      <div className="space-y-3">
        {data?.data?.map((history) => {
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
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Өмнөх
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Дараах
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Summary */}
      <Paper className="text-center">
        <div className="text-sm text-muted-foreground">
          Хуудас {currentPage} / {totalPages} • Нийт {data?.meta?.total || 0}{" "}
        
        </div>
      </Paper>
    </div>
  );
};

export default BoxHistoryPage;
