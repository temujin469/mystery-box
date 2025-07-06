"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxIcon, Gamepad, GiftIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AuthModal } from "@/components/modal";
import { ProfileMenu } from "@/components/profile";
import clsx from "clsx";
import { useCurrentUser } from "@/hooks/api";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

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
        "bg-card py-2 shadow-md h-[60px] flex items-center sticky top-0 z-50 transition-transform duration-300 border-b border-border/40",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-between px-3 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-8 lg:gap-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-bold flex items-center text-2xl gap-2 text-card-foreground group-hover:text-primary transition-colors">
              <BoxIcon size={35} className="text-primary" />
              ATTILA
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/boxes">
              <Button className="bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="flex items-center gap-2">
                  <Gamepad size={18} />
                  НУУЦЛАГ ХАЙРЦАГ
                </div>
              </Button>
            </Link>
            <Link href="/free-boxes" className="hidden xl:block">
              <Button className="bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="flex items-center gap-2">
                  <GiftIcon size={18} />
                  ҮНЭГҮЙ НУУЦЛАГ ХАЙРЦАГ
                </div>
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {/* Coins/Balance Section */}
          <div className="bg-secondary rounded flex items-center h-9 font-bold overflow-hidden">
            {isAuthLoading ? (
              <div className="flex items-center px-3">
                <div className="w-12 h-4 bg-primary/30 animate-pulse rounded mr-2" />
                <span className="text-foreground">₮</span>
              </div>
            ) : isAuth ? (
              <p className="px-3 text-foreground whitespace-nowrap">
                {user?.coins?.toLocaleString() || 0} ₮
              </p>
            ) : (
              <p className="px-3 text-foreground">0 ₮</p>
            )}
            <Button 
              className="bg-primary hover:bg-primary/90 flex items-center justify-center h-9 w-9 rounded-r-sm rounded-l-none transition-colors"
              disabled={isAuthLoading}
              aria-label="Add coins"
            >
              <Plus size={18} strokeWidth={2.5} />
            </Button>
          </div>

          {/* Authentication Section */}
          {isAuthLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-20 h-9 bg-secondary/50 animate-pulse rounded hidden md:block" />
              <div className="w-10 h-10 bg-secondary/50 animate-pulse rounded-full md:w-24 md:h-9 md:rounded" />
            </div>
          ) : isAuth ? (
            <ProfileMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-card-foreground hidden md:block hover:bg-secondary/50 transition-colors"
                onClick={() => setOpen(true)}
              >
                НЭВТРЭХ
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 rounded transition-colors"
                onClick={() => setOpen(true)}
              >
                БҮРТГҮҮЛЭХ
              </Button>
            </div>
          )}
        </div>
      </div>
      <AuthModal open={open} onOpenChange={setOpen} variant="signup" />
    </header>
  );
}
