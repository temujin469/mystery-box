"use client";
import { motion } from "framer-motion";
import { Package, ShoppingBag, PackageOpen } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

const steps = [
  {
    icon: <Package size={40} />,
    title: "Хайрцаг сонгох",
    description: "Жинхэнэ бүтээгдэхүүнтэй мистери хайрцгуудаас хүссэнээ сонгоорой.",
  },
  {
    icon: <PackageOpen size={40} />,
    title: "Хайрцгаа нээх",
    description: "Хайрцаг бүрт ямар бараа унах боломжтой. Азаа үзээрэй!",
  },
  {
    icon: <ShoppingBag size={40} />,
    title: "Бараагаа захиалах",
    description: "Бараагаа нээсний дараа та шууд захиалах эсвэл Cash болгож сольж болно.",
  },
];

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const prevStep = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev + 1 < steps.length) {
          return prev + 1;
        } else {
          return 0;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Track the furthest step reached, to keep the progress bar filled.
  useEffect(() => {
    if (currentStep > maxStep) {
      setMaxStep(currentStep);
    }
    if (currentStep === 0) {
      setMaxStep(0);
    }
    prevStep.current = currentStep;
  }, [currentStep, maxStep]);

  // Calculate progress as the furthest step reached, except when looping back to 0.
  const progress =
    currentStep === 0 ? 0 : (maxStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-15">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        Яаж ажилладаг вэ <span role="img" aria-label="lightbulb">💡</span>
      </h2>
      <div className="bg-card text-white rounded-md p-6 shadow-md relative overflow-x-auto">
        <div className="flex items-center justify-between relative mb-10">
          {/* Full progress bar bg */}
          <div className="absolute left-1/2 top-1/2 w-full h-2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-full z-0" />
          {/* Neon progress bar that never shrinks smoothly */}
          <motion.div
            className="absolute left-0 top-1/2 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full z-10"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: prevStep.current > currentStep ? 0 : 1,
              ease: "easeInOut",
            }}
            style={{ transform: 'translateY(-50%)' }}
          />
          <div className="flex w-full justify-between z-20">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center w-1/3">
                <motion.div
                  animate={{ scale: currentStep === i ? 1.18 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={clsx(
                    "p-3 mb-2 rounded-full border-4 transition-all",
                    i === 0
                      ? "border-cyan-400"
                      : i === 1
                      ? "border-purple-500"
                      : "border-pink-500",
                    i < currentStep
                      ? "bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 text-white shadow-[0_0_25px_#b47cff]"
                      : i === currentStep
                      ? "bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 text-white shadow-[0_0_25px_#b47cff]"
                      : "bg-zinc-800 text-zinc-400"
                  )}
                >
                  {step.icon}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Text Content */}
        <div className="flex flex-col gap-7 sm:flex-row sm:gap-0 justify-between text-center">
          {steps.map((step, i) => (
            <div
              key={i}
              className={clsx(
                "transition-opacity duration-500 flex-1 min-w-[160px] px-2",
                i < currentStep
                  ? "opacity-70"
                  : currentStep === i
                  ? "opacity-100"
                  : "opacity-40"
              )}
            >
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}