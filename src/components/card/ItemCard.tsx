import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

type ItemCardProps = {
  item: Item;
  isDropRateHidden: boolean;
};

export function ItemCard({ item, isDropRateHidden=true }: ItemCardProps) {
  function getDropRateColor(rate: number): string {
    if (rate < 0.01) {
      return `bg-red-500`; //extreme
    } else if (rate < 0.04) {
      return `bg-yellow-500`;
    } else if (rate < 0.09) {
      return `bg-blue-500`;
    } else {
      return `bg-green-500`;
    }
  }

  function getDropRateColorBorder(rate: number): string {
    if (rate < 0.01) {
      return `border-red-500`; //extreme
    } else if (rate < 0.04) {
      return `border-yellow-500`;
    } else if (rate < 0.09) {
      return `border-blue-500`;
    } else {
      return `border-green-500`;
    }
  }

  function getDropRateColorBg(rate: number): string {
    if (rate < 0.01) {
      return `bg-red-500/10 text-red-500`; //extreme
    } else if (rate < 0.04) {
      return `bg-yellow-500/10 text-yellow-500`;
    } else if (rate < 0.09) {
      return `bg-blue-500/10 text-blue-500`;
    } else {
      return `bg-green-500/10 text-green-500`;
    }
  }

  return (
    <Card
      key={item.name}
      className={`border-0 border-t-4 rounded-none relative overflow-hidden bg-card shadow-lg transition-all duration-100 group ${getDropRateColorBorder(
        item.drop_rate
      )}`}
    >
      <Image
        src="/img/dots.png"
        alt={item.name}
        fill
        style={{ objectFit: "cover" }}
        className="w-full h-full bg-top"
      />
      <div
        className={`w-full h-20 blur-3xl z-10 absolute top-0 right-[50%] translate-x-[50%] ${getDropRateColor(
          item.drop_rate
        )}`}
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
        <CardTitle className="text-center h-full w-full text-ellipsis text-card-foreground font-semibold whitespace-nowrap overflow-hidden">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div
          className={`font-bold rounded px-3 py-[2px] ${getDropRateColorBg(
            item.drop_rate
          )}`}
        >
          {isDropRateHidden ? <>{item.price} ₮</> : <>{item.drop_rate} %</>}
        </div>
      </CardContent>
    </Card>
  );
}

export default ItemCard;
