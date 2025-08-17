"use client";

import React, { useState } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { Item } from "@/types";
import { useItem } from "@/hooks/api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { getRarityColors } from "@/lib/rarity-colors";
import Link from "next/link";
import { Slide } from "@/components/common";

interface ItemDetailSlideProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
}

export function ItemDetailSlide({
  isOpen,
  onClose,
  itemId,
}: ItemDetailSlideProps) {
  const {
    data: ItemResponse,
    isPending,
    error,
  } = useItem(itemId || 0, !!itemId);
  const item = ItemResponse?.item;

  return (
    <Slide
      isOpen={isOpen}
      onClose={onClose}
      title="Бүтээгдэхүүний дэлгэрэнгүй"
      maxWidth="md"
      contentClassName="p-0"
    >
      {isPending && <ItemDetailSkeleton />}

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-red-500/30">
            <Package className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-400 mb-4 text-lg">
            Мэдээлэл ачаалахад алдаа гарлаа
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-sm transition-all duration-200 border border-gray-600/50"
          >
            Хаах
          </button>
        </div>
      )}

      {item && (
        <div className="pb-6">
          <ItemDetail item={item} />
        </div>
      )}
    </Slide>
  );
}

function ItemDetail({ item }: { item: Item }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


  // Get colors based on item rarity
  const rarityColors = getRarityColors(item.rarity);

  // Rarity-based glow effect
  const getRarityGlow = (rarity: number): string => {
    switch (rarity) {
      case 1: // Legendary - Purple
        return "shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(147,51,234,0.3),0_0_90px_rgba(126,34,206,0.2)]";
      case 2: // Epic - Pink
        return "shadow-[0_0_30px_rgba(236,72,153,0.4),0_0_60px_rgba(219,39,119,0.3),0_0_90px_rgba(190,24,93,0.2)]";
      case 3: // Uncommon - Cyan
        return "shadow-[0_0_30px_rgba(34,211,238,0.4),0_0_60px_rgba(6,182,212,0.3),0_0_90px_rgba(8,145,178,0.2)]";
      case 4: // Common - Emerald
        return "shadow-[0_0_30px_rgba(52,211,153,0.4),0_0_60px_rgba(16,185,129,0.3),0_0_90px_rgba(5,150,105,0.2)]";
      case 5: // Trash - Slate
      default:
        return "shadow-[0_0_30px_rgba(148,163,184,0.4),0_0_60px_rgba(100,116,139,0.3),0_0_90px_rgba(71,85,105,0.2)]";
    }
  };

  const rarityGlow = getRarityGlow(item.rarity);

  // Modern gradient glow effect
  const modernGlow = rarityGlow;

  return (
    <div className="space-y-8">
      {/* Item Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-cover bg-[url('/img/dotPattern.png')]">
        <div className="relative flex justify-center items-center h-full">
          {/* Top-left angled glow - positioned outside frame */}
          <div
            className={`w-[120px] h-[500px] absolute bg-gradient-to-r ${rarityColors.gradient} blur-3xl ${modernGlow} opacity-50 -top-30 -left-30 rotate-45`}
          />

          {/* Bottom-right angled glow - positioned outside frame */}
          <div
            className={`w-[120px] h-[500px] absolute bg-gradient-to-r ${rarityColors.gradient} blur-3xl ${modernGlow} opacity-50 -bottom-30 -right-30 rotate-45`}
          />

          <Image
            src={item.image_url}
            alt={item.name}
            width={130}
            height={130}
            className="object-contain z-10"
          />
        </div>
      </div>

      {/* Item Info */}
      <div className="space-y-6 px-4 sm:px-6">
        <div className="">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            {item.name}
          </h3>
          <h3 className="text-2xl font-bold mb-5 text-primary">
            {item.price.toLocaleString()} ₮
          </h3>
          {item.description && (
            <div className="max-w-sm mx-auto">
              <p
                className={`text-muted-foreground text-sm leading-relaxed ${
                  !isDescriptionExpanded ? "line-clamp-3" : ""
                }`}
              >
                {item.description}
              </p>
              {item.description.length > 150 && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 mx-auto"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Хураах
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Дэлгэрэнгүй
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Related Boxes */}
        {item.boxes && item.boxes.length > 0 && (
          <div className="pt-6 border-t border-gray-700/30 ">
            <h4 className="text-[16px] text-muted-foreground font-semibold mb-4">
              Агуулсан хайрцгууд
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {item.boxes.map((boxItem: any, index: number) => (
                <Link href={`/boxes/${boxItem.box_id}`} key={boxItem.box_id || index}>
                  <div
                    className="bg-card/80 rounded-lg p-3  hover:bg-card cursor-pointer group"
                  >
                    <div className="aspect-square w-full mb-2 relative">
                      <div className="relative w-full h-fullflex items-center justify-center">
                        {boxItem.box?.image_url ? (
                          <Image
                            src={boxItem.box.image_url}
                            alt={boxItem.box.name || "Box"}
                            width={60}
                            height={60}
                            className="object-contain w-full h-full p-2"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                        {boxItem.box?.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {item.boxes.length > 6 && (
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  +{item.boxes.length - 6} дахин хайрцаг
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Image Skeleton - matching actual layout */}
      <div className="relative aspect-[3/2] w-full">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6 px-4 sm:px-6">
        {/* Title and Price */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <div className="max-w-sm mx-auto space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Related Boxes Skeleton */}
        <div className="pt-6 border-t border-gray-700/30">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
