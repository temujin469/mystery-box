"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserItems } from "@/hooks/api";
import { Item } from "@/types/item";
import Link from "next/link";
import React from "react";
import { Paper, HeaderWithIcon } from "@/components/common";

type Props = {};

const page = (props: Props) => {
  const {
    data: items,
    isLoading,
    error,
  } = useCurrentUserItems({
    page: 1,
    limit: 50, // Get more items for inventory display
  });

  if (isLoading) {
    return <ItemsLoadingSkeleton />;
  }

  if (error) {
    return <ItemsError />;
  }

  // Show empty state if no items
  if (!items?.data || items.data.length === 0) {
    return <EmptyInventory />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
        // subtitle={`${items.meta.total} ширхэг эд зүйл олдлоо`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default page;

function ItemCard({ item }: { item: Item }) {
  return (
    <Paper variant="compact" className="hover:shadow-lg transition-shadow">
      <div className="aspect-square relative mb-3 bg-muted rounded-md overflow-hidden">
        <img
          src={item.image_url || "/item.webp"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-medium text-sm truncate mb-1">{item.name}</h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{item.price} зоос</span>
        {item.sell_value && (
          <span className="text-green-500">↑{item.sell_value}</span>
        )}
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
