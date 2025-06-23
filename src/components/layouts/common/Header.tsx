"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxIcon, Gamepad, GiftIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AuthModal } from "@/components/modal";
import { ProfileMenu } from "@/components/profile";
import clsx from "clsx";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  const isAuth = true;
  return (
    <header
      className={clsx(
        "bg-card py-2 shadow-md h-[60px] flex items-center sticky top-0 z-50 transition-transform duration-300",
        // isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-between px-3 w-full">
        <div className="flex items-center gap-20">
          <Link href="/">
            <div className="flex items-center gap-3">
              {/* <Image src="/logo.svg" alt="Лого" width={40} height={40} /> */}
              <span className="font-bold flex items-center text-2xl gap-2 text-card-foreground">
                <BoxIcon size={35} /> ATTILA
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Button className="bg-primary/10">
              <Link href="#" className=" flex items-center gap-2">
                <Gamepad />
                НУУЦЛАГ ХАЙРЦАГ
              </Link>
            </Button>
            <Button className="bg-primary/10 hidden xl:block">
              <Link href="#" className=" flex items-center gap-2">
                <GiftIcon /> ҮНЭГҮЙ НУУЦЛАГ ХАЙРЦАГ
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3 ">
          <div className="bg-secondary rounded flex items-center h-9 font-bold">
            <p className="px-3 text-foreground">₮ 100,000</p>
            <Button className="bg-primary flex items-center justify-center h-9 w-9 rounded-r-sm rounded-l-none">
              <Plus size={30} strokeWidth={"3"}/>
            </Button>
          </div>

          {isAuth ? (
            <ProfileMenu />
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-card-foreground hidden xl:block"
                onClick={() => setOpen(true)}
              >
                НЭВТРЭХ
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 rounded"
                onClick={() => setOpen(true)}
              >
                БҮРТГҮҮЛЭХ
              </Button>
            </>
          )}
        </div>
      </div>
      <AuthModal open={open} onOpenChange={setOpen} variant="signup" />
    </header>
  );
}