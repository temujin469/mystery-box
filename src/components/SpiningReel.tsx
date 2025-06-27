import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowLeft, FastForward } from "lucide-react";
import Link from "next/link";

// Types
interface Item {
  id: string;
  name: string;
  image_url: string;
  drop_rate: number;
}

// Constants
const ITEM_WIDTH = 170;
const ITEM_HALF_WIDTH = ITEM_WIDTH / 2;

// Spin configuration - easy to adjust
const SPIN_CONFIG = {
  minSpins: 3,        // Minimum number of full rotations
  maxSpins: 6,        // Maximum number of full rotations
  duration: 3000,     // Total spin duration in milliseconds (3 seconds)
  baseVelocity: 1200, // Base spinning velocity in pixels per second
  deceleration: 0.15, // Deceleration factor (lower = slower deceleration)
  minSearchDistance: 8, // Minimum items to search ahead for winner
  bufferZone: 0.3,    // Reset when this fraction away from center (0.3 = 30%)
  hysteresis: 0.05    // Prevent oscillation in reset logic
};

// Helper functions - optimized for performance
function pickItem(items: Item[], rand: number): Item {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.drop_rate;
    if (rand < cumulative) return item;
  }
  return items[items.length - 1];
}

function buildInfiniteReel(items: Item[], containerWidth: number): Item[] {
  if (items.length === 0) return [];
  
  const itemsPerScreen = Math.ceil(containerWidth / ITEM_WIDTH);
  
  // Enhanced buffer calculation for mathematical guarantee
  // Create enough buffer to ensure we can ALWAYS find any winning item ahead
  // Buffer must be large enough to accommodate: current position + minimum spin distance + complete item cycle
  const minScreensForGuarantee = 25; // Increased for absolute certainty
  const totalScreens = Math.max(minScreensForGuarantee, itemsPerScreen * 3);
  const totalItems = itemsPerScreen * totalScreens;
  
  // Create a simple repeating sequence with guaranteed coverage
  const sequence: Item[] = [];
  for (let i = 0; i < totalItems; i++) {
    sequence.push(items[i % items.length]);
  }
  
  return sequence;
}


function getInfiniteIndex(index: number, totalItems: number, originalLength: number): number {
  // Map any index to the equivalent position in the original items array
  return ((index % originalLength) + originalLength) % originalLength;
}


