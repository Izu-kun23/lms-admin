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
import { EnhancedTable } from "@/components/ui/enhanced-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react"
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
const Search = (props: any) => <Icon icon="bx:search" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />

export default function AdminCoursesPage() {

  // API call commented out - using mock data
  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    // queryFn: () => apiClient.getCourses(),
    queryFn: async () => {
      return [
        {
          id: "course1",
          title: "Introduction to Computer Science",
          code: "CS101",
          summary: "Fundamentals of programming",
          instructorId: "instructor1",
          instructor: { firstName: "Dr. Jane", lastName: "Smith" },
          enrollments: [{ id: "enroll1" }, { id: "enroll2" }],
          createdAt: "2024-01-20T10:00:00Z",
        },
        {
          id: "course2",
          title: "Advanced Programming",
          code: "CS201",
          summary: "Advanced programming concepts",
          instructorId: "instructor2",
          instructor: { firstName: "Dr. John", lastName: "Doe" },
          enrollments: [{ id: "enroll3" }],
          createdAt: "2024-01-15T10:00:00Z",
        },
      ]
    },
  })

  const getInstructorName = (course: any) => {
    if (course.instructor) {
      const firstName = course.instructor.firstName || ""
      const lastName = course.instructor.lastName || ""
      return `${firstName} ${lastName}`.trim() || "N/A"
    }
    return course.instructorId || "N/A"
  }

  // Column definitions for EnhancedTable
  const columns: ColumnDef<any>[] = React.useMemo(() => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.code || "N/A"}</Badge>
      ),
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => getInstructorName(row.original),
    },
    {
      accessorKey: "enrollments",
      header: "Enrollments",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row.original.enrollments?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
  ], [])

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

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading courses...
                </div>
              ) : (
                <EnhancedTable
                  data={courses || []}
                  columns={columns}
                  title="Courses"
                  searchPlaceholder="Search courses..."
                  itemLabel="course"
                  defaultPageSize={8}
                  getRowId={(row) => row.id}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

