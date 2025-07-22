import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { BoxItem, Item } from "@/types";
import { cn } from "@/lib/utils";
import { getRarityColors } from "@/lib/rarity-colors";

type ItemCardProps = {
  boxItem: BoxItem;
  isDropRateHidden: boolean;
  onClick?: (itemId: number) => void;
};

export function ItemCard({ boxItem, isDropRateHidden = true, onClick }: ItemCardProps) {
  const item: Item = boxItem.item as Item;

  // Get colors based on item rarity
  const rarityColors = getRarityColors(item.rarity);

  // Function to format drop rate range
  function formatDropRateRange(rate: number) {
    const numRate = Number(rate) || 0;
    const percentage = numRate * 100;
    const lowerBound = (100 - percentage);
    const upperBound = 100;
    return `${lowerBound.toFixed(2)} ~ ${upperBound.toFixed(2)}`;
  }

  // Function to format odds percentage
  function formatOdds(rate: number) {
    const numRate = Number(rate) || 0;
    const percentage = numRate * 100;
    return `${percentage.toFixed(2)}%`;
  }

  return (
    <Card
      key={item.name}
      className={cn(
        "border-0 border-t-2 rounded-none relative overflow-hidden bg-transparent shadow-lg group cursor-pointer",
        rarityColors.border
      )}
      onClick={() => onClick?.(item.id)}
    >
      <Image
        src="/img/dots.png"
        alt={item.name}
        fill
        style={{ objectFit: "cover" }}
        className="w-full h-full bg-top"
      />
      <div
        className={cn(
          "w-full h-20 blur-3xl z-0 absolute top-0 right-[50%] translate-x-[50%]",
          rarityColors.bg
        )}
      ></div>
      <CardHeader className="flex flex-col items-center">
        <div className="mb-2 aspect-square w-full h-full relative">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            style={{ objectFit: "contain" }}
            className="z-10 w-full h-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          />
        </div>
        <CardTitle className="text-center h-full w-full text-ellipsis text-card-foreground text-[11px] sm:text-[14px] font-semibold whitespace-nowrap overflow-hidden">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div
          className={cn(
            "rounded px-3 py-[2px] text-center",
            rarityColors.text
          )}
        >
          {isDropRateHidden ? (
            <div className="font-bold text-[11px] sm:text-[14px] whitespace-nowrap">{item.price} ₮</div>
          ) : (
            <div className="space-y-1 text-[7px] sm:text-[8px] whitespace-nowrap">
              <div>% ХҮРЭЭ: {formatDropRateRange(boxItem.drop_rate)}</div>
              <div>МАГАДЛАЛ: {formatOdds(boxItem.drop_rate)}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ItemCard;
