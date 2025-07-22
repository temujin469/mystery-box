import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinReelController from "./SpinReelController";
import { useSpinningReelStore } from "@/stores/spinningReel.store";
import { toast } from "sonner";

// Types
export interface SpiningItem {
  id: number;
  name: string;
  image_url: string;
  drop_rate: number;
  sell_value: number;
}

// Constants
const ITEM_WIDTH = 170;
const ITEM_HALF_WIDTH = ITEM_WIDTH / 2;

// Spin configuration - optimized for performance
const SPIN_CONFIG = {
  minSpins: 2,
  maxSpins: 4,
  duration: 2500, // Reduced for faster spins
  baseVelocity: 1000,
  deceleration: 0.2,
  minSearchDistance: 6,
  bufferZone: 0.25, // Reduced buffer zone
  hysteresis: 0.03,
};

// Performance configuration
const PERFORMANCE_CONFIG = {
  maxReelItems: 150, // Limit reel size
  throttleDelay: 16, // 60fps
  reducedMotion: false,
  audioPoolSize: 3, // Smaller audio pool
};

// Helper functions - optimized for performance
function pickItem(items: SpiningItem[], rand: number): SpiningItem {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.drop_rate;
    if (rand < cumulative) return item;
  }
  return items[items.length - 1];
}

// Optimized infinite reel builder
function buildInfiniteReel(
  items: SpiningItem[],
  containerWidth: number
): SpiningItem[] {
  if (items.length === 0) return [];

  const itemsPerScreen = Math.ceil(containerWidth / ITEM_WIDTH);

  // Optimized buffer calculation for better performance
  const totalScreens = Math.min(12, itemsPerScreen * 4); // Reduced screens
  const totalItems = Math.min(
    PERFORMANCE_CONFIG.maxReelItems,
    itemsPerScreen * totalScreens
  );

  // Create optimized sequence
  const sequence: SpiningItem[] = [];
  for (let i = 0; i < totalItems; i++) {
    sequence.push(items[i % items.length]);
  }

  return sequence;
}

function getInfiniteIndex(
  index: number,
  totalItems: number,
  originalLength: number
): number {
  // Map any index to the equivalent position in the original items array
  return ((index % originalLength) + originalLength) % originalLength;
}

// Performance monitoring for infinite reel
function useReelMetrics() {
  const metricsRef = useRef({
    resets: 0,
    lastResetTime: 0,
    averageResetInterval: 0,
  });

  const recordReset = useCallback(() => {
    const now = performance.now();
    const metrics = metricsRef.current;

    if (metrics.lastResetTime > 0) {
      const interval = now - metrics.lastResetTime;
      metrics.averageResetInterval =
        (metrics.averageResetInterval * metrics.resets + interval) /
        (metrics.resets + 1);
    }

    metrics.resets++;
    metrics.lastResetTime = now;
  }, []);

  return { recordReset, metrics: metricsRef.current };
}

// Optimized tick sound hook with reduced audio pool
function useTickSound(url: string) {
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const poolIndexRef = useRef(0);

  useEffect(() => {
    // Smaller audio pool for better performance
    const pool = Array.from(
      { length: PERFORMANCE_CONFIG.audioPoolSize },
      () => {
        const audio = new Audio(url);
        audio.volume = 0.4; // Reduced volume
        audio.preload = "auto";
        return audio;
      }
    );
    audioPoolRef.current = pool;
    tickRef.current = pool[0];

    return () => {
      pool.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioPoolRef.current = [];
      tickRef.current = null;
    };
  }, [url]);

  const play = useCallback((rate: number) => {
    if (PERFORMANCE_CONFIG.reducedMotion) return;

    const pool = audioPoolRef.current;
    if (pool.length === 0) return;

    const audio = pool[poolIndexRef.current];
    poolIndexRef.current = (poolIndexRef.current + 1) % pool.length;

    audio.currentTime = 0;
    audio.playbackRate = Math.max(0.7, Math.min(2, rate)); // Reduced range
    audio.play().catch(() => {});
  }, []);

  return { play };
}

// Optimized general sound hook
function useSound(url: string, { volume = 1 } = {}) {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio(url);
    soundRef.current.volume = volume;
    soundRef.current.preload = "auto";
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.src = "";
        soundRef.current = null;
      }
    };
  }, [url, volume]);

  const play = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {}); // Ignore play errors
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}

