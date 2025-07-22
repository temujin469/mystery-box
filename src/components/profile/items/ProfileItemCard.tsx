import React from "react";
import { Paper } from "@/components/common";
import { Item } from "@/types/item";
import { getRarityColors } from "@/lib/rarity-colors";
import { formatCurrency } from "@/lib/currency";

interface ProfileItemCardProps {
  item: Item;
  quantity: number;
  onClick?: () => void;
}

export default function ProfileItemCard({
  item,
  quantity,
  onClick,
}: ProfileItemCardProps) {
  // Get rarity colors based on item rarity (fallback to price-based if rarity not available)
  const rarityColors = getRarityColors(item.rarity);

  return (
    <Paper
      variant="compact"
      className={`relative overflow-hidden group `}
      onClick={onClick}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-cover bg-center" />

      {/* Quantity badge */}
      {quantity > 1 && (
        <div
          className={`absolute top-2 right-2 z-20 text-xs font-bold px-2 py-1 rounded-full shadow-lg ${rarityColors.bg} text-foreground`}
        >
          ×{quantity}
        </div>
      )}

      <div className="relative z-10 p-3">
        {/* Item Image */}
        <div className="aspect-square relative mb-3 bg-transparent rounded-md">
          <img
            src={item.image_url || "/item.webp"}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Item Name */}
        <h3 className="font-semibold text-sm text-center truncate mb-2 text-card-foreground">
          {item.name}
        </h3>

        {/* Price and Values */}
        <div className="text-center space-y-2">
          {/* Item Price */}
          <div
            className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold ${rarityColors.text}`}
          >
            {formatCurrency(item.price)}
          </div>

          {/* Total value for quantity > 1 */}
          {quantity > 1 && (
            <div className="text-[10px] whitespace-nowrap text-muted-foreground">
              <span className="text-accent font-medium">
                Нийт: {formatCurrency(item.price * quantity)}
              </span>
            </div>
          )}

          {/* Sell value if available */}
          {/* {item.sell_value && (
            <div className="text-xs text-green-500 flex items-center justify-center gap-1">
              <span>📈</span>
              <span>{item.sell_value.toLocaleString()}</span>
            </div>
          )} */}
        </div>
      </div>
    </Paper>
  );
}

