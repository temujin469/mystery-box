"use client";
import Link from "next/link";
import boxDetail from "@/data/boxDetail.json";
import { useState } from "react";
import SpinningReel from "@/components/SpiningReel";
import { ItemCard } from "@/components/card";
import { Switch } from "@/components/ui/switch";

type BoxesGridProps = {
  boxes: Box[];
};

export default function BoxPage() {
  const [items, setItems] = useState(boxDetail.items);
  const [isOddsHidden,setIsOddsHidden] = useState(true);
  const [wonItem, setWonItem] = useState();

  const onWon = (item: any) => {
    console.log(item);
  };
  return (
    <div className="mb-15">
      <div>
        <SpinningReel items={boxDetail.items} onWin={onWon} />
      </div>
      <div className="container max-w-7xl mx-auto px-3">
        <div>
          <BoxSeparator />
        </div>
        <div className="flex items-center gap-2 mb-5">
          <p>Магадлал</p>
          <Switch/>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => (
            <ItemCard item={item} isDropRateHidden={isOddsHidden} />
          ))}
        </div>
      </div>
    </div>
  );
}


function BoxSeparator({ label = "бүтээгдэхүүнүүд" }: { label?: string }) {
  return (
    <div className="w-full flex items-center py-2 px-0">
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-primary to-primary/50" />

      {/* Sharp ribbon with outward arrows, height = 25px */}
      <div className="flex items-center mx-2 relative select-none z-10" style={{ height: 25 }}>
        {/* Left outward sharp triangle arrow */}
        <svg width="24" height="25" viewBox="0 0 24 25" className="-mr-1" style={{ display: 'block' }}>
          <polygon
            points="0,12.5 24,0 17,12.5 24,25"
            fill="#4DB5DB"
          />
        </svg>

        {/* Center Ribbon (narrow hexagon) */}
        <svg
          width="160"
          height="25"
          viewBox="0 0 160 25"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            margin: "auto",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <polygon
            points="12,0 148,0 160,12.5 148,25 12,25 0,12.5"
            fill="#4DB5DB"
            stroke="#4DB5DB"
            strokeWidth="2"
          />
        </svg>

        {/* Label on top of ribbon */}
        <div
          className="px-4 py-0 font-bold text-white text-[13px] uppercase tracking-wide relative"
          style={{
            minWidth: 90,
            textAlign: "center",
            zIndex: 1,
            letterSpacing: "0.02em",
            background: "transparent",
            height: 25,
            lineHeight: "23px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span className="text-foreground">
            {label}
          </span>
        </div>

        {/* Right outward sharp triangle arrow */}
        <svg width="24" height="25" viewBox="0 0 24 25" className="-ml-1" style={{ display: 'block' }}>
          <polygon
            points="24,12.5 0,0 7,12.5 0,25"
            fill="#4DB5DB"
          />
        </svg>
      </div>

      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-primary to-primary/50" />
    </div>
  );
}
