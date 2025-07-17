import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define spinning item type
export interface SpiningItem {
  id: number;
  name: string;
  image_url: string;
  drop_rate: number;
  sell_value: number;
}

// Define spin types
export type SpinType = "paid" | "trial" | null;

// Define business logic states
interface SpinBusinessState {
  // Box tracking
  boxId: number | null;

  // Spin tracking
  lastSpinType: SpinType;

  // Spin results
  winnerItem: SpiningItem | null; // Winner item from API response

  // Quick sell eligibility (based on spin type)
  canQuickSell: boolean;
}

// Define actions interface
interface SpinActions {
  // Box management
  setBoxId: (boxId: number | null) => void;

  // Spin type management
  setLastSpinType: (type: SpinType) => void;
  resetSpinType: () => void;

  // Spin execution - simplified for business logic only
  startSpin: (type: SpinType) => void;
  completeSpin: (winnerItem: SpiningItem) => void;

  // Winner management
  setWinnerItem: (winnerItem: SpiningItem | null) => void;
  resetWinner: () => void;

  // Quick sell management
  setCanQuickSell: (canSell: boolean) => void;

  // Reset all states
  resetAllStates: () => void;
}

// Combined store interface
interface SpinningReelStore extends SpinBusinessState, SpinActions {}

// Initial state
const initialState: SpinBusinessState = {
  // Box tracking
  boxId: null,

  // Spin tracking
  lastSpinType: null,

  // Spin results
  winnerItem: null,

  // Quick sell eligibility
  canQuickSell: false,
};

// Create the spinning reel store
export const useSpinningReelStore = create<SpinningReelStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Box management
      setBoxId: (boxId) => {
        set({ boxId }, false, "setBoxId");
      },

      // Spin type management
      setLastSpinType: (type) => {
        set(
          (state) => ({
            lastSpinType: type,
            // Update quick sell eligibility based on spin type
            canQuickSell: type === "paid",
          }),
          false,
          "setLastSpinType"
        );
      },

      resetSpinType: () => {
        set(
          {
            lastSpinType: null,
            canQuickSell: false,
          },
          false,
          "resetSpinType"
        );
      },

      // Spin execution - simplified to just track spin type
      startSpin: (type) => {
        set(
          {
            lastSpinType: type,
            winnerItem: null,
            canQuickSell: type === "paid",
          },
          false,
          "startSpin"
        );
      },

      completeSpin: (winnerItem) => {
        set(
          {
            winnerItem,
          },
          false,
          "completeSpin"
        );
      },

      // Winner management
      setWinnerItem: (winnerItem) => {
        set({ winnerItem }, false, "setWinnerItem");
      },

      resetWinner: () => {
        set(
          {
            winnerItem: null,
          },
          false,
          "resetWinner"
        );
      },

      // Quick sell management
      setCanQuickSell: (canSell) => {
        set({ canQuickSell: canSell }, false, "setCanQuickSell");
      },

      // Reset all states
      resetAllStates: () => {
        set(initialState, false, "resetAllStates");
      },
    }),
    {
      name: "spinning-reel-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// those causes errors in the store, so we keep them commented out for now
// Selector hooks for optimized re-renders
// export const useSpinState = () =>
//   useSpinningReelStore((state) => ({
//     boxId: state.boxId,
//     winnerItem: state.winnerItem,
//     lastSpinType: state.lastSpinType,
//     canQuickSell: state.canQuickSell,
//   }));

// export const useSpinActions = () =>
//   useSpinningReelStore((state) => ({
//     setBoxId: state.setBoxId,
//     startSpin: state.startSpin,
//     completeSpin: state.completeSpin,
//     resetWinner: state.resetWinner,
//     resetSpinType: state.resetSpinType,
//     setCanQuickSell: state.setCanQuickSell,
//     setWinnerItem: state.setWinnerItem,
//   }));
