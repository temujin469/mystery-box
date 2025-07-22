"use client";

import React from "react";
import { Paper } from "@/components/common/Paper";

const AchievementSkeleton: React.FC = () => {
  return (
    <Paper className="p-4 animate-pulse">
      {/* Achievement Image Skeleton */}
      <div className="relative w-full aspect-square rounded-lg mb-3 bg-muted/30"></div>
      
      {/* Achievement Info Skeleton */}
      <div className="space-y-2">
        {/* Title Skeleton */}
        <div className="h-4 bg-muted/30 rounded mx-auto w-3/4"></div>
        
        {/* Progress Bar Skeleton */}
        <div className="w-full bg-muted/20 rounded-full h-2">
          <div className="h-2 rounded-full bg-muted/40 w-1/3"></div>
        </div>
      </div>
    </Paper>
  );
};

export default AchievementSkeleton;
