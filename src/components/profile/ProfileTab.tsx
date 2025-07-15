"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Package, 
  Box, 
  Truck, 
  Gift, 
  Settings 
} from "lucide-react"

// Mongolian tab labels with icons and corresponding route paths
const tabs = [
  { 
    label: "Эд зүйл", 
    href: "/profile/items", 
    icon: Package,
    color: "text-blue-500"
  },
  { 
    label: "Хайрцаг", 
    href: "/profile/boxes", 
    icon: Box,
    color: "text-purple-500"
  },
  { 
    label: "Хүргэлт", 
    href: "/profile/shipments", 
    icon: Truck,
    color: "text-green-500"
  },
  { 
    label: "Шагнал", 
    href: "/profile/rewards", 
    icon: Gift,
    color: "text-yellow-500"
  },
  { 
    label: "Тохиргоо", 
    href: "/profile/settings", 
    icon: Settings,
    color: "text-gray-500"
  },
];

export default function ProfileTab() {
  const pathname = usePathname()

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-1 sm:w-fit">
      <div className="flex gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
                ${isActive ? 'flex-1 sm:flex-none sm:px-6' : 'sm:flex-none sm:px-6'}
                min-w-0 group
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl" />
              )}
              
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                isActive ? tab.color : 'group-hover:text-foreground'
              }`} />
              
              <span className={`
                font-semibold whitespace-nowrap text-sm transition-all duration-200 relative z-10
                ${isActive ? 'block' : 'hidden sm:block'}
              `}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}