"use client"

import * as React from "react"
import { Icon } from "@iconify/react"

// Icon components using Boxicons (rounded, thin weight) - using bx prefix for regular Boxicons
const IconDashboard = (props: any) => <Icon icon="bx:grid-alt" width="16" height="16" {...props} />
const IconUsers = (props: any) => <Icon icon="bx:group" width="16" height="16" {...props} />
const IconBook = (props: any) => <Icon icon="bx:book" width="16" height="16" {...props} />
const IconChartBar = (props: any) => <Icon icon="bx:bar-chart-alt-2" width="16" height="16" {...props} />
const IconSettings = (props: any) => <Icon icon="bx:cog" width="16" height="16" {...props} />
const IconHelp = (props: any) => <Icon icon="bx:help-circle" width="16" height="16" {...props} />
const IconSearch = (props: any) => <Icon icon="bx:search" width="16" height="16" {...props} />
const IconSchool = (props: any) => <Icon icon="bx:user-plus" width="16" height="16" {...props} />
const IconMessageCircle = (props: any) => <Icon icon="bx:message-rounded-dots" width="16" height="16" {...props} />
const IconBuilding = (props: any) => <Icon icon="bx:building" width="16" height="16" {...props} />

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
import { useRouter } from "next/navigation"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const navSections = [
    {
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: IconDashboard,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          title: "Organizations",
          url: "/admin/organizations",
          icon: IconBuilding,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: IconUsers,
        },
        {
          title: "Courses",
          url: "/admin/courses",
          icon: IconBook,
        },
        {
          title: "Enrollments",
          url: "/admin/enrollments",
          icon: IconSchool,
        },
      ],
    },
    {
      label: "Insights",
      items: [
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: IconChartBar,
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          title: "Support",
          url: "/admin/support",
          icon: IconMessageCircle,
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
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
      : user?.email || "Admin",
    email: user?.email || "admin@example.com",
    avatar: "/avatars/admin.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin">
                <span className="font-bebas text-2xl leading-none tracking-wide">GLACQ</span>
                <span className="text-sm font-semibold ml-2">Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={navSections} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

