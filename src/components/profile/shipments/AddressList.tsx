"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/types/address";
import AddressCard from "./AddressCard";
import { Paper } from "@/components/common";

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
  error: Error | null;
  onShowNewForm: () => void;
  onEditAddress: (address: Address) => void;
  onSetDefaultAddress: (address: Address) => void;
  onDeleteAddress: (address: Address) => void;
  settingDefaultId: number | null;
  deletingAddressId: number | null;
  isInitialLoading?: boolean;
}

export default function AddressList({
  addresses,
  isLoading,
  error,
  onShowNewForm,
  onEditAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  settingDefaultId,
  deletingAddressId,
  isInitialLoading = false,
}: AddressListProps) {
  const hasAddresses = addresses.length > 0;

  return (
    <div className="mb-12">

      {/* Error State */}
      {error && !isInitialLoading && (
        <Paper variant="compact" className="mb-6 bg-red-50 border-red-200">
          <p className="text-red-800 font-medium">Алдаа гарлаа</p>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || "Хаяг ачаалахад алдаа гарлаа"}
          </p>
        </Paper>
      )}

      {/* Loading State */}
      {(isLoading || isInitialLoading) && (
        <div className="space-y-4">
          {/* Loading header */}
          {isInitialLoading && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-8 w-64" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          )}
          
          {/* Loading cards */}
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Paper key={i}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        </div>
      )}

      {/* Addresses List */}
      {!isLoading && !isInitialLoading && hasAddresses && (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={onEditAddress}
              onSetDefault={onSetDefaultAddress}
              onDelete={onDeleteAddress}
              isSettingDefault={settingDefaultId === address.id}
              isDeleting={deletingAddressId === address.id}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isInitialLoading && !hasAddresses && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Хадгалагдсан хаяг байхгүй байна
            </h3>
            <p className="text-muted-foreground mb-6">
              Бараа захиалахын тулд хүргэлтийн хаяг нэмэх шаардлагатай
            </p>
            <Button
              onClick={onShowNewForm}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span className="mr-2">＋</span>
              Анхны хаягаа нэмэх
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
