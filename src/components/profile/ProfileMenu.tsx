"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/hooks/api";
import { ResponsiveDialog } from "@/components/common";
import { useState } from "react";
import { toast } from "sonner";

// You can replace this with a real user avatar component
function UserAvatar({ level }: { level?: number }) {
  return (
    <div className="rounded-full relative border-green-500 border-2 bg-zinc-700 flex items-center justify-center w-10 h-10">
      <User2 className="text-zinc-400 w-7 h-7" />
      <span className="absolute flex items-center justify-center bg-green-500 w-5 h-5 rounded-full bottom-[-2px] right-[-6px] border-2 border-background">
        {level ?? 0}
      </span>
    </div>
  );
}

export default function ProfileMenu() {
  const { data: user, isPending } = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("Амжилттай гарлаа");
      // Force a hard refresh to ensure all state is cleared
      window.location.href = "/";
    } catch (error) {
      // toast.error("Гарахад алдаа гарлаа");
      // Even on error, redirect to home page to clear auth state
      window.location.href = "/";
    } finally {
      setShowLogoutDialog(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  if (isPending) return <div></div>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-0 py-1 rounded-xl transition shadow-none"
          >
            <UserAvatar level={user?.level} />
          </Button>
          <Button variant="ghost" className="hover:bg-secondary hidden sm:flex">
            <span className="font-semibold text-base text-white whitespace-nowrap px-2 py-1 rounded">
              {user?.username}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 p-2 bg-card border-zinc-800 rounded-xl shadow-lg"
      >
        <div className="flex flex-col gap-1">
          <MenuItem
            icon={<User2 className="mr-3 w-5 h-5" />}
            href="/profile/items"
          >
            Нүүр хуудас
          </MenuItem>
          <MenuItem
            icon={<BoxIcon className="mr-3 w-5 h-5" />}
            href="/profile/boxes"
          >
            Нээсэн хайрцаг
          </MenuItem>
          <MenuItem
            icon={<Truck className="mr-3 w-5 h-5" />}
            href="/profile/shipments"
          >
            Хүргэлт
          </MenuItem>
          <MenuItem
            icon={<Gift className="mr-3 w-5 h-5" />}
            href="/profile/rewards"
          >
            Шагнал урамшуулал
          </MenuItem>
          <MenuItem
            icon={<Settings className="mr-3 w-5 h-5" />}
            href="/profile/settings"
          >
            Тохиргоо
          </MenuItem>
          <div className="border-t border-secondary my-1" />

          <Button
            variant="ghost"
            className={`flex justify-start group items-center px-4 py-2 rounded-lg transition hover:bg-secondary text-muted-foreground  text-base`}
            onClick={handleLogoutClick}
          >
            <div className="group-hover:text-destructive">
              <LogOut className="mr-3 w-5 h-5" />
            </div>
            Гарах
          </Button>
        </div>
      </PopoverContent>

      <ResponsiveDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Системээс гарах"
        description="Та системээс гарахдаа итгэлтэй байна уу?"
        confirmText="Гарах"
        cancelText="Цуцлах"
        confirmVariant="destructive"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={logout.isPending}
      />
    </Popover>
  );
}

function MenuItem({
  icon,
  children,
  href,
  className = "",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex group items-center px-4 py-2 rounded-lg transition hover:bg-secondary hover:text-foreground text-base font-medium ${
        isActive ? "text-primary" : "text-muted-foreground"
      } ${className}`}
    >
      <div
        className={`group-hover:text-primary ${isActive ? "text-primary" : ""}`}
      >
        {icon}
      </div>
      {children}
    </Link>
  );
}
