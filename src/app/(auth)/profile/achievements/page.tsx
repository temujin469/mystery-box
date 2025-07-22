"use client";

import React from "react";
import { useMyProgress } from "@/hooks/api";
import { Paper } from "@/components/common/Paper";
import { 
  AchievementCard, 
  AchievementSkeleton, 
  AchievementError, 
  AchievementEmpty 
} from "@/components/profile/achievement";
import HeaderWithIcon from "@/components/common/HeaderWithIcon";

const AchievementsPage = () => {
  const { data: achievements, isLoading, error, refetch } = useMyProgress();

  if (isLoading) {
    return (
      <div>
        <HeaderWithIcon
          icon="🏆"
          title="Миний амжилтууд"
          subtitle="Ачаалж байна..."
        />
        
        {/* Progress Overview Skeleton */}
        <Paper className="p-6 mb-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-6 bg-muted/30 rounded w-24 mb-2"></div>
              <div className="h-4 bg-muted/20 rounded w-32"></div>
            </div>
            <div className="text-right">
              <div className="h-8 w-16 bg-muted/30 rounded"></div>
            </div>
          </div>
          
          {/* Progress Bar Skeleton */}
          <div className="w-full bg-muted/20 rounded-full h-3">
            <div className="h-3 rounded-full bg-muted/40 w-1/3"></div>
          </div>
        </Paper>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, index) => (
            <AchievementSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderWithIcon
          icon="🏆"
          title="Миний амжилтууд"
          subtitle="Алдаа гарлаа"
        />
        <AchievementError onRetry={() => refetch()} />
      </div>
    );
  }

  const unlockedCount = achievements?.filter((a) => a.is_unlocked).length || 0;
  const totalCount = achievements?.length || 0;
  const completionPercentage =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="">
      <HeaderWithIcon
        icon="🏆"
        title="Миний амжилтууд"
      />

      {/* Progress Overview */}
      <Paper className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Нийт явц</h2>
            <p className="text-gray-600">
              {totalCount}-с {unlockedCount} амжилт
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </Paper>

      {/* Achievements Grid */}
      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <AchievementEmpty />
      )}
    </div>
  );
};

export default AchievementsPage;
