"use client";

import React from "react";
import { Gift, Target, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser, useMyProgress } from "@/hooks/api";
import Link from "next/link";
import {
  calculateLevelProgression,
  formatLevelProgress,
} from "@/lib/level-progression";

export function UserStatus() {
  const { data: user, isPending: userLoading } = useCurrentUser();
  const { data: achievements, isPending: achievementsLoading } =
    useMyProgress();

  if (userLoading || achievementsLoading) {
    return <UserStatusSkeleton />;
  }

  if (!user) {
    return null;
  }

  // Calculate user level progress using utility
  const levelData = calculateLevelProgression(
    user.level,
    user.experience_points
  );
  const levelTexts = formatLevelProgress(levelData);

  // Find available rewards (completed achievements not yet claimed)
  const availableRewards =
    achievements?.filter((achievement) => achievement.is_unlocked) || [];

  // Get the last unlocked achievement (most recent)
  const lastUnlockedAchievement = availableRewards.sort(
    (a, b) =>
      new Date(b.unlocked_at || 0).getTime() -
      new Date(a.unlocked_at || 0).getTime()
  )[0];

  // Find next achievement to work towards
  const nextAchievement = achievements
    ?.filter((achievement) => !achievement.is_unlocked)
    .sort((a, b) => b.progress_percentage - a.progress_percentage)[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* User XP Progress */}
      <div className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-zinc-900/95 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">
                Тавтай морилно уу
              </h3>
              <p className="text-xs text-blue-400 font-medium">
                {user.firstname && user.lastname
                  ? `${user.firstname} ${user.lastname}`
                  : user.username}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">{levelTexts.currentLevelText}</span>
            <span className="text-gray-400">{levelTexts.nextLevelText}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${levelData.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-zinc-900/95 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <Gift className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cyan-400">
                Сүүлийн амжилт
              </h3>
              <p className="text-xs text-gray-300 truncate">
                {lastUnlockedAchievement?.name || "Амжилт байхгүй"}
              </p>
            </div>
          </div>
          <div className="text-right flex items-end gap-2 font-bold text-cyan-400">
            <div>Нээгдсэн</div>
            <div
              className="text-xl"
              title={`Нээгдсэн амжилт: ${availableRewards.length}`}
            >
              {availableRewards.length}
            </div>
          </div>
        </div>

        <Link href="/profile/achievements">
          <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            Амжилтууд харах
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Next Achievement */}
      <div className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-zinc-900/95 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-emerald-400">
                Дараагийн даалгавар
              </h3>
              <p className="text-xs text-gray-300 truncate">
                {nextAchievement?.name || "Бүх амжилт дууссан!"}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div
              className="text-xs text-emerald-400 font-medium"
              title={`Үлдсэн даалгавар: ${
                achievements?.length
                  ? achievements.length - availableRewards.length
                  : 35
              }`}
            >
              {achievements?.length
                ? `${
                    achievements.length - availableRewards.length
                  } даалгавар үлдсэн`
                : "35 даалгавар үлдсэн"}
            </div>
          </div>
        </div>

        <Link href="/profile/achievements">
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            Дараагийн даалгавар харах
          </button>
        </Link>
      </div>
    </div>
  );
}

function UserStatusSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-zinc-900/95 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 shadow-xl animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-700/50 rounded-full" />
              <div className="space-y-1">
                <div className="h-4 w-20 bg-gray-700/50 rounded" />
                <div className="h-3 w-16 bg-gray-700/50 rounded" />
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-700/50 rounded" />
          </div>

          {i === 1 && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-700/50 rounded" />
                <div className="h-3 w-16 bg-gray-700/50 rounded" />
              </div>
              <div className="w-full h-2 bg-gray-700/50 rounded-full" />
            </div>
          )}

          {i !== 1 && <div className="w-full h-10 bg-gray-700/50 rounded-lg" />}
        </div>
      ))}
    </div>
  );
}

export default UserStatus;
