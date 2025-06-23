import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <EmptyInventory />
    </div>
  );
};

export default page;

function EmptyInventory() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 px-4 min-h-[60vh]">
      {/* Icon SVG */}
      <div className="mb-8">
        <svg
          className="w-30 h-30 text-white dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white text-center mb-2">
        Таны агуулахад одоогоор ямар ч эд зүйл алга.
      </h2>
      <p className="text-base text-zinc-400 text-center mb-8 max-w-lg">
        Эд зүйлс цуглуулахын тулд та хайрцаг нээгээрэй.
      </p>
      <Link href="/">
        <Button type="button" size="lg" variant="tertiary">
          Хайрцаг үзэх
        </Button>
      </Link>
    </div>
  );
}
