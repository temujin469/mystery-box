"use client";
import { useCurrentUserInventory } from "@/hooks/api/useInventory";
import React, { useState, useMemo } from "react";
import { HeaderWithIcon, Pagination } from "@/components/common";
import {
  ProfileItemCard,
  ItemsLoadingSkeleton,
  ItemsError,
  EmptyInventory,
} from "@/components/profile/items";
import { ItemDetailSlide } from "@/components/features/item/ItemDetailSlide";
import { OrderManagementSlide } from "@/components/features/order";
import { ShoppingBag } from "lucide-react";

type Props = {};

const ITEMS_PER_PAGE = 8;

const InventoryPage = (props: Props) => {
  const {
    data: inventoryResponse,
    isLoading,
    error,
  } = useCurrentUserInventory();
  const inventory = inventoryResponse?.inventory;

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOrderSlideOpen, setIsOrderSlideOpen] = useState(false);

  // Pagination calculations
  const { paginatedItems, totalPages, totalItems } = useMemo(() => {
    if (!inventory?.items) {
      return { paginatedItems: [], totalPages: 0, totalItems: 0 };
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = inventory.items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(inventory.items.length / ITEMS_PER_PAGE);

    return {
      paginatedItems,
      totalPages,
      totalItems: inventory.items.length,
    };
  }, [inventory?.items, currentPage]);

  // Calculate total quantity of all items
  const totalQuantity =
    inventory?.items?.reduce((total, inventoryItem) => {
      return total + (inventoryItem.quantity || 1);
    }, 0) || 0;

  // Handle item click
  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  return (
    <div>
      <HeaderWithIcon
        icon="🛍️"
        title="Миний агуулах"
        subtitle={`${totalItems} төрлийн эд зүйл (${totalQuantity} ширхэг)`}
        actionButton={{
          label: "Захиалга үүсгэх",
          onClick: () => setIsOrderSlideOpen(true),
          icon: <ShoppingBag className="w-4 h-4" />,
          variant: "default",
        }}
      />

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {paginatedItems.map((inventoryItem: any, index: number) => {
          const item = inventoryItem.item;
          const quantity = inventoryItem.quantity || 1;

          return (
            <ProfileItemCard
              key={`${item.id}-${index}`}
              item={item}
              quantity={quantity}
              onClick={() => handleItemClick(item.id)}
              className="hover:shadow-md transition-shadow"
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          size="lg"
          showInfo={true}
        />
      )}

      {/* Item Detail Slide */}
      <ItemDetailSlide
        itemId={selectedItemId}
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />

      {/* Order Management Slide */}
      <OrderManagementSlide
        isOpen={isOrderSlideOpen}
        onClose={() => setIsOrderSlideOpen(false)}
        onOrderSuccess={(orderId) => {
          console.log("Order created successfully:", orderId);
          setIsOrderSlideOpen(false);
        }}
      />
    </div>
  );
};

export default InventoryPage;
