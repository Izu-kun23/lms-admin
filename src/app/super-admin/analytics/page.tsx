"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { SuperAdminSidebarNew } from "@/components/super-admin/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/super-admin/super-admin-header"
import { SuperAdminSectionCards } from "@/components/super-admin/super-admin-section-cards"
import { SuperAdminChart } from "@/components/super-admin/super-admin-chart"
import { SuperAdminDataTable } from "@/components/super-admin/super-admin-data-table"
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
import { BarChart3, Activity, Building2, Users, BookOpen } from "lucide-react"

export default function SuperAdminAnalyticsPage() {
  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ["global-stats"],
    queryFn: () => apiClient.getGlobalStats(),
    refetchInterval: 60000,
  })

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.getOrganizations(),
  })

  const isLoading = statsLoading || orgsLoading

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
                <h1 className="text-2xl font-bold tracking-tight">
                  Platform Analytics
                </h1>
                <p className="text-muted-foreground">
                  System-wide analytics and insights across all organizations
                </p>
              </div>

              <SuperAdminSectionCards />

              <SuperAdminChart />

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organization Overview
                    </CardTitle>
                    <CardDescription>
                      Distribution of organizations and usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading organization data...
                      </div>
                    ) : globalStats ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Total Organizations
                            </div>
                            <div className="text-2xl font-bold">
                              {globalStats.organizations.totalOrganizations}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Active Organizations
                            </div>
                            <div className="text-2xl font-bold">
                              {globalStats.organizations.activeOrganizations}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Average Users per Organization
                          </div>
                          <div className="text-xl font-semibold">
                            {Math.round(globalStats.organizations.averageUsersPerOrg)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No organization data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Growth Metrics
                    </CardTitle>
                    <CardDescription>
                      Global user statistics and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading user metrics...
                      </div>
                    ) : globalStats ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Total Users
                            </div>
                            <div className="text-2xl font-bold">
                              {globalStats.users.totalUsers.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Active Users
                            </div>
                            <div className="text-2xl font-bold">
                              {globalStats.users.activeUsers.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              New This Month
                            </div>
                            <div className="text-xl font-semibold">
                              {globalStats.users.newUsersThisMonth}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Growth Rate
                            </div>
                            <div
                              className={`text-xl font-semibold ${
                                globalStats.users.userGrowthRate >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {globalStats.users.userGrowthRate >= 0 ? "+" : ""}
                              {globalStats.users.userGrowthRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No user metrics available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Performance
                  </CardTitle>
                  <CardDescription>
                    Global course statistics and enrollment metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading course performance data...
                    </div>
                  ) : globalStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Total Courses
                        </div>
                        <div className="text-2xl font-bold">
                          {globalStats.courses.totalCourses}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Active Courses
                        </div>
                        <div className="text-2xl font-bold">
                          {globalStats.courses.activeCourses}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Avg Enrollments/Course
                        </div>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            globalStats.courses.averageEnrollmentsPerCourse
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No course performance data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <SuperAdminDataTable viewType="organizations" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

