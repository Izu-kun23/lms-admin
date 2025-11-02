"use client"

import { Icon } from "@iconify/react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

// Icon components using Boxicons (rounded, thin weight)
const TrendingDown = (props: any) => <Icon icon="bx:down-arrow" {...props} />
const TrendingUp = (props: any) => <Icon icon="bx:up-arrow" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const BookOpen = (props: any) => <Icon icon="bx:book-open" {...props} />
const GraduationCap = (props: any) => <Icon icon="bx:trophy" {...props} />
const Activity = (props: any) => <Icon icon="bx:activity" {...props} />
const Server = (props: any) => <Icon icon="bx:server" {...props} />

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AdminSectionCards() {
  // API calls commented out - using mock data
  const { data: userStats } = useQuery({
    queryKey: ["admin-user-stats"],
    // queryFn: () => apiClient.getUserStats(),
    queryFn: async () => {
      return [
        {
          id: "user1",
          lastActiveAt: new Date().toISOString(),
          totalCourses: 3,
          completedCourses: 1,
        },
      ]
    },
  })

  const { data: courseStats } = useQuery({
    queryKey: ["admin-course-stats"],
    // queryFn: () => apiClient.getCourseStats(),
    queryFn: async () => {
      return [
        {
          courseId: "course1",
          totalEnrollments: 45,
          activeEnrollments: 42,
          completedEnrollments: 38,
        },
      ]
    },
  })

  const { data: health } = useQuery({
    queryKey: ["health"],
    // queryFn: () => apiClient.getHealth(),
    queryFn: async () => {
      return {
        status: "healthy",
        uptime: 99.9,
        performance: {
          uptime: 99.9,
          responseTime: 150,
        },
      }
    },
  })

  // Calculate totals
  const totalUsers = userStats?.length || 0
  const activeUsers = userStats?.filter((u: any) => 
    u.lastActiveAt && new Date(u.lastActiveAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length || 0

  const totalCourses = courseStats?.length || 0
  const totalEnrollments = courseStats?.reduce((sum: number, course: any) => 
    sum + (course.totalEnrollments || 0), 0
  ) || 0
  const activeEnrollments = courseStats?.reduce((sum: number, course: any) => 
    sum + (course.activeEnrollments || 0), 0
  ) || 0

  const completionRate = totalEnrollments > 0 
    ? ((courseStats?.reduce((sum: number, course: any) => 
        sum + (course.completedEnrollments || 0), 0) || 0) / totalEnrollments * 100).toFixed(1)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-white @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            Total Users
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeUsers} active this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            User management overview
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
              {totalCourses}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Course oversight <BookOpen className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Monitor courses and instructors
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card relative">
        <CardHeader>
          <CardDescription>
            Total Enrollments
          </CardDescription>
          <div className="relative">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalEnrollments}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Enrollment management <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {completionRate}% completion rate
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
              {health?.performance?.uptime 
                ? `${Math.min(Math.max(health.performance.uptime, 0), 100).toFixed(1)}%`
                : health?.uptime 
                  ? `${Math.min(Math.max(health.uptime, 0), 100).toFixed(1)}%`
                  : "N/A"}
            </CardTitle>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Server className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            System health monitoring <Activity className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {health?.performance?.responseTime 
              ? `Response time: ${health.performance.responseTime}ms`
              : "Platform performance"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

