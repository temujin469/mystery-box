"use client";

import React from "react";
import { Paper } from "@/components/common/Paper";
import { Trophy } from "lucide-react";

const AchievementEmpty: React.FC = () => {
  return (
    <Paper className="p-12 text-center">
      {/* Empty State Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
          <Trophy className="w-10 h-10 text-muted-foreground/50" />
        </div>
      </div>
      
      {/* Empty State Message */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        Амжилт олдсонгүй
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Эхний амжилтаа нээхийн тулд хайрцаг нээж эхэлнэ үү! 
        Амжилт бүр таны түвшинг нэмэгдүүлэх болно.
      </p>
    </Paper>
  );
};

export default AchievementEmpty;
