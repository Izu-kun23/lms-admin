"use client"

import { SuperAdminSidebarNew } from "@/components/super-admin/super-admin-sidebar"
import { SuperAdminSectionCards } from "@/components/super-admin/super-admin-section-cards"
import { SuperAdminChart } from "@/components/super-admin/super-admin-chart"
import { SuperAdminDataTable } from "@/components/super-admin/super-admin-data-table"
import { SuperAdminHeader } from "@/components/super-admin/super-admin-header"
import { SystemHealthWidget } from "@/components/super-admin/system-health"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export default function SuperAdminDashboard() {
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SuperAdminSidebarNew variant="inset" />
      <SidebarInset>
        <SuperAdminHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SuperAdminSectionCards />
              <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
                <div className="px-0">
                  <SuperAdminChart />
                </div>
                <SystemHealthWidget health={health || null} isLoading={healthLoading} />
              </div>
              <div className="px-4 lg:px-6">
                <SuperAdminDataTable viewType="organizations" />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

