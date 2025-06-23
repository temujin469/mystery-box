import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowLeft, FastForward } from "lucide-react";
import Link from "next/link";

// Constants
const REPEAT = 50;
const ITEM_WIDTH = 170;

// Helper functions
function pickItem(items: Item[], rand: number): Item {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.drop_rate;
    if (rand < cumulative) return item;
  }
  return items[items.length - 1];
}

function buildReelSequence(items: Item[], repeat = REPEAT): Item[] {
  return Array.from({ length: repeat }, () => items).flat();
}

// Tick sound hook with playbackRate control
function useTickSound(url: string) {
  const tickRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    tickRef.current = new Audio(url);
    tickRef.current.volume = 0.8;
    tickRef.current.preload = "auto";
    return () => {
      if (tickRef.current) {
        tickRef.current.pause();
        tickRef.current = null;
      }
    };
  }, [url]);
  const play = (rate: number) => {
    if (tickRef.current) {
      tickRef.current.pause();
      tickRef.current.currentTime = 0;
      tickRef.current.playbackRate = rate;
      // Safari bug: need to clone for rapid retriggers
      const snd = tickRef.current.cloneNode() as HTMLAudioElement;
      snd.playbackRate = rate;
      snd.volume = tickRef.current.volume;
      snd.play();
    }
  };
  return { play };
}

// Spin and win sounds (one-shot, no pitch change)
function useSound(url: string, { volume = 1 } = {}) {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio(url);
    soundRef.current.volume = volume;
    soundRef.current.preload = "auto";
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null;
      }
    };
  }, [url, volume]);

  const play = React.useCallback(() => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  }, []);

  const stop = React.useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}

