"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  User2,
  Gift,
  LogOut,
  ChevronDown,
  Settings,
  BoxIcon,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser, useLogout } from "@/hooks/api";
import { useState, useEffect } from "react";

// Clean minimal user avatar with level indicator
function UserAvatar({ level }: { level?: number }) {
  return (
    <div className="rounded-full relative">
      {/* Main avatar */}
      <div className="relative rounded-full bg-zinc-900 border border-zinc-700 w-10 h-10">
        <img 
          src="https://cdnb.artstation.com/p/assets/images/images/038/230/905/large/ak-graphics-media-mrx1.jpg?1622540592"
          alt="User avatar"
          className="w-full h-full object-cover rounded-full over"
        />
        
        {/* Level badge */}
        <div className="absolute -bottom-1 -right-1 z-10 bg-green-500 text-zinc-200 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-900">
          {level ?? 0}
        </div>
      </div>
    </div>
  );
}

export default function ProfileMenu() {
  const { data: user, isPending } = useCurrentUser();
  const logout = useLogout();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogout = async () => {
    logout.mutateAsync();
    setDrawerOpen(false);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  if (isPending) return <div></div>;

  const desktopMenuContent = (
    <div className="p-2">
      <div className="flex flex-col gap-1">
        <MenuItem
          icon={<User2 className="mr-3 w-4 h-4" />}
          href="/profile/items"
          activeColor="text-blue-500"
          hoverColor="group-hover:text-blue-500"
        >
          Нүүр хуудас
        </MenuItem>
        <MenuItem
          icon={<BoxIcon className="mr-3 w-4 h-4" />}
          href="/profile/boxes"
          activeColor="text-purple-500"
          hoverColor="group-hover:text-purple-500"
        >
          Нээсэн хайрцаг
        </MenuItem>
        <MenuItem
          icon={<Truck className="mr-3 w-4 h-4" />}
          href="/profile/shipments"
          activeColor="text-green-500"
          hoverColor="group-hover:text-green-500"
        >
          Хүргэлт
        </MenuItem>
        <MenuItem
          icon={<Gift className="mr-3 w-4 h-4" />}
          href="/profile/achievements"
          activeColor="text-yellow-500"
          hoverColor="group-hover:text-yellow-500"
        >
          Шагнал урамшуулал
        </MenuItem>
        <MenuItem
          icon={<Settings className="mr-3 w-4 h-4" />}
          href="/profile/settings"
          activeColor="text-gray-500"
          hoverColor="group-hover:text-gray-500"
        >
          Тохиргоо
        </MenuItem>
        
        {/* Simple divider */}
        <div className="my-1 h-px bg-zinc-700"></div>

        {/* Logout button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="flex justify-start items-center px-3 py-2 rounded-md transition-colors hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-sm group"
        >
          <LogOut className="mr-3 w-4 h-4 group-hover:text-red-400 transition-colors" />
          Гарах
        </Button>
      </div>
    </div>
  );

  const mobileMenuContent = (
    <>
      {/* Minimal header section */}
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-4 bg-primary/10 rounded-2xl p-5">
          <UserAvatar level={user?.level} />
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-lg">
              {user?.username}
            </h3>
            {/* Modern progress bar */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Түвшин {user?.level ?? 0}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((user?.level ?? 0) / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Clean menu items */}
      <div className="px-4 py-4">
        <div className="space-y-1">
          <MenuItem
            icon={<User2 className="w-5 h-5" />}
            href="/profile/items"
            activeColor="text-primary"
            hoverColor="group-hover:text-primary"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Нүүр хуудас
          </MenuItem>
          <MenuItem
            icon={<BoxIcon className="w-5 h-5" />}
            href="/profile/boxes"
            activeColor="text-primary"
            hoverColor="group-hover:text-primary"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Нээсэн хайрцаг
          </MenuItem>
          <MenuItem
            icon={<Truck className="w-5 h-5" />}
            href="/profile/shipments"
            activeColor="text-primary"
            hoverColor="group-hover:text-primary"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Хүргэлт
          </MenuItem>
          <MenuItem
            icon={<Gift className="w-5 h-5" />}
            href="/profile/achievements"
            activeColor="text-primary"
            hoverColor="group-hover:text-primary"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Шагнал урамшуулал
          </MenuItem>
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            href="/profile/settings"
            activeColor="text-primary"
            hoverColor="group-hover:text-primary"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Тохиргоо
          </MenuItem>
        </div>
      </div>
    </>
  );

  const triggerButton = (
    <div className="flex gap-2 items-center">
      {/* Avatar button */}
      <Button
        variant="ghost"
        className="p-1"
      >
        <UserAvatar level={user?.level} />
      </Button>
      
      {/* Username display - only show on desktop */}
      <Button 
        variant="ghost" 
        className="hover:bg-zinc-800 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
      >
        <span className="font-medium text-sm text-zinc-200">
          {user?.username}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          {triggerButton}
        </DrawerTrigger>
        <DrawerContent className="bg-background border-border/50">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Profile Menu</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1">
            {mobileMenuContent}
          </div>
          <DrawerFooter className="pb-5">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-4 px-4 py-4 h-auto rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base font-medium">Гарах</span>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      
      {/* Clean dropdown menu */}
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 p-0 bg-card border-border/30 rounded-lg shadow-lg"
      >
        {desktopMenuContent}
      </PopoverContent>
    </Popover>
  );
}

// Clean minimal menu item component
function MenuItem({
  icon,
  children,
  href,
  className = "",
  activeColor = "",
  hoverColor = "",
  isMobile = false,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
  className?: string;
  activeColor?: string;
  hoverColor?: string;
  isMobile?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  const mobileStyles = isMobile 
    ? "flex items-center gap-4 px-4 py-4 text-base rounded-xl transition-all duration-200" 
    : "flex items-center px-3 py-2 text-sm rounded-md";
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`transition-all duration-200 group ${
        isActive 
          ? "text-foreground bg-primary/10 border-primary/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      } ${mobileStyles} ${
        isMobile ? "border border-transparent hover:border-primary/10" : ""
      } ${className}`}
    >
      <div className={`transition-colors duration-200 ${isActive ? activeColor : hoverColor}`}>
        {icon}
      </div>
      <span className={isMobile ? "font-medium" : ""}>{children}</span>
    </Link>
  );
}
