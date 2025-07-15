"use client";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useCurrentUser } from "@/hooks/api";
import { Paper } from "@/components/common";
import { useModalStore } from "@/stores/modal.store";

export default function UserProfileCard() {
  const { data: user, isLoading, error } = useCurrentUser();
  const openTopup = useModalStore((state) => state.openTopup);  if (isLoading) {
    return (
      <Paper className="text-muted-foreground flex-1 md:w-sm shadow-2xl space-y-6 bg-card backdrop-blur-xl border border-primary/20 relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 bg-primary/5 opacity-60 rounded-lg"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-4 w-full relative z-10">
          <div className="relative">
            {/* Avatar Skeleton with solid color */}
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse border-2 border-primary/20 shadow-xl ring-2 ring-primary/20" />
            {/* Badge Skeleton */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-muted animate-pulse rounded-full border-2 border-card ring-1 ring-primary/30" />
          </div>
          <div className="flex-1">
            {/* Name Skeleton */}
            <div className="w-32 h-5 bg-muted animate-pulse rounded mb-2" />
            {/* ID Skeleton */}
            <div className="w-20 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Enhanced Progress Bar Skeleton */}
        <div className="space-y-2 relative z-10">
          <div className="w-full h-3 bg-muted/60 animate-pulse rounded-full border border-primary/20" />
          <div className="flex justify-between">
            <div className="w-16 h-3 bg-muted animate-pulse rounded" />
            <div className="w-32 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Enhanced Gaming divider skeleton */}
        <div className="relative z-10">
          <div className="h-px bg-muted animate-pulse rounded" />
          <div className="flex justify-center -mt-1">
            <div className="w-2 h-2 bg-muted animate-pulse rounded-full" />
          </div>
        </div>

        {/* Enhanced Credits Section Skeleton */}
        <div className="space-y-3 relative z-10">
          <div className="p-4 rounded-xl bg-muted/50 border border-border animate-pulse backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="w-28 h-4 bg-muted animate-pulse rounded" />
              <div className="w-20 h-5 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Enhanced Action Button Skeleton */}
        <div className="space-y-2 relative z-10">
          <div className="w-full h-14 bg-muted animate-pulse rounded-xl border border-border ring-1 ring-primary/20" />
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
    <Paper className="text-muted-foreground flex-1 md:w-sm shadow-2xl space-y-6 bg-card backdrop-blur-xl border border-primary/20 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 bg-primary/5 opacity-60 rounded-lg"></div>
      <div className="absolute inset-0 bg-accent/3 opacity-50 rounded-lg"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary shadow-lg"></div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 w-full relative z-10">        <div className="relative group">
          {/* Enhanced Avatar with theme colors */}
          <div className="relative w-16 h-16 rounded-full bg-primary border-2 border-primary/40 flex items-center justify-center text-xl font-bold text-primary-foreground shadow-2xl ring-2 ring-primary/30">
            {getInitials(user.username, user.firstname, user.lastname)}

            {/* Enhanced inner glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-card/30 via-card/10 to-transparent"></div>
            
            {/* Outer glow ring */}
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"></div>
          </div>

          {/* Enhanced Level badge */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-accent to-primary rounded-full border-2 border-card/40 flex items-center justify-center text-accent-foreground font-bold text-xs shadow-xl ring-1 ring-accent/50">
            {currentLevel}
          </div>
        </div>

        <div className="flex-1">
          <div className="font-bold text-lg leading-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
            {user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : user.username}
          </div>
          <div className="text-xs text-primary font-medium tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            ID: {user.id.slice(-6).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative z-10">
        <div className="w-full h-3 bg-muted/60 rounded-full mb-2 border border-primary/20 overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 shadow-[0_0_15px_hsl(var(--primary)/0.6)] relative"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          >
            <div className="h-full bg-gradient-to-b from-card/40 via-card/20 to-transparent rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-primary flex items-center gap-1">
            <span className="w-1 h-1 bg-primary rounded-full"></span>
            Түвшин {currentLevel}
          </span>
          <span className="text-muted-foreground">
            {xpToNextLevel > 0
              ? `${xpToNextLevel} XP → Түвшин ${currentLevel + 1}`
              : "Хамгийн дээд түвшин"}
          </span>
        </div>
      </div>

      {/* Enhanced Gaming-style divider */}
      <div className="relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="flex justify-center -mt-1">
          <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Enhanced Gaming Credits Section with theme colors */}
      <div className="space-y-3 relative z-10">
        <div className="relative overflow-hidden p-4 rounded-xl bg-accent/20 border border-accent/30 backdrop-blur-sm shadow-lg">
          {/* Card background pattern */}
          <div className="absolute inset-0 bg-accent/10 rounded-xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full shadow-lg"></div>
              <span className="text-base font-semibold text-accent tracking-wide flex items-center gap-2">
                Тоглоомын кредит
                <Info className="w-4 h-4 opacity-70 hover:opacity-100 transition-all duration-200 hover:text-primary" />
              </span>
            </div>
            <span className="font-bold text-xl text-accent drop-shadow-lg">
              {user.coins?.toLocaleString() || 0} ₮
            </span>
          </div>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/5 to-transparent -skew-x-12 translate-x-full animate-pulse"></div>
        </div>
      </div>      {/* Enhanced Action Button with theme colors */}
      <div className="space-y-2 relative z-10">
        <Button
          className="w-full text-base font-bold rounded-xl py-6 bg-primary hover:bg-primary/90 border border-primary/40 shadow-2xl hover:shadow-primary/30 transition-all duration-300 group relative overflow-hidden ring-1 ring-primary/20 hover:ring-primary/40 text-primary-foreground"
          onClick={() => openTopup()}
        >
          {/* Enhanced button glow effect */}
          <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
          
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          {/* Button content */}
          <span className="relative z-10 flex items-center justify-center gap-2 text-primary-foreground drop-shadow-lg">
            💎 Цэнэглэх
          </span>
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
