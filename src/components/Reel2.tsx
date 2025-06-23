import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  id: number;
  name: string;
  image: string;
  odds: number;
};

type SpinningReelProps = {
  items: Item[];
  onWin?: (item: Item) => void;
};

const REPEAT = 15; // Number of times to repeat items in the reel for smoothness
const ITEM_WIDTH = 80;
const VISIBLE_ITEMS = 5;

function pickItem(items: Item[], rand: number): Item {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.odds;
    if (rand < cumulative) return item;
  }
  return items[items.length - 1]; // fallback
}

function buildReelSequence(items: Item[], repeat = REPEAT): Item[] {
  const arr: Item[] = [];
  for (let i = 0; i < repeat; i++) arr.push(...items);
  return arr;
}

export const SpinningReel2: React.FC<SpinningReelProps> = ({ items, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);
  const [reel, setReel] = useState<Item[]>(buildReelSequence(items));
  const [finalTranslate, setFinalTranslate] = useState(0);

  const [spinCount, setSpinCount] = useState(0); // To force rerender for AnimatePresence

  const spin = () => {
    if (spinning) return;
    setWinner(null);

    // Pick a winner
    const rand = Math.random();
    const winItem = pickItem(items, rand);

    // Build reel anew and decide where to stop
    const reelArr = buildReelSequence(items, REPEAT);
    // Find in the last cycle the index for the winner
    const lastCycleStart = (REPEAT - 1) * items.length;
    const indices = [];
    for (let i = lastCycleStart; i < reelArr.length; i++) {
      if (reelArr[i].id === winItem.id) indices.push(i);
    }
    // Randomize which occurrence to land on in the last cycle for realism
    const winnerIndex = indices[Math.floor(Math.random() * indices.length)];
    // Animation: move from 0 to winnerIndex (centered)
    const shift = winnerIndex - Math.floor(VISIBLE_ITEMS / 2);

    setReel(reelArr);
    setFinalTranslate(-shift * ITEM_WIDTH);
    setSpinning(true);
    setSpinCount((c) => c + 1);

    const duration = 2.2;

    setTimeout(() => {
      setWinner(winItem);
      setSpinning(false);
      if (onWin) onWin(winItem);
    }, duration * 1000 + 100);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 font-bold text-lg">Spin the Mystery Box!</div>
      <div className="relative w-[400px] h-[110px] mx-auto overflow-hidden border-4 border-yellow-300 rounded-lg bg-gray-900">
        <motion.div
          key={spinCount} // Forces remount for AnimatePresence on each spin
          className="flex items-center"
          style={{ width: `${reel.length * ITEM_WIDTH}px` }}
          animate={{
            x: spinning ? finalTranslate : finalTranslate,
            transition: {
              duration: spinning ? 2.2 : 0.2,
              ease: spinning ? [0.17, 0.67, 0.83, 0.67] : "easeOut",
            },
          }}
        >
          {reel.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center w-[${ITEM_WIDTH}px] h-[100px] mx-1 rounded bg-gray-800 border-2 ${winner && item.id === winner.id && !spinning ? "border-green-400 scale-105" : "border-gray-700"}`}
              style={{ width: ITEM_WIDTH }}
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mb-2 pointer-events-none select-none" draggable={false} />
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