"use client";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/common";
import { Address } from "@/types/address";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Edit, Star, Trash2 } from "lucide-react";

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
    <Paper className="hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate">{address.title}</h3>
              {address.is_default && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-lg text-xs font-medium mt-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Үндсэн хаяг
                </span>
              )}
            </div>
          </div>
          
          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(address)}
                  className="w-full justify-start text-sm hover:bg-muted"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Засах
                </Button>
                
                {!address.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetDefault(address)}
                    disabled={isSettingDefault}
                    className="w-full justify-start text-sm hover:bg-muted disabled:opacity-50"
                  >
                    {isSettingDefault ? (
                      <>
                        <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Тохируулж байна...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Үндсэн болгох
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(address)}
                  disabled={isDeleting}
                  className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Устгаж байна...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Устгах
                    </>
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Recipient */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Хүлээн авагч</p>
              <p className="font-semibold text-foreground truncate">{address.recipient_name}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent text-sm">📍</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Хаяг</p>
              <p className="font-semibold text-foreground leading-relaxed">{address.full_address}</p>
              <p className="text-sm text-muted-foreground mt-1">{address.city}, {address.district}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-500 text-sm">�</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium">Утас</p>
                <p className="font-semibold text-foreground truncate">{address.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-500 text-sm">�</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium">Шуудангийн код</p>
                <p className="font-semibold text-foreground">{address.postal_code}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {address.notes && (
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-500 text-sm">📝</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium">Тэмдэглэл</p>
                <p className="text-muted-foreground leading-relaxed">{address.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
}
