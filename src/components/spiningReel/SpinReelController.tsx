import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { FastForward } from "lucide-react";
import { useSpinBusinessLogic } from "@/hooks/useSpinBusinessLogic";
import { SpiningItem } from "./SpiningReel";

interface SpinReelControllerProps {
  boxPrice: number;
  spinning: boolean;
  winner: SpiningItem | null;
  onSpin: () => void;
  onResetWinner: () => void;
}

const SpinReelController: React.FC<SpinReelControllerProps> = ({
  spinning,
  boxPrice,
  winner,
  onSpin,
  onResetWinner,
}) => {
  // Business logic hook - handles authentication, modal management, and business rules
  const {
    handlePaidSpinRequest,
    handleTrialSpinRequest,
    handleQuickSell,
    resetSpinType,
    canQuickSell,
  } = useSpinBusinessLogic();

  // Handler functions that delegate to business logic hook
  const handlePaidSpin = () => {
    handlePaidSpinRequest(onSpin, boxPrice);
  };

  const handleTrialSpin = () => {
    handleTrialSpinRequest(onSpin);
  };

  const handleQuickSellClick = (item: SpiningItem) => {
    handleQuickSell(item); // Business logic handler
    onResetWinner(); // Parent component handler - resets winner state
  };

  // Enhanced handler for dismissing winner that also resets spin type
  const handleDismiss = () => {
    resetSpinType(); // Reset the spin type tracking
    onResetWinner(); // Parent component handler - resets winner state
  };

  return (
    <div className="flex w-full justify-center gap-2 sm:gap-4 py-8 px-4">
      {winner ? (
        // Winner State - Two Action Buttons
        <>
          <Button
            className="relative flex-1 max-w-[140px] px-4 sm:px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 rounded-xl text-sm sm:text-base"
            onClick={handleDismiss}
            size="lg"
          >
            <span className="relative z-10">Цуцлах</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 rounded-xl" />
          </Button>

          {canQuickSell ? (
            <Button
              className="relative flex-1 max-w-[180px] px-4 sm:px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 border border-green-500/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 rounded-xl text-sm sm:text-base"
              onClick={() => handleQuickSellClick(winner)}
              size="lg"
            >
              <span className="relative z-10 truncate">
                Зарах • {winner.sell_value?.toLocaleString() || "0"} ₮
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 rounded-xl" />
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
            disabled={spinning}
          >
            <span className="relative z-10 sm:hidden truncate">
              {spinning ? "..." : `${boxPrice} ₮`}
            </span>
            <span className="relative z-10 hidden sm:block truncate">
              {spinning ? "PROCESSING..." : `Нээх • ${boxPrice} ₮`}
            </span>
            {!spinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 rounded-xl" />
            )}
          </Button>

          <Button
            className="relative flex-1 max-w-[100px] sm:max-w-[130px] px-2 sm:px-4 py-4 bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-600 hover:to-slate-700 border border-gray-600/50 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 disabled:opacity-50 disabled:hover:shadow-none rounded-xl text-xs sm:text-base"
            onClick={handleTrialSpin}
            size="lg"
            disabled={spinning}
          >
            <span className="relative z-10 truncate">Туршилт</span>
            {!spinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 rounded-xl" />
            )}
          </Button>

          <Button
            className="relative flex-shrink-0 px-3 sm:px-6 py-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-400 font-mono transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 rounded-xl"
            size="lg"
          >
            <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 rounded-xl" />
          </Button>
        </>
      )}
    </div>
  );
};

export default SpinReelController;
