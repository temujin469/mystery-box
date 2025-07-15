import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define modal types
export type ModalType = "auth" | "confirmation" | "topup" | null;

// Define modal data interfaces
export interface AuthModalData {
  variant: "signin" | "signup";
}

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface TopupModalData {
  // Optional initial amount
  initialAmount?: number;
}

// Union type for all modal data
export type ModalData = AuthModalData | ConfirmationModalData | TopupModalData | null;

// Modal store state interface
interface ModalState {
  type: ModalType;
  isOpen: boolean;
  data: ModalData;

  // Actions
  openAuth: (variant: "signin" | "signup") => void;
  openConfirmation: (config: ConfirmationModalData) => void;
  openTopup: (config?: TopupModalData) => void;
  closeModal: () => void;
}

// Create the modal store
export const useModalStore = create<ModalState>()(
    devtools(
  (set) => ({
    // Initial state
    type: null,
    isOpen: false,
    data: null,

    // Actions
    openAuth: (variant) => {
      set({
        type: "auth",
        isOpen: true,
        data: { variant },
      });
    },

    openConfirmation: (config) => {
      set({
        type: "confirmation",
        isOpen: true,
        data: config,
      });
    },

    openTopup: (config = {}) => {
      set({
        type: "topup",
        isOpen: true,
        data: config,
      });
    },

    closeModal: () => {
      set({
        type: null,
        isOpen: false,
        data: null,
      });
    },
  }),
      {
        name: "modal-store",
        enabled: process.env.NODE_ENV === "development",
      }
    )
);

// // Simple selector hooks. this cause error by creating a new object every time the hook runs
// export const useModalActions = () =>
//   useModalStore((state) => ({
//     openAuth: state.openAuth,
//     openConfirmation: state.openConfirmation,
//     closeModal: state.closeModal,
//   }));

// export const useModalState = () =>
//   useModalStore((state) => ({
//     type: state.type,
//     isOpen: state.isOpen,
//     data: state.data,
//   }));