const SpinningReel: React.FC<{
  items: SpiningItem[];
  boxPrice: number;
}> = ({ items, boxPrice }) => {
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get winner and spin type from store
  const winner = useSpinningReelStore((state) => state.winnerItem);
  const lastSpinType = useSpinningReelStore((state) => state.lastSpinType);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Calculate reel and initial position after mount
  const [reel, setReel] = useState<SpiningItem[]>([]);
  const [finalTranslate, setFinalTranslate] = useState<number>(0);
  const [centeredIndex, setCenteredIndex] = useState<number>(0);

  // Performance monitoring
  const { recordReset } = useReelMetrics();

  // Initialize reel with proper positioning
  useEffect(() => {
    if (containerRef.current && items.length > 0 && !isInitialized) {
      // Calculate reel data directly here instead of relying on memoized version
      const containerWidth = containerRef.current.offsetWidth;
      const newReel = buildInfiniteReel(items, containerWidth);
      const initialCenter = Math.floor(newReel.length / 2);

      if (newReel.length > 0) {
        setReel(newReel);
        setCenteredIndex(initialCenter);

        // Set initial translate to center the initial item
        const containerCenter = containerWidth / 2;
        const initialCenterOffset =
          initialCenter * ITEM_WIDTH + ITEM_HALF_WIDTH;
        const initialTranslate = containerCenter - initialCenterOffset;
        setFinalTranslate(initialTranslate);

        setIsInitialized(true);
      }
    }
  }, [items, isInitialized]); // Remove reelData dependency

  // Sound effects
  const { play: playTick } = useTickSound("/sound/wood-spin.mp3");
  const { play: playWin } = useSound("/sound/won.mp3", { volume: 0.5 });

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Handle container resize - with CSS centering, just need to update centered index
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && !spinning && isInitialized) {
        // With CSS centering, no need to recalculate translate
        // The CSS will automatically keep the item centered
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [spinning, isInitialized]);

  // Optimized tick sound logic
  const lastIndexRef = useRef<number | null>(null);
  const minPlaybackRate = 0.8;
  const maxPlaybackRate = 2.5;

  // Optimized motion updates with RAF throttling
  const handleUpdate = useCallback(
    (latest: { x: number }) => {
      if (!containerRef.current || reel.length === 0) return;

      // Use RAF for smoother performance
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      const updateLogic = () => {
        // Throttle updates
        const now = performance.now();
        if (now - lastTickTimeRef.current < PERFORMANCE_CONFIG.throttleDelay)
          return;
        lastTickTimeRef.current = now;

        const containerWidth = containerRef.current!.offsetWidth;
        const containerCenter = containerWidth / 2;

        let newCenteredIndex: number;

        if (spinning) {
          // Optimized center calculation during spinning
          const totalReelOffset = latest.x;
          let closestIndex = centeredIndex;
          let minDistance = Infinity;

          // Only check nearby items for performance (reduced search range)
          const searchRange = Math.min(8, reel.length);
          const startIndex = Math.max(0, centeredIndex - searchRange);
          const endIndex = Math.min(reel.length, centeredIndex + searchRange);

          for (let i = startIndex; i < endIndex; i++) {
            const itemScreenPosition =
              i * ITEM_WIDTH + ITEM_HALF_WIDTH + totalReelOffset;
            const distanceFromCenter = Math.abs(
              itemScreenPosition - containerCenter
            );

            if (distanceFromCenter < minDistance) {
              minDistance = distanceFromCenter;
              closestIndex = i;
            }
          }

          newCenteredIndex = closestIndex;
        } else {
          newCenteredIndex = centeredIndex;
        }

        // Update centered index only if it changed significantly
        if (Math.abs(newCenteredIndex - centeredIndex) >= 1) {
          setCenteredIndex(newCenteredIndex);

          // Optimized tick sound during spinning
          if (spinning && newCenteredIndex !== lastIndexRef.current) {
            const speed = Math.abs(
              newCenteredIndex - (lastIndexRef.current || newCenteredIndex)
            );
            const normalizedSpeed = Math.min(speed / 2, 1);
            const rate =
              minPlaybackRate +
              normalizedSpeed * (maxPlaybackRate - minPlaybackRate);

            // Skip some ticks for better performance
            if (Math.random() > 0.4) {
              // Only play 60% of ticks
              playTick(rate);
            }
            lastIndexRef.current = newCenteredIndex;
          }
        }
      };

      rafIdRef.current = requestAnimationFrame(updateLogic);
    },
    [spinning, centeredIndex, playTick, reel.length]
  );

  // Optimized infinite scroll reset
  useEffect(() => {
    if (
      !spinning &&
      !winner &&
      isInitialized &&
      reel.length > 0 &&
      containerRef.current
    ) {
      const reelCenter = Math.floor(reel.length / 2);
      const currentDistance = Math.abs(centeredIndex - reelCenter);

      // Reduced reset frequency for better performance
      const maxDistance = Math.floor(reel.length * SPIN_CONFIG.bufferZone);

      if (currentDistance > maxDistance) {
        // Find the same item near the center (reduced search range)
        const originalItemIndex = getInfiniteIndex(
          centeredIndex,
          reel.length,
          items.length
        );

        for (let i = reelCenter - 8; i < reelCenter + 8; i++) {
          if (i >= 0 && i < reel.length) {
            const itemAtIndex = getInfiniteIndex(i, reel.length, items.length);
            if (itemAtIndex === originalItemIndex) {
              setCenteredIndex(i);

              // Recalculate proper translate for the new position
              const containerWidth = containerRef.current.offsetWidth;
              const containerCenter = containerWidth / 2;
              const newCenterOffset = i * ITEM_WIDTH + ITEM_HALF_WIDTH;
              const newTranslate = containerCenter - newCenterOffset;
              setFinalTranslate(newTranslate);

              recordReset();
              break;
            }
          }
        }
      }
    }
  }, [
    spinning,
    centeredIndex,
    isInitialized,
    reel.length,
    items.length,
    winner,
    recordReset,
  ]);

  const spin = useCallback(
    async (winnerItem: SpiningItem | null, spinType: "paid" | "trial") => {
      if (spinning || !containerRef.current || reel.length === 0) return;

      console.log("🎰 Spin function called with:", {
        winnerItem: winnerItem?.name,
        spinType,
      });

      let winItem: SpiningItem;

      // Winner selection based on spin type and provided data
      if (spinType === "trial") {
        // For trial spins, pick winner internally based on drop rates
        const rand = Math.random();
        winItem = pickItem(items, rand);
        console.log(
          "🎰 Trial spin - winner selected internally:",
          winItem.name
        );
      } else if (spinType === "paid") {
        // For paid spins, use the winner item passed from the API call
        if (winnerItem) {
          winItem = winnerItem;
          console.log("🎰 Paid spin - using API winner:", winItem.name);
        } else {
          // This should not happen in normal flow
          console.error("🎰 Paid spin but no winner item provided!");
          toast.error("Error: No winner item provided for paid spin");
          return;
        }
      } else {
        // This should not happen - only trial or paid spins are allowed
        console.error("🎰 Invalid spin type:", spinType);
        toast.error("Error: Invalid spin type. Please try again.");
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const itemsPerScreen = Math.ceil(containerWidth / ITEM_WIDTH);

      // Calculate forward-only spinning distance
      const currentPosition = centeredIndex;
      const minSpinDistance = itemsPerScreen * SPIN_CONFIG.minSpins;
      const maxSpinDistance = itemsPerScreen * SPIN_CONFIG.maxSpins;

      // Find winner position ahead of current position
      const winnerItemIndex = items.findIndex((item) => item.id === winItem.id);
      let winnerPosition = -1;

      // Search for winner starting from minimum spin distance
      for (
        let i = currentPosition + minSpinDistance;
        i < currentPosition + maxSpinDistance && i < reel.length - 5;
        i++
      ) {
        const itemAtPosition = getInfiniteIndex(i, reel.length, items.length);
        if (itemAtPosition === winnerItemIndex) {
          winnerPosition = i;
          break;
        }
      }

      // If not found in preferred range, calculate exact position
      if (winnerPosition === -1) {
        const startSearchPosition = currentPosition + minSpinDistance;
        const currentItemIndex = getInfiniteIndex(
          startSearchPosition,
          reel.length,
          items.length
        );

        let itemsToAdvance: number;
        if (winnerItemIndex >= currentItemIndex) {
          itemsToAdvance = winnerItemIndex - currentItemIndex;
        } else {
          itemsToAdvance = items.length - currentItemIndex + winnerItemIndex;
        }

        winnerPosition = Math.min(
          startSearchPosition + itemsToAdvance,
          reel.length - 5
        );
      }

      // Calculate the final translation needed to center the winner
      const finalCenterOffset = winnerPosition * ITEM_WIDTH + ITEM_HALF_WIDTH;
      const containerCenter = containerWidth / 2;
      const finalTranslateValue = containerCenter - finalCenterOffset;

      console.log("🎰 Spinning to winner:", {
        winner: winItem.name,
        spinType: spinType,
        currentPos: currentPosition,
        winnerPos: winnerPosition,
        distance: winnerPosition - currentPosition,
        finalTranslate: finalTranslateValue,
      });

      // Start spinning animation
      setSpinning(true);
      setSpinCount((c) => c + 1);
      setFinalTranslate(finalTranslateValue);

      // Complete spin and set final state
      setTimeout(() => {
        setSpinning(false);
        setCenteredIndex(winnerPosition);
        // Keep the final translate to maintain winner position

        setTimeout(() => {
          // Set the winner item in the store for display
          useSpinningReelStore.getState().setWinnerItem(winItem);
          playWin();
        }, 100);
      }, SPIN_CONFIG.duration);
    },
    [spinning, items, reel, playWin, finalTranslate, centeredIndex]
  );

  // Handler for resetting winner state - maintain proper positioning
  const handleResetWinner = useCallback(() => {
    useSpinningReelStore.getState().setWinnerItem(null);

    // Recalculate proper centering for current position
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerCenter = containerWidth / 2;
      const currentCenterOffset = centeredIndex * ITEM_WIDTH + ITEM_HALF_WIDTH;
      const newTranslate = containerCenter - currentCenterOffset;
      setFinalTranslate(newTranslate);
    }
  }, [centeredIndex]);

  // Casino-style easing - starts fast, gradually slows down naturally
  const casinoSpinEasing: [number, number, number, number] = [
    0.25, 0.1, 0.25, 1.0,
  ]; // More realistic deceleration

  // Don't render the reel until it's properly initialized
  if (!isInitialized || reel.length === 0 || items.length === 0) {
    return (
      <div className="w-full relative">
        {/* Gaming Background Container - Match actual reel styling */}
        <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-black pt-4 pb-6 border-t-1 border-b-1 border-gray-700/50 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl" />
            <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 left-8 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 right-8 w-18 h-18 bg-pink-500/20 rounded-full blur-xl" />
          </div>

          {/* Circuit Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Loading Frame - Match actual reel container */}
          <div
            ref={containerRef}
            className="relative w-full mx-auto overflow-hidden border-t-2 border-b-2 border-gray-600/50 shadow-2xl h-[280px] flex items-center justify-center"
            style={{
              contain: "layout style paint",
              backgroundImage: `
                linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.9) 100%),
                url('/img/skulls.png')
              `,
              backgroundSize: "cover, 200px 200px",
            }}
          >
            {/* Loading Animation */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin mx-auto"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                />
              </div>
              <div className="text-cyan-400 font-mono text-sm mb-2">
                СИСТЕМ ЭХЭЛЖ БАЙНА
              </div>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>

          {/* Gaming HUD Bottom Info - Match actual reel */}
          <div className="mt-4 flex justify-between items-center text-xs px-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 font-mono">АЧААЛЖ БАЙНА...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-mono">Төлөв: </span>
              <span className="text-yellow-400 font-mono">ЭХЭЛЖ БАЙНА</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Gaming Background Container */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-black pt-4 pb-6 border-t-1 border-b-1 border-gray-700/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl" />
          <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-8 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-8 w-18 h-18 bg-pink-500/20 rounded-full blur-xl" />
        </div>

        {/* Circuit Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Enhanced Reel Container */}
        <div
          ref={containerRef}
          className="relative w-full mx-auto overflow-hidden border-t-2 border-b-2 border-gray-600/50 shadow-2xl"
          style={{
            contain: "layout style paint",
            backgroundImage: `
              linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.9) 100%),
              url('/img/skulls.png')
            `,
            backgroundSize: "cover, 200px 200px",
          }}
        >
          {/* Enhanced Center Glow Effect */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10 transition-all duration-500 ${
              spinning
                ? "w-32 h-48 bg-gradient-to-r from-cyan-400/40 via-blue-500/50 to-purple-500/40 blur-3xl scale-125"
                : "w-24 h-40 bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-purple-500/30 blur-2xl scale-100"
            }`}
          />

          {/* Enhanced Spinning Reel */}
          <div className="h-[280px] relative">
            {/* Simple Triangle Pointers */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-30">
              <div className="w-6 h-6 bg-cyan-400 clip-path-triangle rotate-180" />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-30">
              <div className="w-6 h-6 bg-cyan-400 clip-path-triangle" />
            </div>

            <motion.div
              key={spinCount}
              className="flex items-center absolute top-1/2 -translate-y-1/2"
              style={{
                width: `${reel.length * ITEM_WIDTH}px`,
                willChange: "transform",
                // Use consistent positioning - always start from left edge
                left: 0,
              }}
              animate={{
                x: finalTranslate,
              }}
              transition={{
                duration: spinning ? SPIN_CONFIG.duration / 1000 : 0.3,
                ease: spinning ? casinoSpinEasing : "easeOut",
                type: "tween",
              }}
              drag={false}
              onUpdate={handleUpdate}
            >
              {reel.map((item: SpiningItem, idx: number) => {
                const isCenter = idx === centeredIndex;
                const originalIndex = getInfiniteIndex(
                  idx,
                  reel.length,
                  items.length
                );
                const originalItem = items[originalIndex];

                // Calculate distance from center for progressive blur effect
                const distanceFromCenter = Math.abs(idx - centeredIndex);
                const blurIntensity = spinning
                  ? Math.min(distanceFromCenter * 1.2, 6) // More dramatic blur during spinning
                  : isCenter
                  ? 0
                  : Math.min(distanceFromCenter * 0.4, 3); // Subtle blur when stopped

                // Enhanced spinning effects with more dramatic scaling
                const spinningOpacity = spinning
                  ? isCenter
                    ? 1
                    : Math.max(0.2, 1 - distanceFromCenter * 0.2)
                  : isCenter
                  ? 1
                  : 0.7;

                const spinningScale = spinning
                  ? isCenter
                    ? 1.1 // Bigger center item during spinning
                    : Math.max(0.6, 1 - distanceFromCenter * 0.08)
                  : isCenter
                  ? 1.05 // Slightly bigger when centered and stopped
                  : 0.9;

                // Rarity-based effects
                const getRarityGlow = (sellValue: number) => {
                  if (sellValue >= 50000)
                    return "drop-shadow-[0_0_20px_#fbbf24]"; // Legendary
                  if (sellValue >= 10000)
                    return "drop-shadow-[0_0_15px_#a855f7]"; // Epic
                  if (sellValue >= 5000)
                    return "drop-shadow-[0_0_12px_#3b82f6]"; // Rare
                  return "drop-shadow-[0_0_8px_#22d3ee]"; // Common
                };

                return (
                  <div
                    key={`${idx}-${item.id}`}
                    className={`flex flex-col items-center justify-center h-full transition-all duration-300 relative ${
                      isCenter
                        ? `${getRarityGlow(
                            originalItem.sell_value || 0
                          )} brightness-110 z-10`
                        : "grayscale-50"
                    }`}
                    style={{
                      width: ITEM_WIDTH,
                      transform: `translateZ(0) scale(${spinningScale})`, // Force GPU acceleration with scale
                      filter: `blur(${blurIntensity}px) ${
                        spinning
                          ? "brightness(0.7) saturate(1.2)"
                          : "brightness(1) saturate(1)"
                      }`,
                      opacity: spinningOpacity,
                    }}
                  >
                    {/* Gaming-style item container */}
                    <div
                      className={`relative p-3 rounded-xl transition-all duration-300 ${
                        isCenter
                          ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-cyan-400/50"
                          : "bg-gray-800/40"
                      }`}
                    >
                      {/* Item Image with enhanced effects */}
                      <div className="relative">
                        <img
                          src={originalItem.image_url}
                          alt={originalItem.name}
                          className="w-24 h-24 object-contain pointer-events-none select-none relative z-10"
                          draggable={false}
                          loading="lazy"
                        />

                        {/* Holographic effect for rare items */}
                        {isCenter &&
                          (originalItem.sell_value || 0) >= 10000 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-cyan-400/20 rounded-lg" />
                          )}
                      </div>
                    </div>

                    {/* Spinning trail effect */}
                    {spinning && Math.abs(idx - centeredIndex) <= 2 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Gaming HUD Bottom Info */}
        <div className="mt-4 flex justify-between items-center text-xs px-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-blue-400 font-mono">Алгоритм</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-mono">Төлөв: </span>
            <span
              className={`font-mono ${
                spinning
                  ? "text-yellow-400"
                  : winner
                  ? "text-green-400"
                  : "text-cyan-400"
              }`}
            >
              {spinning ? "Эргэж байна" : winner ? "Дууссан" : "Бэлэн"}
            </span>
          </div>
        </div>
      </div>

      <SpinReelController
        spinning={spinning}
        onSpin={spin}
        onResetWinner={handleResetWinner}
      />
    </div>
  );
};

export default SpinningReel;
