"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  id: number;
  name: string;
  image: string;
  odds: number; // e.g., 0.5 means 50%
};

type SpinningReelProps = {
  items: Item[];
  onWin?: (item: Item) => void;
};

const getRandom = () => Math.random();

function pickItem(items: Item[], rand: number): Item {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.odds;
    if (rand < cumulative) return item;
  }
  // fallback, should not happen if odds sum to 1
  return items[items.length - 1];
}

// Reel visualizer helpers
function buildReelSequence(items: Item[], repeat = 6): Item[] {
  // Make a long array repeating items for reel effect
  const arr: Item[] = [];
  for (let i = 0; i < repeat; i++) {
    arr.push(...items);
  }
  return arr;
}

export const SpinningReel: React.FC<SpinningReelProps> = ({ items, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);
  const [reel, setReel] = useState<Item[]>(buildReelSequence(items));
  const [stopIndex, setStopIndex] = useState<number | null>(null);

  const spin = () => {
    if (spinning) return;
    setWinner(null);

    // Pick a winner first (weighted)
    const rand = getRandom();
    const winItem = pickItem(items, rand);

    // Build reel and find the index where the winner lands at the end
    const reelArr = buildReelSequence(items, 6);
    // Place the winner at a random position in the last cycle of the reel
    const reelLen = reelArr.length;
    const endCycle = items.length * 5;
    // Random offset within last cycle
    const offset = Math.floor(Math.random() * items.length);
    const winnerIndex = endCycle + items.findIndex(i => i.id === winItem.id) + offset;
    // Overwrite the winner at winnerIndex for visual accuracy
    reelArr[winnerIndex % reelLen] = winItem;

    setReel(reelArr);
    setStopIndex(winnerIndex);
    setSpinning(true);

    // Animation duration calculation
    const duration = 2.5; // seconds

    setTimeout(() => {
      setWinner(winItem);
      setSpinning(false);
      if (onWin) onWin(winItem);
    }, duration * 1000 + 500);
  };

  // Reel width and item size
  const itemWidth = 80;
  const visibleItems = 5;

  // Calculate translateX for animation
  let translateX = 0;
  if (spinning && stopIndex !== null) {
    translateX = -((stopIndex - Math.floor(visibleItems / 2)) * itemWidth);
  } else if (winner) {
    // Center the winner after spin
    const winnerPos = reel.findIndex(i => i.id === winner.id);
    translateX = -((winnerPos - Math.floor(visibleItems / 2)) * itemWidth);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 font-bold text-lg">Spin the Mystery Box!</div>
      <div className="relative w-[400px] h-[110px] mx-auto overflow-hidden border-4 border-yellow-300 rounded-lg bg-gray-900">
        <motion.div
          className="flex items-center"
          style={{ width: `${reel.length * itemWidth}px` }}
          animate={{
            x: spinning
              ? translateX
              : winner
                ? translateX
                : 0,
            transition: {
              duration: spinning ? 2.5 : 0.5,
              ease: spinning ? [0.17, 0.67, 0.83, 0.67] : "easeOut",
            },
          }}
        >
          {reel.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center w-[${itemWidth}px] h-[100px] mx-1 rounded bg-gray-800 border-2 ${winner && item.id === winner.id ? "border-green-400 scale-105" : "border-gray-700"}`}
              style={{ width: itemWidth }}
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mb-2" />
              <span className="text-xs text-gray-200">{item.name}</span>
            </div>
          ))}
        </motion.div>
        {/* Center highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-full border-x-4 border-yellow-400 pointer-events-none" style={{zIndex:2}} />
      </div>
      <button
        className={`mt-6 px-8 py-3 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition disabled:opacity-50`}
        onClick={spin}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      <AnimatePresence>
        {winner && !spinning && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xl font-bold text-green-400">You won: {winner.name}!</div>
            <img src={winner.image} alt={winner.name} className="w-24 h-24 mx-auto mt-2 object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Example usage (replace with real data):
/*
const items = [
  { id: 1, name: "Gold Watch", image: "/gold-watch.png", odds: 0.5 },
  { id: 2, name: "Silver Chain", image: "/silver-chain.png", odds: 0.3 },
  { id: 3, name: "Premium Sneakers", image: "/sneakers.png", odds: 0.2 },
];

<SpinningReel items={items} onWin={item => alert(`Won: ${item.name}`)} />
*/