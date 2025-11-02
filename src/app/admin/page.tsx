"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminSectionCards } from "@/components/admin/admin-section-cards"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminHeader } from "@/components/admin/admin-header"
import { RecentCourses } from "@/components/admin/recent-courses"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminDashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <AdminSectionCards />
              <RecentCourses />
              <AdminChart />
              <AdminDataTable viewType="users" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

