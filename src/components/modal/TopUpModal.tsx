"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
const QUICK_AMOUNTS = [10000, 20000, 30000, 40000];

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
      <DialogContent className="sm:max-w-lg w-full max-w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-lg rounded-none border-0 sm:border border-border/50 flex flex-col p-0 gap-0 data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-bottom-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-left">
                Данс цэнэглэх
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-left mt-1">
                Тоглоомын зоос худалдан авч, хайрцаг онгойлгоход ашиглаарай
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Quick Amount Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Дүн сонгох</Label>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount && !customAmount ? "default" : "secondary"}
                  size="sm"
                  onClick={() => handleAmountSelect(quickAmount)}
                  className={`h-10  text-sm font-medium transition-colors duration-200 border-0 ${
                    amount === quickAmount && !customAmount
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 hover:bg-secondary/80"
                  }`}
                >
                  {formatAmount(quickAmount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="custom-amount" className="text-sm font-semibold">
              Өөрөө оруулах
            </Label>
            <div className="relative">
              <Input
                id="custom-amount"
                type="number"
                placeholder="Дүн оруулах..."
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="h-10 text-sm pl-4 pr-12 bg-muted/30 border-2 border-transparent focus:border-primary/50 focus:bg-background transition-all duration-200"
                min="1"
                max="1000000"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-primary">₮</span>
              </div>
            </div>
          </div>

          {/* Selected Amount Display */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <span className="text-base font-semibold">Нийт дүн</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {formatAmount(amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Төлбөрийн арга</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedMethod === "card" ? "default" : "secondary"}
                onClick={() => setSelectedMethod("card")}
                className={`h-12 flex-row gap-3 transition-colors duration-200 border-0 ${
                  selectedMethod === "card"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 hover:bg-secondary/80"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedMethod === "card" ? "bg-white/20" : "bg-primary/10"
                }`}>
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Карт</span>
              </Button>
              <Button
                variant={selectedMethod === "bank" ? "default" : "secondary"}
                onClick={() => setSelectedMethod("bank")}
                className={`h-12 flex-row gap-3 transition-colors duration-200 border-0 ${
                  selectedMethod === "bank"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 hover:bg-secondary/80"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedMethod === "bank" ? "bg-white/20" : "bg-primary/10"
                }`}>
                  <Coins className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Банк шилжүүлэг</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons at Bottom */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-border/20">
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 text-sm border-0 bg-secondary hover:bg-secondary/80"
              disabled={updateCoins.isPending}
            >
              Цуцлах
            </Button>
            <Button
              onClick={handleTopUp}
              disabled={updateCoins.isPending || amount <= 0 || !selectedMethod}
              className="flex-1 h-10 text-sm bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-colors duration-200"
            >
              {updateCoins.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Цэнэглэж байна...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Цэнэглэх
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
