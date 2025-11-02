"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
const ArrowRight = (props: any) => <Icon icon="bx:chevron-right" {...props} />
const Clock = (props: any) => <Icon icon="bx:time" {...props} />

interface AdminDataTableProps {
  viewType?: "users" | "courses"
}

export function AdminDataTable({ viewType = "users" }: AdminDataTableProps) {
  const router = useRouter()
  
  // API calls commented out - using mock data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    // queryFn: () => apiClient.getAllUsers(),
    queryFn: async () => {
      return [
        {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "STUDENT",
          totalCourses: 3,
          lastActiveAt: "2024-01-20T10:00:00Z",
        },
        {
          id: "user2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          role: "INSTRUCTOR",
          totalCourses: 5,
          lastActiveAt: "2024-01-19T14:30:00Z",
        },
        {
          id: "user3",
          firstName: "Michael",
          lastName: "Johnson",
          email: "michael@example.com",
          role: "STUDENT",
          totalCourses: 2,
          lastActiveAt: "2024-01-18T09:15:00Z",
        },
        {
          id: "user4",
          firstName: "Sarah",
          lastName: "Williams",
          email: "sarah@example.com",
          role: "ADMIN",
          totalCourses: 0,
          lastActiveAt: "2024-01-17T16:45:00Z",
        },
        {
          id: "user5",
          firstName: "David",
          lastName: "Brown",
          email: "david@example.com",
          role: "STUDENT",
          totalCourses: 4,
          lastActiveAt: "2024-01-16T11:20:00Z",
        },
      ]
    },
    enabled: viewType === "users",
  })

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    // queryFn: () => apiClient.getCourses(),
    queryFn: async () => {
      return [
        {
          id: "course1",
          title: "Introduction to CS",
          code: "CS101",
          instructor: { firstName: "Dr. Jane", lastName: "Smith" },
          enrollments: [{ id: "enroll1" }],
          createdAt: "2024-01-20T10:00:00Z",
        },
      ]
    },
    enabled: viewType === "courses",
  })

  const isLoading = viewType === "users" ? usersLoading : coursesLoading

  const roleColors: Record<string, string> = {
    STUDENT: "default",
    INSTRUCTOR: "secondary",
    ADMIN: "destructive",
    SUPER_ADMIN: "outline",
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`
      }
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {viewType === "users" ? "Recent Users" : "Recent Courses"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (viewType === "users") {
    const recentUsers = Array.isArray(users) ? users.slice(0, 5) : []
    
    return (
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Recent Users
              </CardTitle>
              <CardDescription className="mt-1">
                Latest user activity in your organization
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/users")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-1">
              {recentUsers.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-muted/30 ${
                    index < recentUsers.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <Badge
                            variant={roleColors[user.role] as any || "outline"}
                            className="text-xs px-1.5 py-0 h-5"
                          >
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{user.totalCourses || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground w-24">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {user.lastActiveAt
                          ? formatRelativeTime(user.lastActiveAt)
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Courses view
  const recentCourses = Array.isArray(courses) ? courses.slice(0, 10) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Recent Courses
        </CardTitle>
        <CardDescription>Latest courses in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              recentCourses.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.code || "N/A"}</TableCell>
                  <TableCell>
                    {course.instructor
                      ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim() || "N/A"
                      : course.instructorId || "N/A"}
                  </TableCell>
                  <TableCell>{course.enrollments?.length || 0}</TableCell>
                  <TableCell>
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

