"use client";

import { Button } from "@/components/ui/button";
import { Paper } from "@/components/common/Paper";
import { useCurrentUser, useCurrentUserStats } from "@/hooks/api";
import { CreditCard, Users, Package, Swords, ArrowDown, ArrowUp, LogOut } from "lucide-react";
import Image from "next/image";

export function UserProfileHeader() {
  const { data: user, isPending } = useCurrentUser();
  const { data: stats, isPending: statsLoading } = useCurrentUserStats();

  if (isPending) {
    return (
      <Paper className="animate-pulse" variant="spacious">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-muted rounded w-40"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </Paper>
    );
  }

  // Calculate progress for next level (simulate progress)
  const currentLevel = user?.level ?? 1;
  const currentXP = (currentLevel * 250) + 150; // Simulate current XP
  const nextLevelXP = (currentLevel + 1) * 250; // XP needed for next level
  const progress = ((currentXP % 250) / 250) * 100;

  const handleTopUp = () => {
    // TODO: Implement top-up functionality
    console.log("Top-up clicked");
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  return (
    <div className="space-y-4 mb-6">
      {/* User Info Card - Responsive for all devices */}
      <Paper variant="compact" className="md:variant-default">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* Left side - User Info */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-border/20 overflow-hidden shadow-lg">
                  <Image
                    src="https://cdnb.artstation.com/p/assets/images/images/038/230/905/large/ak-graphics-media-mrx1.jpg?1622540592"
                    alt="User avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Level badge - only on mobile */}
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-background shadow-lg md:hidden">
                  {currentLevel}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 md:flex-none">
                <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                  {user?.username || "Хэрэглэгч2933853"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Бүртгэлийн огноо: {new Date().toLocaleDateString('mn-MN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Right side - Action Buttons (Desktop only) */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                onClick={handleTopUp}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Цэнэглэх
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-border/30 hover:border-border/60 px-6 py-2.5 rounded-lg font-medium backdrop-blur-sm hover:bg-muted/50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Гарах
              </Button>
            </div>
          </div>

          {/* Level Progress - Responsive */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Түвшин {currentLevel}</span>
              <span className="text-xs text-muted-foreground font-medium">
                <span className="md:hidden">{currentXP} / {nextLevelXP} XP</span>
                <span className="hidden md:inline">
                  ${(nextLevelXP - currentXP) / 100} дэлгэрэнгүй тоглоход Түвшин {currentLevel + 1}
                </span>
              </span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground md:hidden">
              <span>Дараагийн түвшин хүртэл {Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </Paper>

      {/* Action Buttons Card - Mobile Only */}
      <Paper variant="compact" className="md:hidden">
        <div className="flex gap-3">
          <Button 
            onClick={handleTopUp}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Цэнэглэх
          </Button>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex-1 border-2 border-border/30 hover:border-border/60 py-3 rounded-xl font-medium backdrop-blur-sm hover:bg-muted/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Гарах
          </Button>
        </div>
      </Paper>

      {/* Stats Grid - Responsive for all devices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Paper variant="compact" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Нээсэн хайрцаг</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats?.totalBoxesOpened || 0}
          </p>
        </Paper>
        
        <Paper variant="compact" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Нийт эд зүйл</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats?.totalItems || 0}
          </p>
        </Paper>
        
        <Paper variant="compact" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Нийт орлого</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground">
            {statsLoading ? "..." : `₮${stats?.totalDeposits?.toFixed(2) || "0.00"}`}
          </p>
        </Paper>
        
        <Paper variant="compact" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Нийт зарлага</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground">₮0.00</p>
        </Paper>
      </div>
    </div>
  );
}
