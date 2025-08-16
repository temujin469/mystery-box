import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { FastForward, Gift, Package } from "lucide-react";
import { useSpinBusinessLogic } from "@/hooks/useSpinBusinessLogic";
import { useSpinningReelStore } from "@/stores/spinningReel.store";
import { useBox, useOpenRewardBox } from "@/hooks/api/useBox";
import { SpiningItem } from "./SpiningReel";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SpinReelControllerProps {
  spinning: boolean;
  onSpin: (
    winnerItem: SpiningItem | null,
    spinType: "paid" | "trial" | "reward"
  ) => void;
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

  // Router for navigation
  const router = useRouter();

  // State to track if reward has been claimed
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  // Get URL search params to check for reward parameter
  const searchParams = useSearchParams();
  const rewardParam = searchParams.get("reward");
  const achievementId = rewardParam ? parseInt(rewardParam, 10) : null;
  const isRewardMode = achievementId !== null && !isNaN(achievementId);

  // Get boxId and winnerItem from store directly
  const boxId = useSpinningReelStore((state) => state.boxId);
  const canQuickSell = useSpinningReelStore((state) => state.canQuickSell);
  const winner = useSpinningReelStore((state) => state.winnerItem);

  // Fetch box data using the boxId from store
  const { data: boxResponse, isLoading: isBoxLoading } = useBox(
    boxId || 0,
    !!boxId
  );

  // Reward box opening hook
  const { mutate: openRewardBox, isPending: isOpeningReward } =
    useOpenRewardBox();

  const box = boxResponse?.box;

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

  // Handler for navigating to profile items
  const handleViewItems = () => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }

    router.push("/profile/items");
  };

  // Handler for claiming achievement reward
  const handleClaimReward = () => {
    // Security check: Rate limiting
    if (!isClickAllowed()) {
      return;
    }

    if (boxId && achievementId) {
      openRewardBox(
        { boxId, achievementId },
        {
          onSuccess: (response) => {
            // Trigger the spinning animation with the won item
            const winnerItem: SpiningItem = {
              id: response.data.receivedItem.id,
              name: response.data.receivedItem.name,
              image_url: response.data.receivedItem.image_url,
              drop_rate: 1.0, // Default drop rate for reward items
              sell_value: response.data.receivedItem.sell_value || 0,
            };
            console.log("ahha", response.data);
            onSpin(winnerItem, "reward"); // Use reward type for achievement reward claims
            setIsRewardClaimed(true); // Mark reward as claimed

          },
          onError: (error) => {
            // console.error("Failed to open reward box:", error);

            // Check if it's a 403 Forbidden error
            if ((error as any)?.response?.status === 403) {
              toast.warning("Шагналын хайрцгийг нээх эрх байхгүй байна", {
                description: "Шагналын хайрцаг аль хэдийн нээгдсэн",
                duration: 3000,
              });
            } else {
              toast.error("Шагналын хайрцаг нээхэд алдаа гарлаа", {
                description: "Дахин оролдоно уу.",
                duration: 4000,
              });
            }
          },
        }
      );
    }
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
      {isRewardMode ? (
        // Reward Mode - Single Claim Button
        <Button
          className={`relative flex-1 max-w-[280px] px-6 sm:px-8 py-4 border text-white font-mono transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none rounded-xl text-sm sm:text-base ${
            isRewardClaimed
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-blue-500/50 hover:shadow-blue-500/25"
              : "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 border-emerald-500/50 hover:shadow-emerald-500/25"
          }`}
          onClick={isRewardClaimed ? handleViewItems : handleClaimReward}
          size="lg"
          disabled={spinning || isOpeningReward}
        >
          {isRewardClaimed ? (
            <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          ) : (
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          )}
          <span className="relative z-10">
            {isOpeningReward
              ? "Авч байна..."
              : isRewardClaimed
              ? "Миний эд зүйлс"
              : "Шагнал авах"}
          </span>
        </Button>
      ) : winner ? (
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
