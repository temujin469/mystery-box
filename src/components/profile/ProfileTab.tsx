"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Mongolian tab labels and corresponding route paths
const tabs = [
  { label: "Эд зүйлс", href: "/profile/items" },
  { label: "Нээсэн хайрцаг", href: "/profile/boxes" },
  { label: "Хүргэлт", href: "/profile/shipments" },
  { label: "Шагнал урамшуулал", href: "/profile/rewards" },
  { label: "Тохиргоо", href: "/profile/settings" },
];

export function ProfileTab() {
  const pathname = usePathname()
  // find active tab by route
  const activeTab = tabs.find(tab => pathname == tab.href)?.href ?? tabs[0].href


  return (
    <Tabs value={activeTab} className="overflow-x-scroll sm:overflow-hidden">
      <TabsList className="bg-card px-2 py-1 rounded-xl shadow flex gap-2 h-[50px]">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.href}
            value={tab.href}
            asChild
            className="font-semibold text-base"
          >
            <Link href={tab.href} className="focus:outline-none">
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}