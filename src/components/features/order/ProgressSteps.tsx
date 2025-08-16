"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out flex-shrink-0",
                  {
                    // Active step
                    "bg-primary text-primary-foreground": isActive,
                    // Completed step
                    "bg-green-500 text-white": isCompleted,
                    // Future step
                    "bg-muted text-muted-foreground": !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3">
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-500 ease-in-out",
                      {
                        "bg-green-500": index < currentIndex,
                        "bg-primary": index === currentIndex,
                        "bg-muted": index > currentIndex,
                      }
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressSteps;
