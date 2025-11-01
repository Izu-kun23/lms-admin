"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Users } from "lucide-react"

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => apiClient.getCourses(),
  })

  const filteredCourses = React.useMemo(() => {
    if (!courses) return []
    if (!searchQuery) return courses

    const query = searchQuery.toLowerCase()
    return courses.filter(
      (course: any) =>
        course.title.toLowerCase().includes(query) ||
        course.code?.toLowerCase().includes(query) ||
        course.summary?.toLowerCase().includes(query) ||
        course.instructor?.firstName?.toLowerCase().includes(query) ||
        course.instructor?.lastName?.toLowerCase().includes(query)
    )
  }, [courses, searchQuery])

  const getInstructorName = (course: any) => {
    if (course.instructor) {
      const firstName = course.instructor.firstName || ""
      const lastName = course.instructor.lastName || ""
      return `${firstName} ${lastName}`.trim() || "N/A"
    }
    return course.instructorId || "N/A"
  }

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
                <h1 className="text-2xl font-bold tracking-tight">Course Oversight</h1>
                <p className="text-muted-foreground">
                  Monitor courses and instructor performance in your organization
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Courses
                      </CardTitle>
                      <CardDescription>
                        All courses in your organization
                      </CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading courses...
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery
                        ? "No courses found matching your search"
                        : "No courses found"}
                    </div>
                  ) : (
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
                        {filteredCourses.map((course: any) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{course.code || "N/A"}</Badge>
                            </TableCell>
                            <TableCell>{getInstructorName(course)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {course.enrollments?.length || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              {course.createdAt
                                ? new Date(course.createdAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

