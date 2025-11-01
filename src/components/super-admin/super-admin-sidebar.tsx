"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSearch,
  IconActivity,
  IconBuilding,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

export function SuperAdminSidebarNew({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const navMain = [
    {
      title: "Dashboard",
      url: "/super-admin",
      icon: IconDashboard,
    },
    {
      title: "Organizations",
      url: "/super-admin/organizations",
      icon: IconBuilding,
    },
    {
      title: "Users",
      url: "/super-admin/users",
      icon: IconUsers,
    },
    {
      title: "Courses",
      url: "/super-admin/courses",
      icon: IconBook,
    },
    {
      title: "Analytics",
      url: "/super-admin/analytics",
      icon: IconChartBar,
    },
    {
      title: "Monitoring",
      url: "/super-admin/monitoring",
      icon: IconActivity,
    },
  ]

  const navSecondary = [
    {
      title: "Settings",
      url: "/super-admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/super-admin/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ]

  const userData = {
    name: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "Super Admin",
    email: user?.email || "superadmin@example.com",
    avatar: "/avatars/super-admin.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/super-admin">
                <span className="font-bebas text-2xl leading-none tracking-wide">GLACQ</span>
                <span className="text-sm font-semibold ml-2">Super Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

