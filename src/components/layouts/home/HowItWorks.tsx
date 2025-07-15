"use client";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  PackageOpen,
  Sparkles,
  Zap,
  Gift,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

const steps = [
  {
    icon: <Package size={40} />,
    title: "Хайрцаг сонгох",
    description:
      "Жинхэнэ бүтээгдэхүүнтэй мистери хайрцгуудаас хүссэнээ сонгоорой.",
    activeGradient: "from-primary/80 to-primary/70",
    inactiveGradient: "from-primary/20 to-primary/15",
    contentGradient: "from-primary/15 via-primary/10 to-primary/8",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
  },
  {
    icon: <PackageOpen size={40} />,
    title: "Хайрцгаа нээх",
    description: "Хайрцаг бүрт ямар бараа унах боломжтой. Азаа үзээрэй!",
    activeGradient: "from-purple-500/80 to-violet-500/70",
    inactiveGradient: "from-purple-500/20 to-violet-500/15",
    contentGradient: "from-purple-500/15 via-violet-500/10 to-purple-500/8",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: <ShoppingBag size={40} />,
    title: "Бараагаа захиалах",
    description:
      "Бараагаа нээсний дараа та шууд захиалах эсвэл Cash болгож сольж болно.",
    activeGradient: "from-pink-500/80 via-rose-500/75 to-orange-500/70",
    inactiveGradient: "from-pink-500/20 via-rose-500/15 to-orange-500/15",
    contentGradient: "from-pink-500/15 via-rose-500/10 to-orange-500/8",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
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
    }, 4000); // Slower auto-progression

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
  const progress = currentStep === 0 ? 0 : (maxStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-20 relative">
      {/* Floating particles background - reduced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/20 via-purple-400/20 to-pink-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
              scale: [0, 0.8, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>


      {/* Main Container */}
      <div className="relative overflow-hidden">
        {/* Perfect modern glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-card/50 to-background/90 backdrop-blur-2xl rounded-3xl border border-border/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-purple-500/10 to-pink-500/8 rounded-3xl" />

        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-purple-500/10" />

        <div className="relative p-8 md:p-12">
          {/* Progress Section */}
          <div className="flex items-center justify-between relative mb-16">
            {/* Modern progress bar background */}
            <div className="absolute left-1/2 top-1/2 w-full h-3 -translate-x-1/2 -translate-y-1/2 bg-muted/30 rounded-full z-0 backdrop-blur-sm" />

            {/* Animated progress bar */}
            <motion.div
              className="absolute left-0 top-1/2 h-3 rounded-full z-10 overflow-hidden shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: prevStep.current > currentStep ? 0.3 : 1,
                ease: "easeInOut",
              }}
              style={{ transform: "translateY(-50%)" }}
            >
              {/* Premium gradient */}
              <div className="w-full h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
            </motion.div>

            {/* Step Icons */}
            <div className="flex w-full justify-between z-20 relative">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: currentStep === i ? 1.05 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className={clsx(
                      "relative p-4 mb-4 rounded-2xl border-2 transition-all duration-500 backdrop-blur-sm shadow-lg",
                      i <= currentStep
                        ? `bg-gradient-to-br ${step.activeGradient} text-primary-foreground ${step.borderColor}`
                        : `bg-gradient-to-br ${step.inactiveGradient} text-muted-foreground border-border/30`
                    )}
                  >
                    {/* Icon container */}
                    <div>{step.icon}</div>

                    {/* Step number badge */}
                    <div
                      className={clsx(
                        "absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-lg",
                        i <= currentStep
                          ? "bg-background text-foreground shadow-purple-500/20"
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border backdrop-blur-sm shadow-lg bg-gradient-to-br ${step.contentGradient} ${step.borderColor}`}
              >
                {/* Modern background decoration */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Gift size={40} className={step.iconColor} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Modern decorative elements */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-gradient-to-br from-primary/12 to-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-br from-purple-500/12 to-violet-500/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-4 w-16 h-16 bg-gradient-to-br from-pink-500/10 to-rose-500/8 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}