const SpinningReel: React.FC<{ items: Item[]; onWin?: (item: Item) => void }> = ({ items, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);
  const [finalTranslate, setFinalTranslate] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sound effects (replace with your sound file paths)
  const { play: playTick } = useTickSound("/sound/wood-spin.mp3");
  const { play: playSpin, stop: stopSpin } = useSound("/sound/spin13.mp3", { volume: 0.5 });
  const { play: playWin } = useSound("/sound/won.mp3", { volume: 0.6 });

  // Build a big reel ONCE
  const [reel, setReel] = useState<Item[]>(() => buildReelSequence(items));

  // On mount or items change, build a fresh reel and center it
  useEffect(() => {
    const newReel = buildReelSequence(items);
    setReel(newReel);
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const initialCenterIdx = Math.floor(newReel.length / 2);
      const containerCenter = containerWidth / 2;
      const initialItemCenter = initialCenterIdx * ITEM_WIDTH + ITEM_WIDTH / 2;
      setFinalTranslate(containerCenter - initialItemCenter);
      setCenteredIndex(initialCenterIdx);
    }
    // eslint-disable-next-line
  }, [items]);

  // For tick sound and speed
  const lastIndexRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const minPlaybackRate = 0.8;
  const maxPlaybackRate = 2.2;

  // Track which item is centered: tick sound and speed logic here!
  const handleUpdate = (latest: { x: number }) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const centerX = -latest.x + containerWidth / 2;
    const idx = Math.round((centerX - ITEM_WIDTH / 2) / ITEM_WIDTH);
    setCenteredIndex(idx);

    // Play tick sound if index changed and spinning
    if (spinning && idx !== lastIndexRef.current) {
      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 16); // ms between ticks
      // Map dt (large=slow, small=fast) to playback rate
      // At 60ms (fast), 2.2x; at 250ms (slow), 0.8x
      let rate = 
        maxPlaybackRate -
        ((Math.min(Math.max(dt, 60), 250) - 60) / (250 - 60)) * (maxPlaybackRate - minPlaybackRate);
      playTick(rate);
      lastIndexRef.current = idx;
      lastTimeRef.current = now;
    }
    if (!spinning) {
      lastIndexRef.current = idx;
      lastTimeRef.current = performance.now();
    }
  };

  // Recenter on resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || centeredIndex === null) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerCenter = containerWidth / 2;
      const itemCenter = centeredIndex * ITEM_WIDTH + ITEM_WIDTH / 2;
      setFinalTranslate(containerCenter - itemCenter);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centeredIndex, reel.length]);

  const spin = () => {
    if (spinning) return;
    setWinner(null);

    // Pick a winner
    const rand = Math.random();
    const winItem = pickItem(items, rand);

    // Only search the last cycle for winner index, so spins always move forward
    const lastCycleStart = (REPEAT - 1) * items.length;
    const winIndices = reel
      .map((item, i) => (i >= lastCycleStart && item.id === winItem.id ? i : -1))
      .filter((i) => i !== -1);

    const winnerIndex = winIndices[Math.floor(Math.random() * winIndices.length)];
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const viewportCenterX = containerWidth / 2;
      const winningItemCenterX = winnerIndex * ITEM_WIDTH + ITEM_WIDTH / 2;
      const finalOffset = viewportCenterX - winningItemCenterX;
      setFinalTranslate(finalOffset);
      setCenteredIndex(winnerIndex);
    }
    setSpinning(true);
    setSpinCount((c) => c + 1);

    // Play spinning sound (background, optional, or remove if you don't want it)
    playSpin();

    setTimeout(() => {
      setWinner(winItem);
      setSpinning(false);
      stopSpin();
      playWin();
      onWin?.(winItem);
    }, 3650);
  };

  const slowSpinEasing = [0.07, 0.8, 0.23, 1];

  return (
    <div className="w-full">
      <div className="flex gap-6 items-center p-6">
        <Link href="/">
          <Button className="bg-primary/30">
            <ArrowLeft size={30} /> Буцах
          </Button>
        </Link>
        <h2 className="font-bold text-lg">Хүрдийг эргүүлээрэй!</h2>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-full mx-auto overflow-hidden bg-primary/10 bg-[url('/img/skulls.png')]"
      >
        <div className="w-20 left-1/2 -translate-x-1/2 rounded-full blur-2xl h-[160px] bg-primary/90 absolute top-1/2 -translate-y-1/2"></div>
        <div className="h-[256px]">
          <motion.div
            key={spinCount}
            className="flex items-center absolute top-1/2 -translate-y-1/2"
            style={{ width: `${reel.length * ITEM_WIDTH}px` }}
            animate={{
              x: finalTranslate,
              transition: {
                duration: spinning ? 3.5 : 0.2,
                ease: spinning ? slowSpinEasing : "easeOut",
              },
            }}
            onUpdate={handleUpdate}
          >
            {reel.map((item, idx) => {
              const isCenter = idx === centeredIndex;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center h-full transition-all duration-300 ${
                    isCenter ? "scale-110 drop-shadow-[0_0_12px_#22d3ee]" : "blur-[2px] grayscale-50"
                  }`}
                  style={{ width: ITEM_WIDTH }}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>

        <img src="/img/point.png" className="w-8 absolute top-0 left-1/2 -translate-x-1/2" />
        <img src="/img/point.png" className="w-8 absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180" />
      </div>

      <div className="flex w-full justify-center gap-4 py-10">
        <Button className="transition disabled:opacity-50" onClick={spin} size="lg" disabled={spinning}>
          {spinning ? "Эргэж байна..." : "20,000₮ Нээх"}
        </Button>
        <Button className="disabled:opacity-50" onClick={spin} size="lg" variant="secondary" disabled={spinning}>
          {spinning ? "Эргэж байна..." : "Туршилт"}
        </Button>
        <Button className="border-white/10" variant="outline" size="lg">
          <FastForward />
        </Button>
      </div>
      {/* You should provide /sounds/tick.mp3, /sounds/spin.mp3, and /sounds/win.mp3 in your public directory for this to work. */}
    </div>
  );
};

export default SpinningReel;