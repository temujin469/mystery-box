import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { FastForward } from "lucide-react";
import { useSpinBusinessLogic } from "@/hooks/useSpinBusinessLogic";
import { useSpinningReelStore } from "@/stores/spinningReel.store";
import { useBox } from "@/hooks/api/useBoxes";
import { SpiningItem } from "./SpiningReel";

interface SpinReelControllerProps {
  spinning: boolean;
  onSpin: (winnerItem: SpiningItem | null, spinType: "paid" | "trial") => void;
  onResetWinner: () => void;
}

const SpinReelController: React.FC<SpinReelControllerProps> = ({
  spinning,
  onSpin,
  onResetWinner,
}) => {
  // Security: Prevent rapid clicking with refs
  const lastClickTime = useRef<number>(0);
  const CLICK_COOLDOWN = 1000; // 1 second cooldown between clicks

  // Get boxId and winnerItem from store directly
  const boxId = useSpinningReelStore((state) => state.boxId);
  const canQuickSell = useSpinningReelStore((state) => state.canQuickSell);
  const winner = useSpinningReelStore((state) => state.winnerItem);

  // Fetch box data using the boxId from store
  const { data: box, isLoading: isBoxLoading } = useBox(boxId || 0, !!boxId);

  // Business logic hook - handles authentication, modal management, and business rules
  const {
    handlePaidSpinRequest,
    handleTrialSpinRequest,
    handleQuickSell,
    resetSpinType,
  } = useSpinBusinessLogic();

  // Security function to check click cooldown
  const isClickAllowed = (): boolean => {
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_COOLDOWN) {
      console.warn("Action blocked: Too many rapid clicks");
      return false;
    }
    lastClickTime.current = now;
    return true;
  };

  // Handler functions that delegate to business logic hook
  const handlePaidSpin = () => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }

    if (box && boxId) {
      handlePaidSpinRequest(onSpin, box.price, boxId);
    }
  };

  const handleTrialSpin = () => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }
    
    handleTrialSpinRequest(onSpin);
  };

  const handleQuickSellClick = (item: SpiningItem) => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }

    handleQuickSell(item); // Business logic handler
    onResetWinner(); // Parent component handler - resets winner state
  };

  // Enhanced handler for dismissing winner that also resets spin type
  const handleDismiss = () => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }

    resetSpinType(); // Reset the spin type tracking
    onResetWinner(); // Parent component handler - resets winner state
  };

  // Don't render if box is not loaded yet
  if (!box || isBoxLoading) {
    return (
      <div className="flex w-full justify-center gap-2 sm:gap-4 py-8 px-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center gap-2 sm:gap-4 py-8 px-4">
      {winner ? (
        // Winner State - Two Action Buttons
        <>
          <Button
            className="relative flex-1 max-w-[140px] px-4 sm:px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 rounded-xl text-sm sm:text-base"
            onClick={handleDismiss}
            size="lg"
            disabled={spinning} // Security: Disable during spinning
          >
            <span className="relative z-10">Цуцлах</span>
          </Button>

          {canQuickSell ? (
            <Button
              className="relative flex-1 max-w-[180px] px-4 sm:px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 border border-green-500/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 rounded-xl text-sm sm:text-base"
              onClick={() => handleQuickSellClick(winner)}
              size="lg"
              disabled={spinning} // Security: Disable during spinning
            >
              <span className="relative z-10 truncate">
                Зарах • {winner.sell_value?.toLocaleString() || "0"} ₮
              </span>
            </Button>
          ) : (
            <Button
              className="relative flex-1 max-w-[140px] px-4 sm:px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-500/50 text-gray-400 font-mono cursor-not-allowed rounded-xl text-sm sm:text-base"
              disabled
              size="lg"
              title="Quick sell not available for trial spins"
            >
              <span className="relative z-10">Зарах</span>
            </Button>
          )}
        </>
      ) : (
        // Default State - Three Control Buttons
        <>
          <Button
            className="relative flex-1 max-w-[140px] sm:max-w-[220px] px-2 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 border border-blue-500/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:hover:shadow-none rounded-xl text-xs sm:text-base"
            onClick={handlePaidSpin}
            size="lg"
            disabled={spinning} // Security: Disable during spinning
          >
            <span className="relative z-10 sm:hidden truncate">
              {spinning ? "..." : `${box?.price || 0} ₮`}
            </span>
            <span className="relative z-10 hidden sm:block truncate">
              {spinning ? "PROCESSING..." : `Нээх • ${box?.price || 0} ₮`}
            </span>
          </Button>

          <Button
            className="relative flex-1 max-w-[100px] sm:max-w-[130px] px-2 sm:px-4 py-4 bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-600 hover:to-slate-700 border border-gray-600/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 disabled:opacity-50 disabled:hover:shadow-none rounded-xl text-xs sm:text-base"
            onClick={handleTrialSpin}
            size="lg"
            disabled={spinning} // Security: Disable during spinning
          >
            <span className="relative z-10 truncate">Туршилт</span>
          </Button>

          <Button
            className="relative flex-shrink-0 px-3 sm:px-6 py-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-400 font-mono transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 rounded-xl"
            size="lg"
            disabled={spinning} // Security: Disable during spinning
          >
            <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default SpinReelController;
