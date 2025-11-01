"use client"

import { TrendingDown, TrendingUp, Users, BookOpen, GraduationCap, Activity } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

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
  const { data: userStats } = useQuery({
    queryKey: ["admin-user-stats"],
    queryFn: () => apiClient.getUserStats(),
  })

  const { data: courseStats } = useQuery({
    queryKey: ["admin-course-stats"],
    queryFn: () => apiClient.getCourseStats(),
  })

  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.getHealth(),
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Users className="size-4" />
              {activeUsers} active
            </Badge>
          </CardAction>
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <BookOpen className="size-4" />
              Active
            </Badge>
          </CardAction>
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Enrollments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEnrollments}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <GraduationCap className="size-4" />
              {activeEnrollments} active
            </Badge>
          </CardAction>
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>System Uptime</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {health?.performance?.uptime 
              ? `${Math.min(Math.max(health.performance.uptime, 0), 100).toFixed(1)}%`
              : health?.uptime 
                ? `${Math.min(Math.max(health.uptime, 0), 100).toFixed(1)}%`
                : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Activity className="size-4" />
              {health?.status || health?.performance?.status || "unknown"}
            </Badge>
          </CardAction>
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

