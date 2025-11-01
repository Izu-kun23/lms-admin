"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { StatsCard } from "@/components/super-admin/stats-card"
import { SystemHealthWidget } from "@/components/super-admin/system-health"
import {
  Building2,
  Users,
  BookOpen,
  Activity,
} from "lucide-react"

export default function SuperAdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["global-stats"],
    queryFn: () => apiClient.getGlobalStats(),
    refetchInterval: 60000, // Refetch every minute
  })

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of system-wide metrics and health status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Organizations"
          value={stats?.organizations.totalOrganizations || 0}
          icon={Building2}
          description={`${stats?.organizations.activeOrganizations || 0} active`}
        />
        <StatsCard
          title="Total Users"
          value={stats?.users.totalUsers || 0}
          icon={Users}
          description={`${stats?.users.activeUsers || 0} active this month`}
          trend={
            stats?.users.userGrowthRate
              ? {
                  value: stats.users.userGrowthRate,
                  label: "growth",
                  isPositive: stats.users.userGrowthRate >= 0,
                }
              : undefined
          }
        />
        <StatsCard
          title="Courses"
          value={stats?.courses.totalCourses || 0}
          icon={BookOpen}
          description={`${stats?.courses.averageEnrollmentsPerCourse || 0} avg enrollments`}
        />
        <StatsCard
          title="System Uptime"
          value={`${health?.performance.uptime || 0}%`}
          icon={Activity}
          description="Last 30 days"
        />
      </div>

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <SystemHealthWidget health={health || null} isLoading={healthLoading} />
        
        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="flex w-full items-center justify-between rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
              <span>Create Organization</span>
              <Building2 className="h-4 w-4" />
            </button>
            <button className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent">
              <span>View All Users</span>
              <Users className="h-4 w-4" />
            </button>
            <button className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent">
              <span>View All Courses</span>
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="text-2xl font-bold">{stats?.users.activeUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New This Month</span>
              <span className="text-2xl font-bold">{stats?.users.newUsersThisMonth || 0}</span>
            </div>
            {stats?.users.userGrowthRate !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <span className={`text-2xl font-bold ${stats.users.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.users.userGrowthRate >= 0 ? '+' : ''}{stats.users.userGrowthRate.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Organization Statistics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Organizations</span>
              <span className="text-2xl font-bold">
                {stats?.organizations.totalOrganizations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Organizations</span>
              <span className="text-2xl font-bold">
                {stats?.organizations.activeOrganizations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Users/Org</span>
              <span className="text-2xl font-bold">
                {Math.round(stats?.organizations.averageUsersPerOrg || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

