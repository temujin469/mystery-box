"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserInventory } from "@/hooks/api/useInventory";
import { Item } from "@/types/item";
import Link from "next/link";
import React from "react";
import { Paper, HeaderWithIcon } from "@/components/common";

type Props = {};

const page = (props: Props) => {
  const {
    data: inventory,
    isLoading,
    error,
  } = useCurrentUserInventory();

  if (isLoading) {
    return <ItemsLoadingSkeleton />;
  }

  if (error) {
    return <ItemsError />;
  }

  // Show empty state if no items
  if (!inventory?.items || inventory.items.length === 0) {
    return <EmptyInventory />;
  }

  // Calculate total quantity of all items
  const totalQuantity = inventory.items.reduce((total, inventoryItem) => {
    return total + (inventoryItem.quantity || 1);
  }, 0);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
        subtitle={`${inventory.items.length} төрлийн эд зүйл (${totalQuantity} ширхэг)`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {inventory.items.map((inventoryItem, index) => (
          <ItemCard 
            key={`${inventoryItem.item.id}-${index}`} 
            item={inventoryItem.item} 
            quantity={inventoryItem.quantity || 1}
          />
        ))}
      </div>
    </div>
  );
};

export default page;

function ItemCard({ item, quantity }: { item: Item; quantity: number }) {
  // Function to get rarity color based on price
  function getRarityColor(price: number): string {
    if (price >= 100000) {
      return `border-red-500 bg-red-500/10`; // Legendary
    } else if (price >= 50000) {
      return `border-yellow-500 bg-yellow-500/10`; // Epic
    } else if (price >= 10000) {
      return `border-blue-500 bg-blue-500/10`; // Rare
    } else {
      return `border-green-500 bg-green-500/10`; // Common
    }
  }

  function getRarityBadgeColor(price: number): string {
    if (price >= 100000) {
      return `bg-red-500/50 border border-red-500 text-red-100`; // Legendary
    } else if (price >= 50000) {
      return `bg-yellow-500/50 border border-yellow-500 text-yellow-100`; // Epic
    } else if (price >= 10000) {
      return `bg-blue-500/50 border border-blue-500 text-blue-100`; // Rare
    } else {
      return `bg-green-500/50 border border-green-500 text-green-100`; // Common
    }
  }

  return (
    <Paper 
      variant="compact" 
      className={`hover:shadow-xl transition-all duration-300 relative overflow-hidden group rounded-lg ${getRarityColor(item.price)}`}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/dots.png')" }}
      />
      
      {/* Quantity badge */}
      {quantity > 1 && (
        <div className={`absolute top-2 right-2 z-20 text-xs font-bold px-2 py-1 rounded-full shadow-lg ${getRarityBadgeColor(item.price)}`}>
          ×{quantity}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="aspect-square relative mb-3 bg-transparent rounded-md">
          <img
            src={item.image_url || "/item.webp"}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
          />
        </div>
        
        <h3 className="font-semibold text-sm text-center truncate mb-2 text-card-foreground">
          {item.name}
        </h3>
        
        <div className="text-center">
          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold ${getRarityColor(item.price)}`}>
          {item.price.toLocaleString()} ₮
          </div>
          
          {/* Total value for quantity > 1 */}
          {quantity > 1 && (
            <div className="text-[10px] whitespace-nowrap text-muted-foreground mt-2 bg-muted/50 rounded px-2 py-1">
              <span className="text-accent font-medium">
                Нийт: {(item.price * quantity).toLocaleString()} ₮
              </span>
            </div>
          )}
          
          {/* Sell value if available */}
          {item.sell_value && (
            <div className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1">
              <span>📈</span>
              <span>{item.sell_value.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
}

function ItemsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Paper key={i} variant="compact" className="animate-pulse">
            <Skeleton className="aspect-square rounded-md mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}

function ItemsError() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
      />
      <Paper className="text-center py-16">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Алдаа гарлаа
        </h2>
        <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
          Таны агуулахын мэдээллийг ачаалахад алдаа гарлаа. Дахин оролдоно уу.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          Дахин оролдох
        </Button>
      </Paper>
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
      />
      <Paper className="text-center py-16">
        {/* Icon SVG */}
        <div className="mb-8">
          <svg
            className="w-30 h-30 text-white dark:text-black mx-auto"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Таны агуулахад одоогоор ямар ч эд зүйл алга.
        </h2>
        <p className="text-base text-zinc-400 mb-8 max-w-lg mx-auto">
          Эд зүйлс цуглуулахын тулд та хайрцаг нээгээрэй.
        </p>
        <Link href="/">
          <Button type="button" size="lg" variant="tertiary">
            Хайрцаг үзэх
          </Button>
        </Link>
      </Paper>
    </div>
  );
}
