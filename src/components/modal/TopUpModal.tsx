"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Coins, CreditCard, Loader2 } from "lucide-react";
import { useUpdateCurrentUserCoins } from "@/hooks/api/useUsers";
import { toast } from "sonner";
import { TopupModalData } from "@/stores/modal.store";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: TopupModalData;
}

// Predefined amount options
const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

export function TopUpModal({ open, onOpenChange, data }: TopUpModalProps) {
  const [amount, setAmount] = useState(data?.initialAmount || 1000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank" | null>(null);

  const updateCoins = useUpdateCurrentUserCoins();

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value) || 0;
    if (numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleTopUp = async () => {
    if (amount <= 0) {
      toast.error("Зөв дүн оруулна уу");
      return;
    }

    if (!selectedMethod) {
      toast.error("Төлбөрийн арга сонгоно уу");
      return;
    }

    try {
      await updateCoins.mutateAsync({
        data: { coins: amount }
      });
      
      toast.success(`${amount.toLocaleString()} ₮ амжилттай нэмэгдлээ!`);
      onOpenChange(false);
      
      // Reset state
      setAmount(data?.initialAmount || 1000);
      setCustomAmount("");
      setSelectedMethod(null);
    } catch (error) {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString() + " ₮";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Данс цэнэглэх
          </DialogTitle>
          <DialogDescription>
            Тоглоомын зоос худалдан авч, захиалга хийхэд ашиглаарай
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Amount Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Дүн сонгох</Label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount && !customAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(quickAmount)}
                  className="text-xs"
                >
                  {formatAmount(quickAmount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Өөрөө оруулах
            </Label>
            <div className="relative">
              <Input
                id="custom-amount"
                type="number"
                placeholder="Дүн оруулах"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pr-8"
                min="1"
                max="1000000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₮
              </span>
            </div>
          </div>

          {/* Selected Amount Display */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm font-medium">Нийт дүн:</span>
            <Badge variant="secondary" className="text-base font-bold">
              {formatAmount(amount)}
            </Badge>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Төлбөрийн арга</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedMethod === "card" ? "default" : "outline"}
                onClick={() => setSelectedMethod("card")}
                className="h-12 flex-col gap-1"
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-xs">Карт</span>
              </Button>
              <Button
                variant={selectedMethod === "bank" ? "default" : "outline"}
                onClick={() => setSelectedMethod("bank")}
                className="h-12 flex-col gap-1"
              >
                <Coins className="h-4 w-4" />
                <span className="text-xs">Банк шилжүүлэг</span>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={updateCoins.isPending}
            >
              Цуцлах
            </Button>
            <Button
              onClick={handleTopUp}
              disabled={updateCoins.isPending || amount <= 0 || !selectedMethod}
              className="flex-1"
            >
              {updateCoins.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Цэнэглэж байна...
                </>
              ) : (
                "Цэнэглэх"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
