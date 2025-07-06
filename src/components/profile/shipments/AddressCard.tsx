"use client";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/common";
import { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  onDelete: (address: Address) => void;
  isSettingDefault?: boolean;
  isDeleting?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  isSettingDefault = false,
  isDeleting = false,
}: AddressCardProps) {
  return (
    <Paper className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-lg">{address.title}</h3>
            {address.is_default && (
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                Үндсэн
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 text-muted-foreground">👤</span>
                <span className="font-medium text-muted-foreground">Хүлээн авагч:</span>
                <span>{address.recipient_name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 text-muted-foreground">📍</span>
                <span className="font-medium text-muted-foreground">Хаяг:</span>
                <span>{address.full_address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 text-muted-foreground">🏙️</span>
                <span className="font-medium text-muted-foreground">Хот/Сум:</span>
                <span>{address.city}, {address.district}</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 text-muted-foreground">📮</span>
                <span className="font-medium text-muted-foreground">Шуудангийн код:</span>
                <span>{address.postal_code}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 text-muted-foreground">📞</span>
                <span className="font-medium text-muted-foreground">Утас:</span>
                <span>{address.phone}</span>
              </p>
              {address.notes && (
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 text-muted-foreground mt-0.5">📝</span>
                  <span className="font-medium text-muted-foreground">Тэмдэглэл:</span>
                  <span className="text-muted-foreground">{address.notes}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(address)}
            className="text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Засах
          </Button>
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address)}
              disabled={isSettingDefault}
              className="text-sm hover:bg-blue-50 hover:text-blue-700 border-blue-200 transition-colors"
            >
              {isSettingDefault ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Тохируулж байна
                </div>
              ) : (
                "Үндсэн болгох"
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(address)}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 transition-colors"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                Устгаж байна
              </div>
            ) : (
              "Устгах"
            )}
          </Button>
        </div>
      </div>
    </Paper>
  );
}
