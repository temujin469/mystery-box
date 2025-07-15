import { useCallback, useState } from "react";
import {
  useCurrentUser,
  useUpdateCurrentUserCoins,
  useUpdateCurrentUserExperience,
} from "@/hooks/api";
import {
  useAddItemToCurrentUserInventory,
  useRemoveItemFromCurrentUserInventory,
} from "@/hooks/api/useInventory";
import { useModalStore } from "@/stores/modal.store";
import { SpiningItem } from "@/components/spiningReel/SpiningReel";
import { toast } from "sonner";
import {
  validateDecimalCurrency,
  formatCurrency,
  hasSufficientBalance,
} from "@/lib/currency";

/*
 * Business logic hook for the spinning reel
 * Handles authentication, modal opening, and spin authorization
 */

export const useSpinBusinessLogic = () => {
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isAuthenticated = !!user && !isAuthLoading;

  // Safe to call - user check happens inside the mutation function
  const updateUserCoins = useUpdateCurrentUserCoins();
  const updateUserExperience = useUpdateCurrentUserExperience();
  const addItemToInventory = useAddItemToCurrentUserInventory();
  const removeItemFromInventory = useRemoveItemFromCurrentUserInventory();

  const openAuth = useModalStore((state) => state.openAuth);
  const openTopup = useModalStore((state) => state.openTopup);

  // Track the type of the last spin to determine if quick sell is allowed
  const [lastSpinType, setLastSpinType] = useState<"paid" | "trial" | null>(
    null
  );

  //useCallback is used to memoize functions to prevent unnecessary re-renders
  // Check if user can perform a paid spin
  const canPerformPaidSpin = useCallback(
    (boxPrice: number | string) => {
      // Authentication check
      if (!isAuthenticated) {
        return false;
      }

      // Validate box price - ensure it's a valid decimal number
      const validatedPrice = validateDecimalCurrency(boxPrice);
      if (validatedPrice === null || validatedPrice <= 0) {
        console.warn("Invalid box price:", boxPrice);
        return false;
      }

      // Check if user data is available
      if (!user) {
        console.warn("User data not available");
        return false;
      }

      // Check coin balance with decimal precision
      if (!hasSufficientBalance(user.coins || 0, validatedPrice)) {
        // Don't show toast here to avoid duplicate toasts, let the calling function handle it
        console.warn(
          `Insufficient coins: has ${user.coins || 0}, needs ${validatedPrice}`
        );
        return false;
      }

      // Add additional business logic here:
      // - Check daily spin limits
      // - Check user subscription status
      // - Check if user is banned
      // - Check maintenance mode
      // etc.

      return true;
    },
    [isAuthenticated, user]
  );

  // Check if user can perform a trial spin
  const canPerformTrialSpin = useCallback(() => {
    if (!isAuthenticated) return false;
    // Add additional business logic here:
    // - Check trial spin count
    // - Check cooldown periods
    // - etc.
    return true;
  }, [isAuthenticated]);

  // Handle paid spin business logic
  const handlePaidSpinRequest = useCallback(
    async (
      onSpin: () => void,
      boxPrice: number | string
    ): Promise<"paid" | null> => {
      try {
        // Authentication check first
        if (!isAuthenticated) {
          openAuth("signin");
          return null;
        }

        // Business rule validation
        if (!canPerformPaidSpin(boxPrice)) {
          // If user is authenticated but has insufficient coins, open topup modal
          if (isAuthenticated && user) {
            const validatedPrice = validateDecimalCurrency(boxPrice);
            const userCoins = user.coins || 0;

            if (
              validatedPrice &&
              !hasSufficientBalance(userCoins, validatedPrice)
            ) {
              const requiredAmount = validatedPrice - userCoins;
              openTopup({ initialAmount: Math.max(requiredAmount, 1000) }); // Minimum 1000 coins
              return null;
            }
          }

          toast.error("Үлдэгдэл хүрэлцэхгүй байна");
          return null;
        }

        // Validate box price - ensure it's a valid decimal number
        const validatedPrice = validateDecimalCurrency(boxPrice);
        if (validatedPrice === null || validatedPrice <= 0) {
          console.warn("Invalid box price:", boxPrice);
          return null;
        }
        // after top up balnce, check again
        // Double-check user has sufficient coins with decimal precision
        if (!hasSufficientBalance(user?.coins || 0, validatedPrice)) {
          const userCoins = validateDecimalCurrency(user?.coins || 0) || 0;
          const requiredAmount = validatedPrice - userCoins;

          // Open topup modal with the required amount
          openTopup({ initialAmount: Math.max(requiredAmount, 1000) }); // Minimum 1000 coins

          toast.error(
            `Insufficient coins. You have ${formatCurrency(
              userCoins
            )}, need ${formatCurrency(validatedPrice)}`
          );
          return null;
        }

        // Show loading state
        toast.loading("Processing payment...", { id: "coin-deduction" });

        // Attempt to deduct coins with proper decimal handling
        await updateUserCoins.mutateAsync({
          data: { coins: -validatedPrice },
        });

        // Award experience points for paid spin (100 XP)
        try {
          await updateUserExperience.mutateAsync({
            data: { experiencePoints: 100 },
          });
        } catch (expError) {
          // Log experience error but don't fail the entire transaction
          console.warn("Failed to award experience points:", expError);
        }

        // Success feedback
        toast.success(
          `${formatCurrency(validatedPrice)} deducted successfully`,
          { id: "coin-deduction" }
        );

        // Mark this as a paid spin
        setLastSpinType("paid");

        // All checks passed, perform the spin
        onSpin();

        return "paid";
      } catch (error) {
        // Comprehensive error handling
        console.error("Failed to process paid spin:", error);

        // Dismiss loading toast
        toast.dismiss("coin-deduction");

        // Handle different error types
        if (error instanceof Error) {
          if (error.message.includes("Current user not found")) {
            toast.error("Authentication required. Please log in again");
            openAuth("signin");
          } else if (error.message.includes("insufficient")) {
            toast.error("Insufficient coins for this spin");
          } else if (error.message.includes("network")) {
            toast.error(
              "Network error. Please check your connection and try again"
            );
          } else if (error.message.includes("unauthorized")) {
            toast.error("Session expired. Please log in again");
            openAuth("signin");
          } else {
            toast.error("Failed to process payment. Please try again");
          }
        } else {
          toast.error("An unexpected error occurred. Please try again");
        }

        // Reset spin type on error to prevent inconsistent state
        setLastSpinType(null);
        return null;
      }
    },
    [
      isAuthenticated,
      openAuth,
      openTopup,
      canPerformPaidSpin,
      updateUserCoins,
      updateUserExperience,
      user?.coins,
    ]
  );

  // Handle trial spin business logic
  const handleTrialSpinRequest = useCallback(
    (onSpin: () => void): "trial" | null => {
      if (!isAuthenticated) {
        openAuth("signup"); // Prefer signup for trial users
        return null;
      }

      if (!canPerformTrialSpin()) {
        // Handle business rule violations
        console.warn("Trial spin not allowed due to business rules");
        return null;
      }

      // Mark this as a trial spin
      setLastSpinType("trial");
      // All checks passed, perform the spin
      onSpin();
      return "trial";
    },
    [isAuthenticated, openAuth, canPerformTrialSpin]
  );

  // Handle win with explicit spin type (more robust)
  const handleWinWithType = useCallback(
    async (item: SpiningItem, spinType: "paid" | "trial") => {
      try {
        console.log(
          "Processing win with explicit type:",
          item,
          "Spin type:",
          spinType,
          "Authenticated:",
          isAuthenticated
        );

        // Only process inventory for paid spins and authenticated users
        if (spinType === "paid" && isAuthenticated) {
          // Add item to inventory immediately
          toast.loading(`Adding ${item.name} to inventory...`, {
            id: "add-to-inventory",
          });

          await addItemToInventory.mutateAsync({ itemId: item.id });

          toast.success(`${item.name} added to your inventory!`, {
            id: "add-to-inventory",
          });

          console.log(
            `Item ${item.name} (ID: ${item.id}) successfully added to inventory`
          );
        } else if (spinType === "trial") {
          // For trial spins, show what they would have won
          toast.info(`Trial win: ${item.name}`, {
            description: "Item not added to inventory (trial spin)",
            duration: 3000,
          });
          console.log(`Trial spin win: ${item.name} (not added to inventory)`);
        }

        // Add additional win processing logic here:
        // - Award experience points
        // - Update user statistics
        // - Send analytics events
        // - Achievement checks
        // etc.
      } catch (error) {
        console.error("Failed to process win:", error);

        // Dismiss loading toast
        toast.dismiss("add-to-inventory");

        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes("Current user not found")) {
            toast.error("Authentication required", {
              description: "Please log in to save your items",
            });
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            toast.error("Network error", {
              description: "Failed to save item. Please check your connection.",
            });
          } else {
            toast.error("Failed to save item", {
              description: `Could not add ${item.name} to your inventory`,
            });
          }
        } else {
          toast.error("Unexpected error", {
            description: "An unknown error occurred while saving your win",
          });
        }

        // Log detailed error for debugging
        console.error("Win processing error details:", {
          error,
          item: item.name,
          itemId: item.id,
          spinType,
          isAuthenticated,
          userId: user?.id,
        });
      }
    },
    [isAuthenticated, addItemToInventory, user?.id]
  );

  // Handle win immediately when item is determined (fallback to state-based tracking)
  const handleWin = useCallback(
    async (item: SpiningItem) => {
      try {
        console.log(
          "Processing win:",
          item,
          "Spin type:",
          lastSpinType,
          "Authenticated:",
          isAuthenticated
        );

        // Only process inventory for paid spins and authenticated users
        if (lastSpinType === "paid" && isAuthenticated) {
          // Add item to inventory immediately
          toast.loading(`Adding ${item.name} to inventory...`, {
            id: "add-to-inventory",
          });

          await addItemToInventory.mutateAsync({ itemId: item.id });

          toast.success(`${item.name} added to your inventory!`, {
            id: "add-to-inventory",
          });

          console.log(
            `Item ${item.name} (ID: ${item.id}) successfully added to inventory`
          );
        } else if (lastSpinType === "trial") {
          // For trial spins, show what they would have won
          toast.info(`Trial win: ${item.name}`, {
            description: "Item not added to inventory (trial spin)",
            duration: 3000,
          });
          console.log(`Trial spin win: ${item.name} (not added to inventory)`);
        } else {
          // Debug information for troubleshooting
          console.warn(
            "Win processed but no valid spin type or user not authenticated",
            {
              lastSpinType,
              isAuthenticated,
              item: item.name,
              user: user?.id || "no user",
              timestamp: new Date().toISOString(),
            }
          );

          // If user is authenticated but no spin type, assume it's a paid spin
          // This handles edge cases where spin type might get reset
          if (isAuthenticated && !lastSpinType) {
            console.log(
              "Assuming paid spin due to authenticated user with no spin type"
            );
            toast.loading(`Adding ${item.name} to inventory...`, {
              id: "add-to-inventory",
            });

            await addItemToInventory.mutateAsync({ itemId: item.id });

            toast.success(`${item.name} added to your inventory!`, {
              id: "add-to-inventory",
            });

            console.log(
              `Item ${item.name} (ID: ${item.id}) successfully added to inventory (fallback)`
            );
          }
        }

        // Add additional win processing logic here:
        // - Award experience points
        // - Update user statistics
        // - Send analytics events
        // - Achievement checks
        // etc.
      } catch (error) {
        console.error("Failed to process win:", error);

        // Dismiss loading toast
        toast.dismiss("add-to-inventory");

        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes("Current user not found")) {
            toast.error("Authentication required", {
              description: "Please log in to save your items",
            });
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            toast.error("Network error", {
              description: "Failed to save item. Please check your connection.",
            });
          } else {
            toast.error("Failed to save item", {
              description: `Could not add ${item.name} to your inventory`,
            });
          }
        } else {
          toast.error("Unexpected error", {
            description: "An unknown error occurred while saving your win",
          });
        }

        // Log detailed error for debugging
        console.error("Win processing error details:", {
          error,
          item: item.name,
          itemId: item.id,
          lastSpinType,
          isAuthenticated,
          userId: user?.id,
        });
      }
    },
    [lastSpinType, isAuthenticated, addItemToInventory, user?.id]
  );

  // Handle quick sell business logic
  const handleQuickSell = useCallback(
    async (item: SpiningItem) => {
      try {
        // Only allow quick sell for paid spins
        if (lastSpinType !== "paid") {
          toast.error("Quick sell not available for trial spins");
          return;
        }

        // Validate item and sell value with decimal precision
        const validatedSellValue = validateDecimalCurrency(item.sell_value);
        if (validatedSellValue === null || validatedSellValue <= 0) {
          toast.error("This item cannot be sold");
          return;
        }

        // Authentication check
        if (!isAuthenticated) {
          toast.error("Please log in to sell items");
          openAuth("signin");
          return;
        }

        // Show loading state
        toast.loading(`Selling ${item.name}...`, { id: "quick-sell" });

        // Ensure mutation is available (user is authenticated)
        if (!updateUserCoins.mutateAsync) {
          toast.error("Authentication required. Please log in again");
          openAuth("signin");
          return;
        }

        // Add coins for the sale with proper decimal handling
        await updateUserCoins.mutateAsync({
          data: { coins: validatedSellValue },
        });

        // Remove item from inventory since it was sold
        await removeItemFromInventory.mutateAsync({
          itemId: item.id,
        });

        // Success feedback
        toast.success(
          `Sold ${item.name} for ${formatCurrency(validatedSellValue)}`,
          { id: "quick-sell" }
        );

        console.log("Quick sell completed:", {
          item: item.name,
          itemId: item.id,
          sellValue: formatCurrency(validatedSellValue),
          removedFromInventory: true,
        });
      } catch (error) {
        // Error handling
        console.error("Failed to process quick sell:", error);

        // Dismiss loading toast
        toast.dismiss("quick-sell");

        if (error instanceof Error) {
          if (error.message.includes("Current user not found")) {
            toast.error("Authentication required. Please log in again");
            openAuth("signin");
          } else if (error.message.includes("network")) {
            toast.error("Network error. Please try again");
          } else if (error.message.includes("unauthorized")) {
            toast.error("Session expired. Please log in again");
            openAuth("signin");
          } else {
            toast.error("Failed to sell item. Please try again");
          }
        } else {
          toast.error("An unexpected error occurred during sale");
        }
      }
    },
    [
      lastSpinType,
      isAuthenticated,
      updateUserCoins,
      removeItemFromInventory,
      openAuth,
    ]
  );

  // Check if quick sell is allowed for the current win
  const canQuickSell = useCallback(() => {
    return lastSpinType === "paid";
  }, [lastSpinType]);

  // Reset spin type when winner is dismissed
  const resetSpinType = useCallback(() => {
    setLastSpinType(null);
  }, []);

  return {
    // Authentication state
    isAuthenticated,
    isAuthLoading,
    user,

    // Business logic handlers
    handlePaidSpinRequest,
    handleTrialSpinRequest,
    handleWin, // Primary win handler - call when item is determined
    handleWinWithType, // More robust win handler with explicit spin type
    handleQuickSell,
    resetSpinType,

    // Business rule checks
    canPerformPaidSpin,
    canPerformTrialSpin: canPerformTrialSpin(),
    canQuickSell: canQuickSell(),
    lastSpinType,
  };
};
