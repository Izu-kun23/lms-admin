"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSectionCards } from "@/components/admin/admin-section-cards"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminDataTable } from "@/components/admin/admin-data-table"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
const BarChart3 = (props: any) => <Icon icon="bx:bar-chart-alt-2" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
const TrendingUp = (props: any) => <Icon icon="bx:up-arrow" {...props} />
const Activity = (props: any) => <Icon icon="bx:activity" {...props} />

export default function AdminAnalyticsPage() {
  // API calls commented out - using mock data
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ["admin-user-stats"],
    // queryFn: () => apiClient.getUserStats(),
    queryFn: async () => {
      return [
        {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "STUDENT",
          lastActiveAt: "2024-01-20T14:30:00Z",
          totalCourses: 3,
          completedCourses: 1,
          totalMessages: 15,
          totalQuizAttempts: 8,
          averageQuizScore: 85.5,
        },
      ]
    },
  })

  const { data: courseStats, isLoading: courseStatsLoading } = useQuery({
    queryKey: ["admin-course-stats"],
    // queryFn: () => apiClient.getCourseStats(),
    queryFn: async () => {
      return [
        {
          courseId: "course1",
          courseTitle: "Introduction to Computer Science",
          totalEnrollments: 45,
          activeEnrollments: 42,
          completedEnrollments: 38,
          averageProgress: 78.5,
          averageGrade: 82.3,
          instructorRating: 4.7,
        },
      ]
    },
  })

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["health"],
    // queryFn: () => apiClient.getHealth(),
    queryFn: async () => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: 99.9,
        activeUsers: 1250,
        databaseStatus: "connected",
        storageUsage: "75%",
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
  })

  // Calculate role distribution
  const roleDistribution = React.useMemo(() => {
    if (!userStats) return {}
    const distribution: Record<string, number> = {}
    userStats.forEach((user: any) => {
      distribution[user.role] = (distribution[user.role] || 0) + 1
    })
    return distribution
  }, [userStats])

  // Calculate average metrics
  const averageMetrics = React.useMemo(() => {
    if (!userStats || userStats.length === 0) {
      return {
        averageCourses: "0",
        averageCompletionRate: "0",
        averageQuizScore: "0",
      }
    }

    const totalCourses = userStats.reduce(
      (sum: number, user: any) => sum + (user.totalCourses || 0),
      0
    )
    const totalCompleted = userStats.reduce(
      (sum: number, user: any) => sum + (user.completedCourses || 0),
      0
    )
    const totalQuizScores = userStats
      .filter((u: any) => u.averageQuizScore)
      .reduce((sum: number, user: any) => sum + (user.averageQuizScore || 0), 0)
    const usersWithQuizScores = userStats.filter((u: any) => u.averageQuizScore).length

    return {
      averageCourses: (totalCourses / userStats.length).toFixed(1),
      averageCompletionRate: totalCourses > 0
        ? ((totalCompleted / totalCourses) * 100).toFixed(1)
        : "0",
      averageQuizScore: usersWithQuizScores > 0
        ? (totalQuizScores / usersWithQuizScores).toFixed(1)
        : "0",
    }
  }, [userStats])

  const isLoading = userStatsLoading || courseStatsLoading || healthLoading

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
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
                <p className="text-muted-foreground">
                  Comprehensive analytics and insights for your organization
                </p>
              </div>

              <AdminSectionCards />

              <AdminChart />

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Statistics
                    </CardTitle>
                    <CardDescription>
                      User activity and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading user statistics...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Average Courses</div>
                            <div className="text-2xl font-bold">
                              {averageMetrics.averageCourses}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Completion Rate
                            </div>
                            <div className="text-2xl font-bold">
                              {averageMetrics.averageCompletionRate}%
                            </div>
                          </div>
                        </div>
                        {Number(averageMetrics.averageQuizScore) > 0 && (
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Average Quiz Score
                            </div>
                            <div className="text-2xl font-bold">
                              {averageMetrics.averageQuizScore}%
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium mb-2">Role Distribution</div>
                          <div className="space-y-2">
                            {Object.entries(roleDistribution).map(([role, count]) => (
                              <div
                                key={role}
                                className="flex items-center justify-between"
                              >
                                <Badge variant="outline">{role}</Badge>
                                <span className="font-semibold">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Course Analytics
                    </CardTitle>
                    <CardDescription>
                      Course performance and enrollment metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading course analytics...
                      </div>
                    ) : courseStats && courseStats.length > 0 ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {courseStats.slice(0, 5).map((course: any) => (
                            <div
                              key={course.courseId || course.id}
                              className="flex items-center justify-between p-2 rounded-md border"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {course.courseTitle || course.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {course.totalEnrollments || course.enrollments?.length || 0}{" "}
                                  enrollments
                                </div>
                              </div>
                              {course.averageGrade && (
                                <Badge variant="secondary">
                                  {course.averageGrade.toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                        {courseStats.length > 5 && (
                          <div className="text-sm text-muted-foreground text-center">
                            +{courseStats.length - 5} more courses
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No course data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Performance
                  </CardTitle>
                  <CardDescription>
                    Platform health and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading system health...
                    </div>
                  ) : health ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Status</div>
                        <Badge
                          variant={
                            health.status === "healthy" ? "default" : "destructive"
                          }
                        >
                          {health.status || "unknown"}
                        </Badge>
                      </div>
                      {health.performance && (
                        <>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Response Time
                            </div>
                            <div className="text-lg font-semibold">
                              {health.performance.responseTime}ms
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Error Rate
                            </div>
                            <div className="text-lg font-semibold">
                              {health.performance.errorRate}%
                            </div>
                          </div>
                        </>
                      )}
                      {health.uptime !== undefined && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Uptime</div>
                          <div className="text-lg font-semibold">{health.uptime}%</div>
                        </div>
                      )}
                      {health.resources && (
                        <>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">CPU</div>
                            <div className="text-lg font-semibold">{health.resources.cpu}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Memory</div>
                            <div className="text-lg font-semibold">
                              {health.resources.memory}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Storage</div>
                            <div className="text-lg font-semibold">
                              {health.resources.storage}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      System health data unavailable
                    </div>
                  )}
                </CardContent>
              </Card>

              <AdminDataTable viewType="users" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

