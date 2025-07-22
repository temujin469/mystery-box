"use client";

import React, { useState } from "react";
import {
  UserAchievementProgress,
  AchievementConditionKey,
} from "@/types/achievement";
import { Paper } from "@/components/common/Paper";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface AchievementCardProps {
  achievement: UserAchievementProgress;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getConditionText = (
    conditionKey: AchievementConditionKey,
    conditionValue: number
  ) => {
    switch (conditionKey) {
      case AchievementConditionKey.USER_LEVEL:
        return `${conditionValue} түвшинд хүрэх`;
      case AchievementConditionKey.OPEN_BOXES:
        return `${conditionValue} хайрцаг нээх`;
      default:
        return `${conditionValue} үйлдэл хийх`;
    }
  };

  const getProgressText = (
    current: number,
    required: number,
    conditionKey: AchievementConditionKey
  ) => {
    return `${current} / ${required}`;
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      {/* Vertical Achievement Card */}
      <Paper
        className={`p-4 transition-all duration-200 cursor-pointer ${
          achievement.is_unlocked
            ? "border-purple-300/50 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"
            : "hover:shadow-lg border-gray-200"
        }`}
        onClick={() => setIsDrawerOpen(true)}
      >
        {/* Achievement Image */}
        <div className="relative w-full aspect-square rounded-lg mb-3">
          <Image
            src={achievement.image_url}
            alt={achievement.name}
            fill
            className={`rounded-lg object-cover transition-all duration-200 ${
              achievement.is_unlocked ? "opacity-100" : "opacity-60 grayscale"
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/box.png";
            }}
          />
        </div>

        {/* Achievement Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold line-clamp-2 text-center">
            {achievement.name}
          </h3>

          {/* Show Claim Button if unlocked, Progress Bar if not */}
          {achievement.is_unlocked && achievement.reward_box_id ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/boxes/${achievement.reward_box_id}?reward=true`;
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
            >
              Шагнал авах
            </button>
          ) : (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-blue-600"
                style={{
                  width: `${Math.min(achievement.progress_percentage, 100)}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </Paper>

      {/* Shadcn Drawer */}
      <DrawerContent
        className="border-border/50"
        style={{
          maxHeight: "95vh",
        }}
      >
        <DrawerHeader className="text-center border-b border-border/20 pb-6">
          {/* Achievement Image - Centered */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
              <Image
                src={achievement.image_url}
                alt={achievement.name}
                fill
                className={`object-cover ${
                  achievement.is_unlocked
                    ? "opacity-100"
                    : "opacity-60 grayscale"
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/box.png";
                }}
              />
            </div>
          </div>

          {/* Achievement Info - Centered */}
          <div className="space-y-2">
            <DrawerTitle className="text-2xl font-bold">
              {achievement.name}
            </DrawerTitle>
            <DrawerDescription className="text-base text-muted-foreground max-w-md mx-auto">
              {achievement.description}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
          {/* Achievement Type Badges
          <div className="flex flex-wrap justify-center gap-2">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                achievement.condition_key === AchievementConditionKey.USER_LEVEL
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : achievement.condition_key ===
                    AchievementConditionKey.OPEN_BOXES
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {achievement.condition_key === AchievementConditionKey.USER_LEVEL
                ? "Түвшин"
                : achievement.condition_key ===
                  AchievementConditionKey.OPEN_BOXES
                ? "Хайрцаг нээх"
                : "Эхний хайрцаг"}
            </span>

            {achievement.reward_box_id && (
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2L3 7v10l7 3 7-3V7l-7-5z"
                    clipRule="evenodd"
                  />
                </svg>
                Шагнал
              </span>
            )}
          </div> */}

          {/* Progress Section - Only show if not unlocked */}
          {!achievement.is_unlocked && (
            <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {getConditionText(
                    achievement.condition_key,
                    achievement.condition_value
                  )}
                </span>
                <span className="text-sm text-muted-foreground font-semibold">
                  {getProgressText(
                    achievement.current_progress,
                    achievement.condition_value,
                    achievement.condition_key
                  )}
                </span>
              </div>

              {/* Modern Progress Bar */}
              <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-primary/80 to-primary"
                  style={{
                    width: `${Math.min(achievement.progress_percentage, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="text-center">
                <span className="text-2xl font-bold text-primary">
                  {achievement.progress_percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* Success State for Unlocked */}
          {achievement.is_unlocked && (
            <div className="bg-green-400/10 rounded-2xl p-6 text-center">
              <div className="w-10 h-10 bg-green-200/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-green-300 mb-1">
                Амжилттай нээгдлээ!
              </h3>
              {achievement.unlocked_at && (
                <p className="text-sm text-green-300">
                  {new Date(achievement.unlocked_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer with Claim Button */}
        {achievement.is_unlocked && achievement.reward_box_id && (
          <DrawerFooter className="border-t border-border/20 py-6 px-6">
            <button
              onClick={() => {
                window.location.href = `/boxes/${achievement.reward_box_id}?reward=true`;
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2L3 7v10l7 3 7-3V7l-7-5z"
                  clipRule="evenodd"
                />
              </svg>
              Шагналын хайрцаг нээх
            </button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AchievementCard;
