import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { BoxItem, Item } from "@/types";
import { cn } from "@/lib/utils";

type ItemCardProps = {
  boxItem: BoxItem;
  isDropRateHidden: boolean;
  onClick?: (itemId: number) => void;
};

export function ItemCard({ boxItem, isDropRateHidden = true, onClick }: ItemCardProps) {
  const item: Item = boxItem.item as Item;
  
  function getDropRateColor(rate: number): string {
    if (rate < 0.01) {
      return `bg-red-400`; //extreme
    } else if (rate < 0.04) {
      return `bg-yellow-400`;
    } else if (rate < 0.09) {
      return `bg-blue-400`;
    } else {
      return `bg-green-400`;
    }
  }

  function getDropRateColorBorder(rate: number): string {
    if (rate < 0.01) {
      return `border-red-400`; //extreme
    } else if (rate < 0.04) {
      return `border-yellow-400`;
    } else if (rate < 0.09) {
      return `border-blue-400`;
    } else {
      return `border-green-400`;
    }
  }

  function getDropRateColorTxt(rate: number): string {
    if (rate < 0.01) {
      return `text-red-400`; //extreme
    } else if (rate < 0.04) {
      return `text-yellow-400`;
    } else if (rate < 0.09) {
      return `text-blue-400`;
    } else {
      return `text-green-400`;
    }
  }

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
        getDropRateColorBorder(boxItem.drop_rate)
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
          getDropRateColor(boxItem.drop_rate)
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
            getDropRateColorTxt(boxItem.drop_rate)
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
