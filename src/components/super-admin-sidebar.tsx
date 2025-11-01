"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  Settings,
  Activity,
  BarChart3,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    href: "/super-admin/organizations",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/super-admin/courses",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Monitoring",
    href: "/super-admin/monitoring",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/super-admin" className="flex items-center gap-2">
          <span className="font-bebas text-2xl leading-none tracking-wide">GLACQ</span>
          <span className="text-xs text-muted-foreground">Super Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <UserMenu />
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-4 border-t p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="ml-auto rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

