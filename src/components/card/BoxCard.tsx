import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import clsx from "clsx";
import { Box } from "@/types";
import { getRarityColors } from "@/lib/rarity-colors";

type Props = {
  box: Box;
};

export function BoxCard({ box }: Props) {
  const rarityColors = getRarityColors(box.rarity);
  return (
    <Card
      key={box.name}
      className="box-card relative border-0 py-0 rounded-[5px] overflow-hidden bg-card shadow-lg transition-all duration-100 group"
    >
      {/* Price Label */}
      <div
        className={clsx(
          "absolute top-2 right-[-28] text-[11px] z-10 flex items-center justify-center w-28 h-8 rotate-45 border-1 bg-gradient-to-r text-white font-bold",
          `${rarityColors.gradient} ${rarityColors.border}`
        )}
      >
        Шинэ
      </div>
      {/* Background pattern */}
      <Image
        src="/img/dotPattern.png"
        alt={box.name}
        fill
        style={{ objectFit: "cover" }}
        className="w-full h-full bg-top"
      />
      {/* Glow circle */}
      <div className="relative">
        <div
          className={clsx("duration-200 group-hover:w-[75%] group-hover:h-[75%] blur-2xl rounded-full w-[60%] h-[60%] z-0 absolute top-[12%] right-[50%] translate-x-[50%]", rarityColors.bg)}
        ></div>
     {/* Box image & title */}
        <CardHeader className="flex flex-col overflow-hidden px-4 md:px-6 z-10 relative">
          <div className="mb-2 aspect-square w-full h-full relative overflow-hidden z-20">
            <Image
              src={box.image_url}
              alt={box.name}
              fill
              style={{ objectFit: "contain" }}
              className="w-full z-30 h-full transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
            />
          </div>
          <CardTitle className="text-start text-xl text-card-foreground font-semibold whitespace-nowrap text-ellipsis overflow-hidden w-full z-20 relative">
            {box.name}
          </CardTitle>
        </CardHeader>
      </div>
      {/* Price text */}
      <div
        className={clsx(`font-bold text-[12px] md:text-sm z-10 h-[50px] flex items-center pl-4 md:pl-6 bg-gradient-to-r bg-clip-text text-transparent ${rarityColors.gradient}`)}
      >
        {box.price.toLocaleString()} ₮
      </div>

      {/* Bottom tag ribbon */}
    <div className="absolute bottom-0 right-0 flex w-full justify-end items-end">
        {/* Triangle */}
        {/* <div
          className={clsx(
            "w-0 h-0 border-l-transparent border-t-transparent border-b-transparent border-[45px] border-b-0 border-r-[50px]",
            rarityColors.border.replace('border-', 'border-r-')
          )}
        ></div> */}

        {/* "Нээх" Button Tag */}
        <div
          className={clsx(
            "h-[45px] w-[45%] flex items-center justify-center font-bold text-[12px] sm:text-sm bg-gradient-to-r text-white rounded-tl-2xl",
            rarityColors.gradient
          )}
        >
          Нээх
        </div>
      </div>
    </Card>
  );
}

export default BoxCard;
