import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Box } from "@/types";

const getPriceClasses = (price: number) => {
  if (price < 20000)
    return {
      tag: "bg-green-500",
      text: "text-green-500",
      border: "border-green-500",
      triangle: "border-r-green-500/40 group-hover:border-r-green-500",
      button: "bg-green-500/40 group-hover:bg-green-500 text-green-500 group-hover:text-white",
    };
  if (price < 40000)
    return {
      tag: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
      triangle: "border-r-blue-500/40 group-hover:border-r-blue-500",
      button: "bg-blue-500/40 group-hover:bg-blue-500 text-blue-500 group-hover:text-white",
    };
  if (price < 100000)
    return {
      tag: "bg-yellow-500",
      text: "text-yellow-500",
      border: "border-yellow-500",
      triangle: "border-r-yellow-500/40 group-hover:border-r-yellow-500",
      button: "bg-yellow-500/40 group-hover:bg-yellow-500 text-yellow-500 group-hover:text-white",
    };
  return {
    tag: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    triangle: "border-r-red-500/40 group-hover:border-r-red-500",
    button: "bg-red-500/40 group-hover:bg-red-500 text-red-500 group-hover:text-white",
  };
};

type Props = {
  box: Box;
};

export function BoxCard({ box }: Props) {
  const priceStyles = getPriceClasses(box.price);
  return (
    <Card
      key={box.name}
      className="box-card relative border-0 py-0 rounded-[5px] overflow-hidden bg-card shadow-lg transition-all duration-100 group"
    >
      {/* Price Label */}
      <div
        className={clsx(
          "absolute top-2 right-[-28] text-[11px] z-10 flex items-center justify-center w-28 h-8 rotate-45 border-1 bg-gradient-to-r text-white font-bold",
          priceStyles.text === "text-green-500" ? "from-green-500 to-emerald-600 border-green-500" :
          priceStyles.text === "text-blue-500" ? "from-blue-500 to-blue-600 border-blue-500" :
          priceStyles.text === "text-yellow-500" ? "from-yellow-500 to-orange-600 border-yellow-500" :
          "from-red-500 to-red-600 border-red-500"
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
          className={clsx("duration-200 group-hover:w-[75%] group-hover:h-[75%] blur-2xl rounded-full w-[60%] h-[60%] z-0 absolute top-[12%] right-[50%] translate-x-[50%]",priceStyles.tag)}
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
        className={clsx(`font-bold text-[12px] md:text-sm z-10 h-[50px] flex items-center pl-4 md:pl-6 bg-gradient-to-r bg-clip-text text-transparent`,
          priceStyles.text === "text-green-500" ? "from-green-400 to-emerald-600" :
          priceStyles.text === "text-blue-500" ? "from-blue-400 to-blue-600" :
          priceStyles.text === "text-yellow-500" ? "from-yellow-400 to-orange-500" :
          "from-red-400 to-red-600"
        )}
      >
        {box.price.toLocaleString()} ₮
      </div>

      {/* Bottom tag ribbon */}
    <div className="absolute bottom-0 right-0 flex w-full justify-end items-end">
        {/* Triangle */}
        <div
          className={clsx(
            "w-0 h-0 border-l-transparent border-t-transparent border-b-transparent border-[45px] border-b-0 border-r-[50px]",
            priceStyles.text === "text-green-500" ? "border-r-green-500" :
            priceStyles.text === "text-blue-500" ? "border-r-blue-500" :
            priceStyles.text === "text-yellow-500" ? "border-r-yellow-500" :
            "border-r-red-500"
          )}
        ></div>

        {/* "Нээх" Button Tag */}
        <div
          className={clsx(
            "border-background h-[45px] w-[30%] flex items-center justify-center pr-5 font-bold text-sm bg-gradient-to-r text-white",
            priceStyles.text === "text-green-500" ? "from-green-500 to-green-600" :
            priceStyles.text === "text-blue-500" ? "from-blue-500 to-blue-600" :
            priceStyles.text === "text-yellow-500" ? "from-yellow-500 to-yellow-600" :
            "from-red-500 to-red-600"
          )}
        >
          Нээх
        </div>
      </div>
    </Card>
  );
}

export default BoxCard;
