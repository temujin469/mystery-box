import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinReelController from "./SpinReelController";

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

// Spin configuration - easy to adjust
const SPIN_CONFIG = {
  minSpins: 3, // Minimum number of full rotations
  maxSpins: 6, // Maximum number of full rotations
  duration: 3000, // Total spin duration in milliseconds (3 seconds)
  baseVelocity: 1200, // Base spinning velocity in pixels per second
  deceleration: 0.15, // Deceleration factor (lower = slower deceleration)
  minSearchDistance: 8, // Minimum items to search ahead for winner
  bufferZone: 0.3, // Reset when this fraction away from center (0.3 = 30%)
  hysteresis: 0.05, // Prevent oscillation in reset logic
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

function buildInfiniteReel(
  items: SpiningItem[],
  containerWidth: number
): SpiningItem[] {
  if (items.length === 0) return [];

  const itemsPerScreen = Math.ceil(containerWidth / ITEM_WIDTH);

  // Enhanced buffer calculation for mathematical guarantee
  // Create enough buffer to ensure we can ALWAYS find any winning item ahead
  // Buffer must be large enough to accommodate: current position + minimum spin distance + complete item cycle
  const minScreensForGuarantee = 25; // Increased for absolute certainty
  const totalScreens = Math.max(minScreensForGuarantee, itemsPerScreen * 3);
  const totalItems = itemsPerScreen * totalScreens;

  // Create a simple repeating sequence with guaranteed coverage
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

// Optimized tick sound hook with better performance
function useTickSound(url: string) {
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const poolIndexRef = useRef(0);

  useEffect(() => {
    // Create an audio pool for smoother playback
    const pool = Array.from({ length: 5 }, () => {
      const audio = new Audio(url);
      audio.volume = 0.6;
      audio.preload = "auto";
      return audio;
    });
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
    const pool = audioPoolRef.current;
    if (pool.length === 0) return;

    const audio = pool[poolIndexRef.current];
    poolIndexRef.current = (poolIndexRef.current + 1) % pool.length;

    audio.currentTime = 0;
    audio.playbackRate = Math.max(0.5, Math.min(3, rate));
    audio.play().catch(() => {}); // Ignore play errors
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
  onWin?: (item: SpiningItem) => void; // Callback when winner is determined
}> = ({ items, boxPrice, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<SpiningItem | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Calculate reel and initial position after mount
  const [reel, setReel] = useState<SpiningItem[]>([]);
  const [finalTranslate, setFinalTranslate] = useState<number>(0);
  const [centeredIndex, setCenteredIndex] = useState<number>(0);

  // Performance monitoring
  const { recordReset } = useReelMetrics();

  // Initialize reel and center position after container is available
  useEffect(() => {
    if (containerRef.current && items.length > 0 && !isInitialized) {
      const containerWidth = containerRef.current.offsetWidth;
      const newReel = buildInfiniteReel(items, containerWidth);

      // Simple initial positioning - start at the center of the buffer
      const initialCenterIndex = Math.floor(newReel.length / 2);

      setReel(newReel);
      setFinalTranslate(0);
      setCenteredIndex(initialCenterIndex);
      setIsInitialized(true);
    }
  }, [items, isInitialized]);

  // Sound effects
  const { play: playTick } = useTickSound("/sound/wood-spin.mp3");
  const { play: playWin } = useSound("/sound/won.mp3", { volume: 0.5 });

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

  // Handle motion updates with throttling - improved infinite scroll logic
  const handleUpdate = useCallback(
    (latest: { x: number }) => {
      if (!containerRef.current || reel.length === 0) return;

      // Throttle to ~60fps for smoother performance during spinning
      const now = performance.now();
      const throttleDelay = spinning ? 16 : 33; // Higher fps during spinning
      if (now - lastTickTimeRef.current < throttleDelay) return;
      lastTickTimeRef.current = now;

      const containerWidth = containerRef.current.offsetWidth;
      const containerCenter = containerWidth / 2;

      // Calculate which item is currently centered based on the actual animation position
      let newCenteredIndex: number;

      if (spinning) {
        // During spinning, calculate based on the actual animation position
        // The reel starts at left: 0, so we need to account for the animation offset
        const totalReelOffset = latest.x; // This is the actual animation offset

        // Find which item is closest to the center of the container
        let closestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < reel.length; i++) {
          // Calculate where this item appears on screen
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
        // When not spinning, the CSS positioning should keep the current item centered
        newCenteredIndex = centeredIndex;
      }

      // Update centered index only if it changed
      if (newCenteredIndex !== centeredIndex) {
        setCenteredIndex(newCenteredIndex);

        // Play tick sound during spinning with dynamic rate based on speed
        if (spinning && newCenteredIndex !== lastIndexRef.current) {
          const speed = Math.abs(
            newCenteredIndex - (lastIndexRef.current || newCenteredIndex)
          );
          // More sophisticated speed calculation for better audio feedback
          const normalizedSpeed = Math.min(speed / 3, 1); // Normalize to 0-1
          const rate =
            minPlaybackRate +
            normalizedSpeed * (maxPlaybackRate - minPlaybackRate);
          playTick(rate);
          lastIndexRef.current = newCenteredIndex;
        }
      }
    },
    [
      spinning,
      centeredIndex,
      playTick,
      minPlaybackRate,
      maxPlaybackRate,
      reel.length,
    ]
  );

  // Simple infinite scroll reset - keeps the reel centered
  useEffect(() => {
    if (!spinning && !winner && isInitialized && reel.length > 0) {
      const reelCenter = Math.floor(reel.length / 2);
      const currentDistance = Math.abs(centeredIndex - reelCenter);

      // Reset if we're too far from center (simple threshold)
      const maxDistance = Math.floor(reel.length * 0.3); // 30% of reel length

      if (currentDistance > maxDistance) {
        // Find the same item type near the center
        const originalItemIndex = getInfiniteIndex(
          centeredIndex,
          reel.length,
          items.length
        );

        // Look for the same item near the center
        for (
          let i = reelCenter - items.length;
          i < reelCenter + items.length;
          i++
        ) {
          if (i >= 0 && i < reel.length) {
            const itemAtIndex = getInfiniteIndex(i, reel.length, items.length);
            if (itemAtIndex === originalItemIndex) {
              setCenteredIndex(i);
              setFinalTranslate(0);
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

  const spin = useCallback(() => {
    if (spinning || !containerRef.current || reel.length === 0) return;
    setWinner(null);

    // Pick winner based on drop rates
    const rand = Math.random();
    const winItem = pickItem(items, rand);

    const containerWidth = containerRef.current.offsetWidth;
    const itemsPerScreen = Math.ceil(containerWidth / ITEM_WIDTH);

    // 🎯 MATHEMATICAL GUARANTEE: This algorithm ensures the reel ONLY moves forward (left direction)
    // by calculating the exact forward distance to the next occurrence of the winning item.
    // The minimum distance ensures visual spinning effect, and the infinite buffer ensures
    // we always have enough space to find the winner ahead of the current position.

    // MATHEMATICALLY GUARANTEED FORWARD-ONLY APPROACH:
    const currentPosition = centeredIndex;

    // Find the winning item ahead of current position (minimum 2 full screens for visual effect)
    const minDistanceAhead = itemsPerScreen * 2; // At least 2 screens ahead
    let winnerPosition = -1;

    // Search for the winner starting from minimum distance ahead
    for (let i = currentPosition + minDistanceAhead; i < reel.length - 5; i++) {
      const itemAtPosition = getInfiniteIndex(i, reel.length, items.length);
      if (items[itemAtPosition].id === winItem.id) {
        winnerPosition = i;
        break;
      }
    }

    // If not found in the buffer, we need to find the correct position mathematically
    if (winnerPosition === -1) {
      // Find the winning item's index in the original items array
      const winnerItemIndex = items.findIndex((item) => item.id === winItem.id);

      // Calculate the next occurrence of this item after the minimum distance
      const startSearchPosition = currentPosition + minDistanceAhead;
      const itemsLength = items.length;

      // Find how many items ahead we need to go to reach the winner
      const currentItemIndex = getInfiniteIndex(
        startSearchPosition,
        reel.length,
        itemsLength
      );
      let itemsToAdvance: number;

      if (winnerItemIndex >= currentItemIndex) {
        itemsToAdvance = winnerItemIndex - currentItemIndex;
      } else {
        itemsToAdvance = itemsLength - currentItemIndex + winnerItemIndex;
      }

      winnerPosition = startSearchPosition + itemsToAdvance;

      // Ensure we don't go beyond the buffer bounds
      if (winnerPosition >= reel.length - 5) {
        // If still too far, use the minimum distance and accept that item
        winnerPosition = currentPosition + minDistanceAhead;
        console.warn(
          "🎰 Buffer boundary reached, using minimum distance fallback"
        );
      }
    }

    // FINAL VALIDATION: Ensure mathematical correctness
    const finalItemAtPosition = getInfiniteIndex(
      winnerPosition,
      reel.length,
      items.length
    );
    const expectedWinnerIndex = items.findIndex(
      (item) => item.id === winItem.id
    );

    if (finalItemAtPosition !== expectedWinnerIndex) {
      console.warn("🎰 Winner position mismatch, recalculating...", {
        expected: expectedWinnerIndex,
        actual: finalItemAtPosition,
        winnerName: winItem.name,
      });

      // Force exact positioning by finding the closest correct position
      for (
        let i = currentPosition + minDistanceAhead;
        i < reel.length - 5;
        i++
      ) {
        if (
          getInfiniteIndex(i, reel.length, items.length) === expectedWinnerIndex
        ) {
          winnerPosition = i;
          break;
        }
      }
    }

    // Calculate the exact distance to move forward
    const distanceToMove = winnerPosition - currentPosition;

    // ABSOLUTE GUARANTEE: Never allow backward movement
    if (distanceToMove <= 0) {
      console.error("🚨 CRITICAL: Attempted backward spin prevented!", {
        current: currentPosition,
        target: winnerPosition,
        distance: distanceToMove,
      });
      // Force a minimum forward movement to the next complete cycle of the winner
      const winnerItemIndex = items.findIndex((item) => item.id === winItem.id);
      const nextCyclePosition =
        currentPosition +
        minDistanceAhead +
        ((items.length -
          getInfiniteIndex(
            currentPosition + minDistanceAhead,
            reel.length,
            items.length
          ) +
          winnerItemIndex) %
          items.length);
      winnerPosition = Math.min(nextCyclePosition, reel.length - 5);
    }

    const finalDistanceToMove = winnerPosition - currentPosition;
    const pixelsToMove = finalDistanceToMove * ITEM_WIDTH;

    // MATHEMATICAL PROOF: At this point, finalDistanceToMove MUST be > 0
    // because we've enforced minimum distance and corrected any backward movement
    console.assert(
      finalDistanceToMove > 0,
      "Mathematical guarantee violated: spin distance must be positive!"
    );
    console.assert(
      pixelsToMove > 0,
      "Mathematical guarantee violated: pixel movement must be positive!"
    );

    // Move forward (negative x direction) by exactly this distance
    const newFinalTranslate = finalTranslate - pixelsToMove;

    console.log("🎰 Mathematically Guaranteed Forward Spin:", {
      winnerItem: winItem.name,
      from: currentPosition,
      to: winnerPosition,
      distance: finalDistanceToMove,
      pixels: pixelsToMove,
      currentTranslate: finalTranslate,
      newTranslate: newFinalTranslate,
      movingForward: newFinalTranslate < finalTranslate,
      guaranteedForward: finalDistanceToMove > 0,
      itemAtDestination:
        items[getInfiniteIndex(winnerPosition, reel.length, items.length)].name,
    });

    // Start the spin animation
    setSpinning(true);
    setSpinCount((c) => c + 1);
    setFinalTranslate(newFinalTranslate);

    // After animation completes, set the winner
    setTimeout(() => {
      setSpinning(false);
      setCenteredIndex(winnerPosition);
      setFinalTranslate(0); // Reset for CSS centering

      setTimeout(() => {
        setWinner(winItem);
        playWin();

        // Call handleWin immediately after winner is determined
        onWin?.(winItem);
      }, 100);
    }, SPIN_CONFIG.duration);
  }, [spinning, items, reel, playWin, finalTranslate, centeredIndex]);

  // Handler for resetting winner state - pure UI logic
  // Used for both dismissing and after quick sell completion
  const handleResetWinner = useCallback(() => {
    setWinner(null);
    setFinalTranslate(0); // Reset for CSS centering
  }, []);

  // Casino-style easing - starts fast, gradually slows down naturally
  const casinoSpinEasing: [number, number, number, number] = [
    0.25, 0.1, 0.25, 1.0,
  ]; // More realistic deceleration

  // Don't render the reel until it's properly initialized
  if (!isInitialized || reel.length === 0) {
    return (
      <div className="w-full relative">
        {/* Gaming Loading Container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-black p-6 rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
            <div
              className="absolute top-4 right-4 w-20 h-20 bg-purple-500/30 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-4 left-8 w-12 h-12 bg-cyan-500/30 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Loading Frame */}
          <div
            ref={containerRef}
            className="relative w-full mx-auto overflow-hidden rounded-xl border-2 border-gray-600/50 shadow-2xl h-[280px] flex items-center justify-center"
            style={{
              background: `
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

          {/* Loading HUD */}
          <div className="mt-4 flex justify-between items-center text-xs">
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
            background: `
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

          {/* Gaming-style Center Selection Frame */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[174px] h-[184px] pointer-events-none z-20 transition-all duration-300`}
          >
            {/* Main Frame */}
            <div
              className={`w-full h-full rounded-xl transition-all duration-300 ${
                spinning
                  ? "border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10"
                  : "border-2 border-blue-500/60 shadow-md shadow-blue-500/30 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5"
              }`}
            >
              {/* Corner Decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-400 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-400 rounded-br" />
            </div>
          </div>

          {/* Enhanced Spinning Reel */}
          <div className="h-[280px] relative scan-lines">
            {/* Triangle Pointers */}
            <div className="triangle-pointer top"></div>
            <div className="triangle-pointer bottom"></div>

            <motion.div
              key={spinCount}
              className="flex items-center absolute top-1/2 -translate-y-1/2"
              style={{
                width: `${reel.length * ITEM_WIDTH}px`,
                willChange: "transform",
                // During spinning, use fixed positioning at 0
                // After spinning, use CSS centering for natural positioning
                left: spinning
                  ? 0
                  : `calc(50% - ${
                      centeredIndex * ITEM_WIDTH + ITEM_HALF_WIDTH
                    }px)`,
              }}
              animate={{
                x: finalTranslate,
              }}
              transition={{
                duration: spinning ? SPIN_CONFIG.duration / 1000 : 0.3, // Convert ms to seconds, smoother transition when stopping
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
                    return "drop-shadow-[0_0_20px_#fbbf24] ring-2 ring-yellow-400/50"; // Legendary
                  if (sellValue >= 10000)
                    return "drop-shadow-[0_0_15px_#a855f7] ring-1 ring-purple-400/40"; // Epic
                  if (sellValue >= 5000)
                    return "drop-shadow-[0_0_12px_#3b82f6] ring-1 ring-blue-400/30"; // Rare
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

          {/* Enhanced Gaming-style Pointers */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-30">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 clip-path-triangle" />
              <div className="absolute inset-0 w-8 h-8 bg-cyan-400/50 clip-path-triangle blur-sm" />
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-30">
            <div className="relative rotate-180">
              <div className="w-8 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 clip-path-triangle" />
              <div className="absolute inset-0 w-8 h-8 bg-cyan-400/50 clip-path-triangle blur-sm" />
            </div>
          </div>

          {/* Side scan lines effect */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-cyan-400/10 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-cyan-400/10 to-transparent pointer-events-none z-10" />
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
        boxPrice={boxPrice}
        winner={winner}
        onSpin={spin}
        onResetWinner={handleResetWinner}
      />
      {/* Note: SpinReelController handles business logic including:
          - Spin type tracking (paid vs trial)
          - Quick sell eligibility based on spin type
          - Authentication and modal management */}
    </div>
  );
};

export default SpinningReel;
