"use client";

import React from "react";
import { Paper } from "@/components/common/Paper";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementErrorProps {
  onRetry?: () => void;
  message?: string;
}

const AchievementError: React.FC<AchievementErrorProps> = ({ 
  onRetry, 
  message = "Амжилтууд ачаалагдсангүй" 
}) => {
  return (
    <Paper className="p-8 text-center">
      {/* Error Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
      </div>
      
      {/* Error Message */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {message}
      </h3>
      <p className="text-muted-foreground mb-6">
        Интернет холболтоо шалгаад дахин оролдоно уу
      </p>
      
      {/* Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Дахин оролдох
        </Button>
      )}
    </Paper>
  );
};

export default AchievementError;
