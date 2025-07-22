"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxIcon, Gamepad, GiftIcon, Plus, Coins } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ProfileMenu } from "@/components/profile";
import clsx from "clsx";
import { useCurrentUser } from "@/hooks/api";
import { useModalStore } from "@/stores/modal.store";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const openAuth = useModalStore((state) => state.openAuth);
  const openTopup = useModalStore((state) => state.openTopup);

  // User logs in via AuthModal
  // await login.mutateAsync(credentials);
  // React Query invalidates cache
  // useCurrentUser refetches
  // user data is available, isLoading = false
  // Shows ProfileMenu
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isAuth = !!user && !isAuthLoading;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show header when scrolling up or at the top. Hide when scrolling down.
      if (scrollY < 10 || scrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (scrollY > lastScrollY.current) {
        setIsVisible(false);
      }
      lastScrollY.current = scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "py-2 shadow-lg h-[60px] flex items-center sticky top-0 z-50 border-b border-border/40 transition-transform duration-300",
        // Enhanced glassmorphism background
        "bg-gray-900/80 backdrop-blur-xl",
        // Subtle gradient overlay
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/5 before:via-purple-500/10 before:to-pink-500/5 before:pointer-events-none",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-between px-3 sm:px-6 w-full max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-8 lg:gap-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-bold flex items-center text-2xl gap-2 text-card-foreground group-hover:text-primary transition-colors">
                <Image alt="logo" src="/logo.png" width={33} height={33}/>
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/boxes">
              <Button className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 backdrop-blur-sm border border-primary/20 hover:border-primary/30">
                <div className="flex items-center gap-2">
                  <Gamepad size={18} />
                  НУУЦЛАГ ХАЙРЦАГ
                </div>
              </Button>
            </Link>
            <Link href="/free-boxes" className="hidden xl:block">
              <Button className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 backdrop-blur-sm border border-primary/20 hover:border-primary/30">
                <div className="flex items-center gap-2">
                  <GiftIcon size={18} />
                  ҮНЭГҮЙ НУУЦЛАГ ХАЙРЦАГ
                </div>
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {/* Enhanced Coins/Balance Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 flex items-center h-9 font-bold overflow-hidden relative">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5" />

            {isAuthLoading ? (
              <div className="flex items-center px-3 relative">
                <div className="w-12 h-4 bg-primary/30 rounded mr-2 animate-pulse" />
                <span className="text-foreground">₮</span>
              </div>
            ) : isAuth ? (
              <div className="flex items-center px-3 relative">
                <Coins size={16} className="text-yellow-500 mr-2" />
                <p className="text-foreground whitespace-nowrap">
                  {user?.coins?.toLocaleString() || 0} ₮
                </p>
              </div>
            ) : (
              <div className="flex items-center px-3 relative">
                <Coins size={16} className="text-gray-500 mr-2" />
                <p className="text-foreground">0 ₮</p>
              </div>
            )}

            {/* Enhanced top up button */}
            {isAuth ? (
              <Button
                className="bg-gradient-to-r z-10 from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 flex items-center justify-center h-9 w-9 rounded-r-lg rounded-l-none transition-all duration-300 shadow-lg shadow-primary/25"
                disabled={isAuthLoading}
                onClick={() => openTopup()}
              >
                <Plus size={18} strokeWidth={2.5} />
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r z-10 from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 flex items-center justify-center h-9 w-9 rounded-r-lg rounded-l-none transition-all duration-300 shadow-lg shadow-primary/25"
                disabled={isAuthLoading}
                onClick={() => openAuth("signin")}
              >
                <Plus size={18} strokeWidth={2.5} />
              </Button>
            )}
          </div>

          {/* Enhanced Authentication Section */}
          {isAuthLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-20 h-9 bg-secondary/50 rounded hidden md:block animate-pulse" />
              <div className="w-10 h-10 bg-secondary/50 rounded-full md:w-24 md:h-9 md:rounded animate-pulse" />
            </div>
          ) : isAuth ? (
            <ProfileMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-card-foreground hidden md:block hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-gray-700/50"
                onClick={() => openAuth("signin")}
              >
                НЭВТРЭХ
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded transition-all duration-300 shadow-lg shadow-primary/25"
                onClick={() => openAuth("signup")}
              >
                БҮРТГҮҮЛЭХ
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
