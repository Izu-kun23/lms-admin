"use client"

import { Icon } from "@iconify/react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

// Icon components using Boxicons (rounded, thin weight)
const IconTrendingUp = (props: any) => <Icon icon="bx:up-arrow" {...props} />
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
const Activity = (props: any) => <Icon icon="bx:activity" {...props} />

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SuperAdminSectionCards() {
  // API calls commented out - using mock data
  const { data: stats, isLoading } = useQuery({
    queryKey: ["global-stats"],
    // queryFn: () => apiClient.getGlobalStats(),
    queryFn: async () => {
      return {
        users: {
          totalUsers: 25000,
          activeUsers: 15000,
          newUsersThisMonth: 500,
          userGrowthRate: 12.5,
        },
        organizations: {
          totalOrganizations: 15,
          activeOrganizations: 14,
          averageUsersPerOrg: 1667,
        },
        courses: {
          totalCourses: 500,
          activeCourses: 450,
          averageEnrollmentsPerCourse: 45,
        },
        system: {
          uptime: 99.9,
          averageResponseTime: 150,
        },
      }
    },
    // refetchInterval: 60000, // Refetch every minute
  })

  const { data: health } = useQuery({
    queryKey: ["system-health"],
    // queryFn: () => apiClient.getHealth(),
    queryFn: async () => {
      return {
        status: "healthy",
        performance: {
          uptime: 99.9,
          responseTime: 150,
        },
      }
    },
    // refetchInterval: 30000, // Refetch every 30 seconds
  })

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-white lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            Organizations
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats?.organizations.totalOrganizations || 0}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardAction>
            <Badge variant="outline">
              <Building2 className="size-4" />
              {stats?.organizations.activeOrganizations || 0} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Organization management <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Avg {Math.round(stats?.organizations.averageUsersPerOrg || 0)} users/org
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            Total Users
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats?.users.totalUsers || 0}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardAction>
            <Badge variant="outline">
              <Users className="size-4" />
              {stats?.users.activeUsers || 0} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats?.users.newUsersThisMonth || 0} new this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {stats?.users.userGrowthRate !== undefined && (
              <span className={stats.users.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                {stats.users.userGrowthRate >= 0 ? '+' : ''}{stats.users.userGrowthRate.toFixed(1)}% growth
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            Total Courses
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats?.courses.totalCourses || 0}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardAction>
            <Badge variant="outline">
              <BookOpen className="size-4" />
              {stats?.courses.activeCourses || 0} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Global course oversight <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Avg {stats?.courses.averageEnrollmentsPerCourse || 0} enrollments/course
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            System Uptime
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {health?.performance.uptime || stats?.system.uptime || 0}%
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardAction>
            <Badge variant="outline">
              <Activity className="size-4" />
              {health?.status || "healthy"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Platform health monitoring <Activity className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Response time: {health?.performance.responseTime || stats?.system.averageResponseTime || 0}ms
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

