"use client";
import Link from "next/link";
import { Paper } from "../common";
import { Box, Gift, MapPinned, Package, Settings, Truck } from "lucide-react";
import { usePathname } from "next/navigation";

const navs = [
  {
    label: "Эд зүйл",
    href: "/profile/items",
    icon: Package,
    color: "text-purple-500",
  },
  {
    label: "Хайрцаг",
    href: "/profile/boxes",
    icon: Box,
    color: "text-blue-500",
  },
  {
    label: "Захиалга",
    href: "/profile/orders",
    icon: Truck,
    color: "text-orange-500",
  },
  {
    label: "Хүргэлт",
    href: "/profile/shipments",
    icon: MapPinned,
    color: "text-green-500",
  },
  {
    label: "Шагнал",
    href: "/profile/achievements",
    icon: Gift,
    color: "text-yellow-500",
  },
  {
    label: "Тохиргоо",
    href: "/profile/settings",
    icon: Settings,
    color: "text-gray-500",
  },
];

export default function ProfileNav() {
  const pathname = usePathname();
  return (
    <Paper variant="compact">
      <ul className="flex flex-col gap-3">
        {navs?.map((nav) => {
          const Icon = nav.icon;
          const isActive = nav.href == pathname;
          return (
            <Link href={nav.href}>
              <li
                className={`flex items-center group gap-3 px-5 py-3 cursor-pointer hover:bg-accent rounded-lg ${
                  isActive
                    ? `bg-secondary ${nav.color}`
                    : "bg-secondary/30 text-foreground/80"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    isActive ? "bg-white/10" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    className={`group-hover:${nav.color} ${
                      isActive ? nav.color : ""
                    }`}
                  />
                </div>

                <div
                  className={`group-hover:${nav.color} ${
                    isActive ? nav.color : ""
                  }`}
                >
                  {nav.label}
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </Paper>
  );
}
