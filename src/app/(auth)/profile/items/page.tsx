"use client";
import { useCurrentUserInventory } from "@/hooks/api/useInventory";
import React from "react";
import { HeaderWithIcon } from "@/components/common";
import { 
  ProfileItemCard, 
  ItemsLoadingSkeleton, 
  ItemsError, 
  EmptyInventory 
} from "@/components/profile/items";

type Props = {};

const page = (props: Props) => {
  const { data: inventory, isLoading, error } = useCurrentUserInventory();

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
    <div>
      <HeaderWithIcon
        icon="📦"
        title="Миний агуулах"
        subtitle={`${inventory.items.length} төрлийн эд зүйл (${totalQuantity} ширхэг)`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {inventory.items.map((inventoryItem, index) => (
          <ProfileItemCard
            key={`${inventoryItem.item.id}-${index}`}
            item={inventoryItem.item}
            quantity={inventoryItem.quantity || 1}
            onClick={() => {
              // Handle item click - could open detail modal or navigate
              console.log("Item clicked:", inventoryItem.item);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