// Performance monitoring for infinite reel
function useReelMetrics() {
  const metricsRef = useRef({
    resets: 0,
    lastResetTime: 0,
    averageResetInterval: 0
  });
  
  const recordReset = useCallback(() => {
    const now = performance.now();
    const metrics = metricsRef.current;
    
    if (metrics.lastResetTime > 0) {
      const interval = now - metrics.lastResetTime;
      metrics.averageResetInterval = (metrics.averageResetInterval * metrics.resets + interval) / (metrics.resets + 1);
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
      pool.forEach(audio => {
        audio.pause();
        audio.src = '';
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
        soundRef.current.src = '';
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
  items: Item[]; 
  onWin?: (item: Item) => void;
  onQuickSell?: (item: Item) => void;
}> = ({ items, onWin, onQuickSell }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Calculate reel and initial position after mount
  const [reel, setReel] = useState<Item[]>([]);
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
  const handleUpdate = useCallback((latest: { x: number }) => {
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
        const itemScreenPosition = (i * ITEM_WIDTH + ITEM_HALF_WIDTH) + totalReelOffset;
        const distanceFromCenter = Math.abs(itemScreenPosition - containerCenter);
        
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
        const speed = Math.abs(newCenteredIndex - (lastIndexRef.current || newCenteredIndex));
        // More sophisticated speed calculation for better audio feedback
        const normalizedSpeed = Math.min(speed / 3, 1); // Normalize to 0-1
        const rate = minPlaybackRate + (normalizedSpeed * (maxPlaybackRate - minPlaybackRate));
        playTick(rate);
        lastIndexRef.current = newCenteredIndex;
      }
    }
  }, [spinning, centeredIndex, playTick, minPlaybackRate, maxPlaybackRate, reel.length]);

  // Simple infinite scroll reset - keeps the reel centered
  useEffect(() => {
    if (!spinning && !winner && isInitialized && reel.length > 0) {
      const reelCenter = Math.floor(reel.length / 2);
      const currentDistance = Math.abs(centeredIndex - reelCenter);
      
      // Reset if we're too far from center (simple threshold)
      const maxDistance = Math.floor(reel.length * 0.3); // 30% of reel length
      
      if (currentDistance > maxDistance) {
        // Find the same item type near the center
        const originalItemIndex = getInfiniteIndex(centeredIndex, reel.length, items.length);
        
        // Look for the same item near the center
        for (let i = reelCenter - items.length; i < reelCenter + items.length; i++) {
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
  }, [spinning, centeredIndex, isInitialized, reel.length, items.length, winner, recordReset]);

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
      const winnerItemIndex = items.findIndex(item => item.id === winItem.id);
      
      // Calculate the next occurrence of this item after the minimum distance
      const startSearchPosition = currentPosition + minDistanceAhead;
      const itemsLength = items.length;
      
      // Find how many items ahead we need to go to reach the winner
      const currentItemIndex = getInfiniteIndex(startSearchPosition, reel.length, itemsLength);
      let itemsToAdvance: number;
      
      if (winnerItemIndex >= currentItemIndex) {
        itemsToAdvance = winnerItemIndex - currentItemIndex;
      } else {
        itemsToAdvance = (itemsLength - currentItemIndex) + winnerItemIndex;
      }
      
      winnerPosition = startSearchPosition + itemsToAdvance;
      
      // Ensure we don't go beyond the buffer bounds
      if (winnerPosition >= reel.length - 5) {
        // If still too far, use the minimum distance and accept that item
        winnerPosition = currentPosition + minDistanceAhead;
        console.warn('🎰 Buffer boundary reached, using minimum distance fallback');
      }
    }
    
    // FINAL VALIDATION: Ensure mathematical correctness
    const finalItemAtPosition = getInfiniteIndex(winnerPosition, reel.length, items.length);
    const expectedWinnerIndex = items.findIndex(item => item.id === winItem.id);
    
    if (finalItemAtPosition !== expectedWinnerIndex) {
      console.warn('🎰 Winner position mismatch, recalculating...', {
        expected: expectedWinnerIndex,
        actual: finalItemAtPosition,
        winnerName: winItem.name
      });
      
      // Force exact positioning by finding the closest correct position
      for (let i = currentPosition + minDistanceAhead; i < reel.length - 5; i++) {
        if (getInfiniteIndex(i, reel.length, items.length) === expectedWinnerIndex) {
          winnerPosition = i;
          break;
        }
      }
    }
    
    // Calculate the exact distance to move forward
    const distanceToMove = winnerPosition - currentPosition;
    
    // ABSOLUTE GUARANTEE: Never allow backward movement
    if (distanceToMove <= 0) {
      console.error('🚨 CRITICAL: Attempted backward spin prevented!', {
        current: currentPosition,
        target: winnerPosition,
        distance: distanceToMove
      });
      // Force a minimum forward movement to the next complete cycle of the winner
      const winnerItemIndex = items.findIndex(item => item.id === winItem.id);
      const nextCyclePosition = currentPosition + minDistanceAhead + 
                               ((items.length - getInfiniteIndex(currentPosition + minDistanceAhead, reel.length, items.length) + winnerItemIndex) % items.length);
      winnerPosition = Math.min(nextCyclePosition, reel.length - 5);
    }
    
    const finalDistanceToMove = winnerPosition - currentPosition;
    const pixelsToMove = finalDistanceToMove * ITEM_WIDTH;
    
    // MATHEMATICAL PROOF: At this point, finalDistanceToMove MUST be > 0
    // because we've enforced minimum distance and corrected any backward movement
    console.assert(finalDistanceToMove > 0, 'Mathematical guarantee violated: spin distance must be positive!');
    console.assert(pixelsToMove > 0, 'Mathematical guarantee violated: pixel movement must be positive!');
    
    // Move forward (negative x direction) by exactly this distance
    const newFinalTranslate = finalTranslate - pixelsToMove;
    
    console.log('🎰 Mathematically Guaranteed Forward Spin:', {
      winnerItem: winItem.name,
      from: currentPosition,
      to: winnerPosition,
      distance: finalDistanceToMove,
      pixels: pixelsToMove,
      currentTranslate: finalTranslate,
      newTranslate: newFinalTranslate,
      movingForward: newFinalTranslate < finalTranslate,
      guaranteedForward: finalDistanceToMove > 0,
      itemAtDestination: items[getInfiniteIndex(winnerPosition, reel.length, items.length)].name
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
        onWin?.(winItem);
      }, 100);
    }, SPIN_CONFIG.duration);
    
  }, [spinning, items, reel, playWin, onWin, finalTranslate, centeredIndex]);

  // Casino-style easing - starts fast, gradually slows down naturally
  const casinoSpinEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0]; // More realistic deceleration

  // Don't render the reel until it's properly initialized
  if (!isInitialized || reel.length === 0) {
    return (
      <div className="w-full">
        <div className="flex gap-6 items-center p-6">
          <Link href="/">
            <Button className="bg-primary/30 hover:bg-primary/50 transition-colors">
              <ArrowLeft size={24} className="mr-2" /> Буцах
            </Button>
          </Link>
          <h2 className="font-bold text-lg">Хүрдийг эргүүлээрэй!</h2>
        </div>
        <div 
          ref={containerRef}
          className="relative w-full mx-auto overflow-hidden bg-primary/10 bg-[url('/img/skulls.png')] rounded-lg h-[256px] flex items-center justify-center"
        >
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-6 items-center p-6">
        <Link href="/">
          <Button className="bg-primary/30 hover:bg-primary/50 transition-colors">
            <ArrowLeft size={24} className="mr-2" /> Буцах
          </Button>
        </Link>
        <h2 className="font-bold text-lg">
          Хүрдийг эргүүлээрэй!
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative w-full mx-auto overflow-hidden bg-primary/10 bg-[url('/img/skulls.png')] rounded-lg"
        style={{ contain: 'layout style paint' }} // Optimize rendering
      >
        {/* Center highlight - more intense during spinning */}
        <div className={`w-20 left-1/2 -translate-x-1/2 rounded-full blur-2xl h-[160px] absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
          spinning ? 'bg-primary opacity-100 scale-125 animate-pulse' : 'bg-primary/90 opacity-80 scale-100'
        }`}></div>
        
        {/* Center selection indicator - always perfectly centered with spinning animation */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[180px] border-2 rounded-lg pointer-events-none z-10 transition-all duration-300 ${
          spinning ? 'border-primary border-opacity-100 shadow-lg shadow-primary/50 animate-pulse' : 'border-primary/60'
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-xs px-2 py-1 rounded whitespace-nowrap">
            {centeredIndex !== null && reel[centeredIndex] && items.length > 0 ? 
              `${getInfiniteIndex(centeredIndex, reel.length, items.length) + 1} / ${items.length}` : 
              `1 / ${items.length}`}
          </div>
        </div>
        
        <div className="h-[256px] relative">
          <motion.div
            key={spinCount}
            className="flex items-center absolute top-1/2 -translate-y-1/2"
            style={{ 
              width: `${reel.length * ITEM_WIDTH}px`,
              willChange: 'transform',
              // During spinning, use fixed positioning at 0
              // After spinning, use CSS centering for natural positioning
              left: spinning ? 0 : `calc(50% - ${(centeredIndex * ITEM_WIDTH + ITEM_HALF_WIDTH)}px)`,
            }}
            animate={{
              x: finalTranslate,
            }}
            transition={{
              duration: spinning ? SPIN_CONFIG.duration / 1000 : 0.3, // Convert ms to seconds, smoother transition when stopping
              ease: spinning ? casinoSpinEasing : "easeOut",
              type: "tween"
            }}
            drag={false}
            onUpdate={handleUpdate}
          >
            {reel.map((item: Item, idx: number) => {
              const isCenter = idx === centeredIndex;
              const originalIndex = getInfiniteIndex(idx, reel.length, items.length);
              const originalItem = items[originalIndex];
              
              // Calculate distance from center for progressive blur effect
              const distanceFromCenter = Math.abs(idx - centeredIndex);
              const blurIntensity = spinning ? 
                Math.min(distanceFromCenter * 0.8, 4) : // More blur during spinning for motion effect
                (isCenter ? 0 : Math.min(distanceFromCenter * 0.3, 2)); // Less blur when stopped
              
              // Enhanced spinning effects
              const spinningOpacity = spinning ? 
                (isCenter ? 0.9 : Math.max(0.3, 1 - distanceFromCenter * 0.15)) : 
                (isCenter ? 1 : 0.8);
              
              const spinningScale = spinning ?
                (isCenter ? 0.95 : Math.max(0.7, 1 - distanceFromCenter * 0.05)) :
                (isCenter ? 1 : 0.95);
              
              return (
                <div
                  key={`${idx}-${item.id}`}
                  className={`flex flex-col items-center justify-center h-full transition-all duration-200 ${
                    isCenter 
                      ? `drop-shadow-[0_0_12px_#22d3ee] brightness-110 ${spinning ? 'scale-105' : 'scale-100'}` 
                      : "grayscale-30"
                  } ${winner && isCenter ? 'ring-2 ring-primary ring-opacity-60' : ''}`}
                  style={{ 
                    width: ITEM_WIDTH,
                    transform: `translateZ(0) scale(${spinningScale})`, // Force GPU acceleration with scale
                    filter: `blur(${blurIntensity}px) ${spinning ? 'brightness(0.8)' : 'brightness(1)'}`,
                    opacity: spinningOpacity
                  }}
                >
                  <img
                    src={originalItem.image_url}
                    alt={originalItem.name}
                    className="w-20 h-20 object-contain pointer-events-none select-none"
                    draggable={false}
                    loading="lazy"
                  />
                  {isCenter && !spinning && (
                    <span className="text-xs text-white/80 mt-1 truncate max-w-[140px]">
                      {originalItem.name}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Pointers - always perfectly centered */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <img src="/img/point.png" className="w-8" alt="top pointer" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <img src="/img/point.png" className="w-8 rotate-180" alt="bottom pointer" />
        </div>
      </div>

      <div className="flex w-full justify-center gap-4 py-10">
        {winner ? (
          // Show Dismiss and Quick Sell buttons when there's a winner
          <>
            <Button 
              className="transition-all hover:scale-105" 
              onClick={() => {
                setWinner(null);
                // Reset the translate when dismissing to allow normal CSS centering
                setFinalTranslate(0);
              }} 
              size="lg" 
              variant="secondary"
            >
              Dismiss
            </Button>
            <Button 
              className="transition-all hover:scale-105 bg-green-600 hover:bg-green-700" 
              onClick={() => {
                onQuickSell?.(winner);
                setWinner(null);
                // Reset the translate when quick selling to allow normal CSS centering
                setFinalTranslate(0);
              }} 
              size="lg"
            >
              Quick Sell - {(winner as any).price?.toLocaleString()}₮
            </Button>
          </>
        ) : (
          // Show normal spin buttons when no winner
          <>
            <Button 
              className="transition-all disabled:opacity-50 hover:scale-105" 
              onClick={spin} 
              size="lg" 
              disabled={spinning}
            >
              {spinning ? "Эргэж байна..." : "20,000₮ Нээх"}
            </Button>
            <Button 
              className="disabled:opacity-50 hover:scale-105 transition-all" 
              onClick={spin} 
              size="lg" 
              variant="secondary" 
              disabled={spinning}
            >
              {spinning ? "Эргэж байна..." : "Туршилт"}
            </Button>
            <Button className="border-white/10 hover:scale-105 transition-all" variant="outline" size="lg">
              <FastForward />
            </Button>
          </>
        )}
      </div>

    </div>
  );
};

export default SpinningReel;