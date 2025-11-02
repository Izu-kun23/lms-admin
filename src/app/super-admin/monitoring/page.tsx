"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { SuperAdminSidebarNew } from "@/components/super-admin/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/super-admin/super-admin-header"
import { SystemHealthWidget } from "@/components/super-admin/system-health"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
const Activity = (props: any) => <Icon icon="bx:activity" {...props} />
const Server = (props: any) => <Icon icon="bx:server" {...props} />
const Database = (props: any) => <Icon icon="bx:data" {...props} />
const HardDrive = (props: any) => <Icon icon="bx:hdd" {...props} />
const Cpu = (props: any) => <Icon icon="bx:chip" {...props} />
const Wifi = (props: any) => <Icon icon="bx:wifi" {...props} />

export default function SuperAdminMonitoringPage() {
  // API calls commented out - using mock data
  const { data: globalHealth, isLoading: healthLoading } = useQuery({
    queryKey: ["global-health"],
    // queryFn: () => apiClient.getGlobalHealth(),
    queryFn: async () => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          api: "healthy",
          database: "healthy",
          websocket: "healthy",
          storage: "healthy",
        },
        performance: {
          uptime: 99.9,
          responseTime: 150,
          throughput: 1000,
          errorRate: 0.1,
        },
        resources: {
          cpu: "45%",
          memory: "60%",
          storage: "75%",
          network: "30%",
        },
      }
    },
    // refetchInterval: 30000, // Refetch every 30 seconds
  })

  const { data: health, isLoading: localHealthLoading } = useQuery({
    queryKey: ["system-health"],
    // queryFn: () => apiClient.getHealth(),
    queryFn: async () => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        performance: {
          uptime: 99.9,
          responseTime: 150,
          throughput: 1000,
          errorRate: 0.1,
        },
        resources: {
          cpu: "45%",
          memory: "60%",
          storage: "75%",
          network: "30%",
        },
        services: {
          api: "healthy",
          database: "healthy",
          websocket: "healthy",
          storage: "healthy",
        },
      }
    },
    // refetchInterval: 30000,
  })

  const isLoading = healthLoading || localHealthLoading

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
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">System Monitoring</h1>
                <p className="text-muted-foreground">
                  Monitor system health, performance, and resource utilization
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SystemHealthWidget
                  health={health || null}
                  isLoading={localHealthLoading}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>
                      Real-time performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading performance metrics...
                      </div>
                    ) : globalHealth?.performance || health?.performance ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="text-lg font-semibold">
                            {globalHealth?.performance?.uptime ||
                              health?.performance?.uptime ||
                              0}
                            %
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Response Time
                          </div>
                          <div className="text-lg font-semibold">
                            {globalHealth?.performance?.responseTime ||
                              health?.performance?.responseTime ||
                              0}
                            ms
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">Throughput</div>
                          <div className="text-lg font-semibold">
                            {globalHealth?.performance?.throughput ||
                              health?.performance?.throughput ||
                              0}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">Error Rate</div>
                          <div className="text-lg font-semibold">
                            {globalHealth?.performance?.errorRate ||
                              health?.performance?.errorRate ||
                              0}
                            %
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Performance data unavailable
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Resource Utilization
                  </CardTitle>
                  <CardDescription>
                    System resource consumption metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading resource metrics...
                    </div>
                  ) : globalHealth?.resources || health?.resources ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <Cpu className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">CPU</div>
                          <div className="text-xl font-bold">
                            {globalHealth?.resources?.cpu ||
                              health?.resources?.cpu ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <Database className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Memory</div>
                          <div className="text-xl font-bold">
                            {globalHealth?.resources?.memory ||
                              health?.resources?.memory ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <HardDrive className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Storage</div>
                          <div className="text-xl font-bold">
                            {globalHealth?.resources?.storage ||
                              health?.resources?.storage ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <Wifi className="h-8 w-8 text-orange-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Network</div>
                          <div className="text-xl font-bold">
                            {globalHealth?.resources?.network ||
                              health?.resources?.network ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Resource data unavailable
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Service Status
                  </CardTitle>
                  <CardDescription>
                    Status of all platform services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading service status...
                    </div>
                  ) : globalHealth?.services || health?.services ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(
                        globalHealth?.services || health?.services || {}
                      ).map(([service, status]) => (
                        <div
                          key={service}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <div className="text-sm font-medium capitalize">
                              {service}
                            </div>
                            <Badge
                              variant={
                                status === "healthy"
                                  ? "default"
                                  : status === "degraded"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="mt-1"
                            >
                              {String(status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Service status unavailable
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

