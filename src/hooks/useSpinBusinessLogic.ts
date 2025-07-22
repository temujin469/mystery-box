import { useCallback, useState, useRef } from "react";
import { useCurrentUser } from "@/hooks/api";
import { useModalStore } from "@/stores/modal.store";
import { useSpinningReelStore } from "@/stores/spinningReel.store";
import { SpiningItem } from "@/components/spiningReel/SpiningReel";
import { toast } from "sonner";
import { useOpenMyBox } from "@/hooks/api/useBoxes";
import { useSellItem } from "@/hooks/api/useItems";
import { useAchievementNotifications } from "@/hooks/useAchievementNotifications";

/*
 * Business logic hook for the spinning reel
 * Simplified version - most business logic moved to backend
 */

export const useSpinBusinessLogic = () => {
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isAuthenticated = !!user && !isAuthLoading;

  const openMyBox = useOpenMyBox();
  const sellItem = useSellItem();
  const { showAchievementNotifications } = useAchievementNotifications();

  const openAuth = useModalStore((state) => state.openAuth);
  const openTopup = useModalStore((state) => state.openTopup);

  // Security: Rate limiting for API calls
  const lastApiCall = useRef<number>(0);
  const API_CALL_COOLDOWN = 2000; // 2 seconds between API calls

  // Track the type of the last spin to determine if quick sell is allowed
  const [lastSpinType, setLastSpinType] = useState<"paid" | "trial" | null>(
    null
  );

  const [receivedItem, setReceivedItem] = useState<SpiningItem | null>(null);

  // Security function to check API call cooldown
  const isApiCallAllowed = (): boolean => {
    const now = Date.now();
    if (now - lastApiCall.current < API_CALL_COOLDOWN) {
      toast.error("Хэт олон хүсэлт илгээж байна. Түр хүлээнэ үү.");
      return false;
    }
    lastApiCall.current = now;
    return true;
  };

  //useCallback is used to memoize functions to prevent unnecessary re-renders
  // Handle paid spin business logic - simplified
  const handlePaidSpinRequest = useCallback(
    async (
      onSpin: (winnerItem: SpiningItem, spinType: "paid") => void,
      boxPrice: number | string,
      boxId?: number
    ): Promise<"paid" | null> => {
      try {
        // Security check: Rate limiting for API calls
        if (!isApiCallAllowed()) {
          return null;
        }

        // Authentication check first
        if (!isAuthenticated) {
          openAuth("signin");
          return null;
        }

        // Security check: Validate input parameters
        if (!boxId || !boxPrice) {
          console.warn("Invalid box parameters for paid spin");
          toast.error("Хайрцагийн мэдээлэл алдаатай байна");
          return null;
        }

        // Check if user has enough coins (simple check - backend will validate too)
        const price = Number(boxPrice);
        const userCoins = Number(user?.coins || 0);

        // Security check: Validate price is positive
        if (price <= 0) {
          console.warn("Invalid box price:", price);
          toast.error("Хайрцагийн үнэ алдаатай байна");
          return null;
        }

        if (userCoins < price) {
          const requiredAmount = price - userCoins;
          openTopup({ initialAmount: Math.max(requiredAmount, 1000) }); // Minimum 1000 coins
          toast.error("Үлдэгдэл хүрэлцэхгүй байна");
          return null;
        }

        // Show loading state
        toast.loading("Хайрцаг нээж байна...", { id: "box-opening" });

        // Call backend to open box (handles coin deduction, experience, inventory)
        if (boxId) {
          const result = await openMyBox.mutateAsync(boxId);

          // Convert the API response item to SpiningItem format
          const winnerItem: SpiningItem = {
            id: result.receivedItem.id,
            name: result.receivedItem.name,
            image_url: result.receivedItem.image_url,
            sell_value: result.receivedItem.sell_value || 0,
            drop_rate: 0, // Drop rate is not relevant for the actual winner
          };

          // Set state for quick sell functionality
          setReceivedItem(winnerItem);
          setLastSpinType("paid");
          useSpinningReelStore.getState().setLastSpinType("paid");

          // Dismiss loading
          toast.dismiss("box-opening");

          // Paid Spin:
          // Click → API call → onSpin(apiWinner, "paid") → Spin to API winner
          // Trial Spin:
          // Click → onSpin(null, "trial") → Pick winner internally → Spin to winner

          // Pass winner item and spin type directly to onSpin for perfect synchronization
          onSpin(winnerItem, "paid");

          // Show success message after spin completes
          setTimeout(() => {
            toast.success(
              // `Хайрцаг нээгдлээ! ${result.receivedItem.name} олдлоо!`
              `Хайрцаг нээгдлээ!`
            );

            // Handle achievement notifications
            if (result.unlockedAchievements && result.unlockedAchievements.length > 0) {
              showAchievementNotifications(result.unlockedAchievements);
            }
          }, 2600); // Spin duration + buffer

          console.log(
            `🎰 Box opened - received: ${result.receivedItem.name} (ID: ${result.receivedItem.id})`
          );
        }

        return "paid";
      } catch (error) {
        console.error("Failed to process paid spin:", error);
        toast.dismiss("box-opening");

        if (error instanceof Error) {
          if (error.message.includes("Зоос хүрэлцэхгүй байна")) {
            toast.error("Зоос хүрэлцэхгүй байна");
            openTopup({ initialAmount: 1000 });
          } else if (error.message.includes("олдсонгүй")) {
            toast.error("Хайрцаг олдсонгүй");
          } else {
            toast.error("Хайрцаг нээхэд алдаа гарлаа");
          }
        } else {
          toast.error("Алдаа гарлаа");
        }

        setLastSpinType(null);
        useSpinningReelStore.getState().resetSpinType();
        return null;
      }
    },
    [isAuthenticated, openAuth, openTopup, user?.coins, openMyBox]
  );

  // Handle trial spin business logic - simplified
  const handleTrialSpinRequest = useCallback(
    (onSpin: (winnerItem: null, spinType: "trial") => void): "trial" | null => {
      if (!isAuthenticated) {
        openAuth("signup"); // Prefer signup for trial users
        return null;
      }

      // Mark this as a trial spin
      setLastSpinType("trial");
      useSpinningReelStore.getState().setLastSpinType("trial");

      // Pass null as winner item (will be picked internally) and spin type
      onSpin(null, "trial");

      return "trial";
    },
    [isAuthenticated, openAuth]
  );

  // Handle win 
  const handleWin = useCallback(
    async (item: SpiningItem) => {
      try {
        console.log("Processing win:", item, "Spin type:", lastSpinType);

        if (lastSpinType === "trial") {
          // For trial spins, show what they would have won
          toast.info(`Туршилтын ялалт: ${item.name}`, {
            description: "Бүртгүүлээд эд зүйлс цуглуулж эхлээрэй!",
            duration: 3000,
          });
          console.log(`Trial spin win: ${item.name} (not added to inventory)`);
        } else if (lastSpinType === "paid") {
          // For paid spins, the backend already handled inventory
          console.log(
            `Paid spin win: ${item.name} (already added to inventory by backend)`
          );
        }
      } catch (error) {
        console.error("Failed to process win:", error);
        toast.error("Алдаа гарлаа");
      }
    },
    [lastSpinType]
  );

  // Handle quick sell business logic - use the new sellItem hook
  const handleQuickSell = useCallback(
    async (item: SpiningItem) => {
      try {
        // Security check: Rate limiting for API calls
        if (!isApiCallAllowed()) {
          return;
        }

        // Only allow quick sell for paid spins
        if (lastSpinType !== "paid") {
          toast.error("Туршилтын эргэлтэнд хурдан зарах боломжгүй");
          return;
        }

        // Authentication check
        if (!isAuthenticated) {
          toast.error("Эд зүйл зарахын тулд нэвтэрнэ үү");
          openAuth("signin");
          return;
        }

        // Security check: Validate item data
        if (!item || !item.id || typeof item.sell_value !== 'number' || item.sell_value <= 0) {
          console.warn("Invalid item for quick sell:", item);
          toast.error("Энэ эд зүйлийг зарах боломжгүй");
          return;
        }
        if (!item.sell_value || item.sell_value <= 0) {
          toast.error("Зарах боломжгүй");
          return;
        }

        // Show loading state
        toast.loading(`${item.name} зарж байна...`, { id: "quick-sell" });

        // Use the backend sellItem endpoint
        const result = await sellItem.mutateAsync({
          id: item.id,
          quantity: 1,
        });

        // Success feedback
        toast.success(
          // result.message,
          "Амжилттай зарагдлаа",
          { id: "quick-sell" }
        );

        console.log("Quick sell completed:", {
          item: item.name,
          itemId: item.id,
          coinsReceived: result.coinsReceived,
        });
      } catch (error) {
        console.error("Failed to process quick sell:", error);
        toast.dismiss("quick-sell");

        if (error instanceof Error) {
          if (error.message.includes("олдсонгүй")) {
            toast.error("Эд зүйл багцад олдсонгүй");
          } else if (error.message.includes("хангалттай")) {
            toast.error("Багцад хангалттай эд зүйл байхгүй");
          } else if (error.message.includes("зарж борлуулах боломжгүй")) {
            toast.error("Энэ эд зүйлийг зарах боломжгүй");
          } else {
            toast.error("Зарахад алдаа гарлаа");
          }
        } else {
          toast.error("Зарах үед алдаа гарлаа");
        }
      }
    },
    [lastSpinType, isAuthenticated, sellItem, openAuth]
  );

  // Check if quick sell is allowed for the current win
  const canQuickSell = useCallback(() => {
    return (
      lastSpinType === "paid" && receivedItem && receivedItem.sell_value > 0
    );
  }, [lastSpinType, receivedItem]);

  // Reset spin type when winner is dismissed
  const resetSpinType = useCallback(() => {
    setLastSpinType(null);
    setReceivedItem(null);
    useSpinningReelStore.getState().resetSpinType();
  }, []);

  return {
    // Authentication state
    isAuthenticated,
    isAuthLoading,
    user,

    // Business logic handlers
    handlePaidSpinRequest,
    handleTrialSpinRequest,
    handleWin,
    handleQuickSell,
    resetSpinType,

    // Business rule checks
    canQuickSell: canQuickSell(),
    lastSpinType,
    receivedItem,
  };
};
