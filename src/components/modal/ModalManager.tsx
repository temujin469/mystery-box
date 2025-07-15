"use client";

import { useModalStore } from "@/stores/modal.store";
import AuthModal from "./AuthModal";
import { TopUpModal } from "./TopUpModal";

/**
 * Global modal manager - renders modals based on global state
 */
export function ModalManager() {

const {type, isOpen, data, closeModal} = useModalStore((state)=>state);

  if (!isOpen || !type) return null;

  switch (type) {
    case "auth":
      const authData = data as { variant: "signin" | "signup" } | null;
      return (
        <AuthModal
          open={isOpen}
          onOpenChange={(open) => !open && closeModal()}
          variant={authData?.variant || "signup"}
        />
      );

    case "topup":
      const topupData = data as { initialAmount?: number } | null;
      return (
        <TopUpModal
          open={isOpen}
          onOpenChange={(open) => !open && closeModal()}
          data={topupData || undefined}
        />
      );

    case "confirmation":
      // TODO: Implement confirmation modal
      return null;

    default:
      return null;
  }
}
