"use client";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useCurrentUser } from "@/hooks/api";
import { Paper } from "@/components/common";

export default function UserProfileCard() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <Paper className="text-muted-foreground flex-1 md:w-xs shadow-xl space-y-6">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            {/* Avatar Skeleton */}
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse border-4 border-muted/50" />
            {/* Badge Skeleton */}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-muted animate-pulse rounded-full border-2 border-background" />
          </div>
          <div className="flex-1">
            {/* Name Skeleton */}
            <div className="w-32 h-5 bg-muted animate-pulse rounded mb-1" />
            {/* ID Skeleton */}
            <div className="w-20 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="w-full h-2 bg-muted animate-pulse rounded-full" />
          {/* Level info */}
          <div className="flex justify-between">
            <div className="w-16 h-3 bg-muted animate-pulse rounded" />
            <div className="w-24 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-muted animate-pulse rounded" />

        {/* Credits Section Skeleton */}
        <div className="space-y-2">
          {/* Gaming Credit Row */}
          <div className="flex justify-between items-center">
            <div className="w-28 h-4 bg-muted animate-pulse rounded" />
            <div className="w-16 h-4 bg-muted animate-pulse rounded" />
          </div>
          {/* Withdrawable Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="w-24 h-4 bg-muted animate-pulse rounded" />
              <div className="w-4 h-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="w-16 h-4 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="space-y-2">
          {/* Top-up Button */}
          <div className="w-full h-14 bg-muted animate-pulse rounded-lg" />
        </div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper className="text-muted-foreground flex-1 md:w-xs shadow-xl space-y-6">
        <div className="text-center text-red-500">
          <p>Профайл ачааллахад алдаа гарлаа</p>
          <p className="text-sm mt-1">Дахин оролдоно уу</p>
        </div>
      </Paper>
    );
  }

  if (!user) {
    return (
      <Paper className="text-muted-foreground flex-1 md:w-xs shadow-xl space-y-6">
        <div className="text-center">
          <p>Профайл харахын тулд нэвтэрнэ үү</p>
        </div>
      </Paper>
    );
  }

  // Calculate level and XP
  const currentLevel = user.level || 1;
  const currentXP = user.experience_points || 0;
  const xpForNextLevel = currentLevel * 1000; // Example calculation
  const xpToNextLevel = xpForNextLevel - currentXP;
  const xpProgress = (currentXP / xpForNextLevel) * 100;

  // Get user initials for avatar
  const getInitials = (
    username: string,
    firstname?: string,
    lastname?: string
  ) => {
    if (firstname && lastname) {
      return `${firstname[0]}${lastname[0]}`.toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <Paper className="text-muted-foreground flex-1 md:w-xs shadow-xl space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 w-full">
        <div className="relative">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-cyan-400 border-4 border-cyan-400 flex items-center justify-center text-4xl font-semibold text-white">
            {getInitials(user.username, user.firstname, user.lastname)}
          </div>
          {/* Badge */}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-cyan-400 rounded-full border-2 border-background flex items-center justify-center text-white font-bold text-sm">
            {currentLevel}
          </div>
        </div>
        <div>
          <div className="font-semibold text-lg text-white leading-tight">
            {user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : user.username}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            ID: {user.id.slice(-6).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full h-2 bg-muted-foreground/20 rounded-full mb-2">
          <div
            className="h-2 bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Түвшин {currentLevel}</span>
          <span>
            {xpToNextLevel > 0
              ? `${xpToNextLevel} XP ${currentLevel + 1} түвшин хүрэх`
              : "Хамгийн дээд түвшин"}
          </span>
        </div>
      </div>

      <hr className="border-muted-foreground/20" />

      {/* Credits */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-base">Тоглоомын кредит</span>
          <span className="font-bold text-base text-white">
            {user.coins?.toLocaleString() || 0} ₮
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base flex items-center gap-1">
            Татах боломжтой
            <Info className="w-4 h-4 opacity-50" />
          </span>
          <span className="font-bold text-base text-white">
            {Math.floor((user.coins || 0) * 0.8).toLocaleString()} ₮
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button className="w-full text-base font-medium rounded-lg py-6">
          Цэнэглэх
        </Button>
      </div>

      {/* <hr className="border-muted-foreground/20" /> */}

      {/* Referrer Code */}
      {/* <div>
        <div className="font-semibold text-muted-foreground mb-2">Санал болгогчийн код</div>
        <div className="flex gap-2">
          <Input className="flex-1 bg-muted border-0 text-white" value="googleen" readOnly />
          <Button className="rounded-lg px-5 font-medium">Шинэчлэх</Button>
        </div>
      </div> */}
    </Paper>
  );
}
