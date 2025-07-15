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
      <div className="relative rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center w-10 h-10">
        <User2 className="text-zinc-400 w-6 h-6" />
        
        {/* Level badge */}
        <div className="absolute -bottom-1 -right-1 bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-900">
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
          href="/profile/rewards"
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
      {/* Header section - only on mobile */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-center gap-4">
          <UserAvatar level={user?.level} />
          <div>
            <h3 className="font-semibold text-zinc-200 text-base">
              {user?.username}
            </h3>
            <p className="text-sm text-zinc-500">Level {user?.level ?? 0}</p>
          </div>
        </div>
      </div>
      
      {/* Menu items with mobile padding */}
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <MenuItem
            icon={<User2 className="mr-4 w-5 h-5" />}
            href="/profile/items"
            activeColor="text-blue-500"
            hoverColor="group-hover:text-blue-500"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Нүүр хуудас
          </MenuItem>
          <MenuItem
            icon={<BoxIcon className="mr-4 w-5 h-5" />}
            href="/profile/boxes"
            activeColor="text-purple-500"
            hoverColor="group-hover:text-purple-500"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Нээсэн хайрцаг
          </MenuItem>
          <MenuItem
            icon={<Truck className="mr-4 w-5 h-5" />}
            href="/profile/shipments"
            activeColor="text-green-500"
            hoverColor="group-hover:text-green-500"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Хүргэлт
          </MenuItem>
          <MenuItem
            icon={<Gift className="mr-4 w-5 h-5" />}
            href="/profile/rewards"
            activeColor="text-yellow-500"
            hoverColor="group-hover:text-yellow-500"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Шагнал урамшуулал
          </MenuItem>
          <MenuItem
            icon={<Settings className="mr-4 w-5 h-5" />}
            href="/profile/settings"
            activeColor="text-gray-500"
            hoverColor="group-hover:text-gray-500"
            isMobile={true}
            onClick={handleMenuItemClick}
          >
            Тохиргоо
          </MenuItem>
          
          {/* Mobile divider */}
          <div className="my-2 h-px bg-zinc-700"></div>

          {/* Mobile logout button with red styling */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex justify-start items-center px-4 py-4 rounded-lg transition-colors hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-base group"
          >
            <LogOut className="mr-4 w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            Гарах
          </Button>
        </div>
      </div>
    </>
  );

  const menuContent = (
    <>
      {/* Header section */}
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <UserAvatar level={user?.level} />
          <div>
            <h3 className="font-semibold text-zinc-200 text-sm">
              {user?.username}
            </h3>
            <p className="text-xs text-zinc-500">Level {user?.level ?? 0}</p>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
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
            href="/profile/rewards"
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
        <DrawerContent className="bg-zinc-900 border-zinc-700">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Profile Menu</DrawerTitle>
          </DrawerHeader>
          <div className="pb-4">
            {mobileMenuContent}
          </div>
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
        className="w-64 p-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg"
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
    ? "px-4 py-4 text-base rounded-lg" 
    : "px-3 py-2 text-sm rounded-md";
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center transition-colors group ${
        isActive 
          ? "text-zinc-200 bg-zinc-800" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
      } ${mobileStyles} ${className}`}
    >
      <div className={`transition-colors ${isActive ? activeColor : hoverColor}`}>
        {icon}
      </div>
      {children}
    </Link>
  );
}
