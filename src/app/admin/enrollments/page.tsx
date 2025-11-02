"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@iconify/react"
const School = (props: any) => <Icon icon="bx:user-plus" {...props} />
const Plus = (props: any) => <Icon icon="bx:plus" {...props} />
const MoreHorizontal = (props: any) => <Icon icon="bx:dots-horizontal-rounded" {...props} />
const Trash2 = (props: any) => <Icon icon="bx:trash" {...props} />
const CheckCircle = (props: any) => <Icon icon="bx:check-circle" {...props} />
const XCircle = (props: any) => <Icon icon="bx:x-circle" {...props} />
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
import { toast } from "sonner"

export default function AdminEnrollmentsPage() {
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)
  const queryClient = useQueryClient()

  // API calls commented out - using mock data
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["admin-enrollments"],
    // queryFn: () => apiClient.getEnrollments(),
    queryFn: async () => {
      return [
        {
          id: "enroll1",
          userId: "user1",
          courseId: "course1",
          status: "ACTIVE",
          createdAt: "2024-01-20T10:00:00Z",
        },
        {
          id: "enroll2",
          userId: "user2",
          courseId: "course2",
          status: "COMPLETED",
          createdAt: "2024-01-15T10:00:00Z",
        },
      ]
    },
  })

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
        },
        {
          id: "user2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          role: "STUDENT",
        },
      ]
    },
  })

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    // queryFn: () => apiClient.getCourses(),
    queryFn: async () => {
      return [
        { id: "course1", title: "Introduction to CS", code: "CS101" },
        { id: "course2", title: "Advanced Programming", code: "CS201" },
      ]
    },
  })

  const createEnrollmentMutation = useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      // return apiClient.createEnrollment(userId, courseId)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `enroll-${Date.now()}`,
            userId,
            courseId,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
          })
        }, 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
      setCreateSheetOpen(false)
      toast.success("Enrollment created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create enrollment")
    },
  })

  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // return apiClient.updateEnrollment(id, { status })
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id, status }), 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
      toast.success("Enrollment status updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update enrollment")
    },
  })

  const deleteEnrollmentMutation = useMutation({
    mutationFn: async (id: string) => {
      // return apiClient.deleteEnrollment(id)
      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
      toast.success("Enrollment deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete enrollment")
    },
  })

  const handleCreateEnrollment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const userId = formData.get("userId") as string
    const courseId = formData.get("courseId") as string

    if (!userId || !courseId) {
      toast.error("Please select both a user and a course")
      return
    }

    createEnrollmentMutation.mutate({ userId, courseId })
  }

  const handleStatusChange = (enrollmentId: string, newStatus: string) => {
    updateEnrollmentMutation.mutate({ id: enrollmentId, status: newStatus })
  }

  const handleDeleteEnrollment = (enrollmentId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this enrollment? This action cannot be undone."
      )
    ) {
      deleteEnrollmentMutation.mutate(enrollmentId)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      ACTIVE: "default",
      COMPLETED: "secondary",
      DROPPED: "destructive",
    }

    return (
      <Badge variant={statusColors[status] as any || "outline"}>
        {status}
      </Badge>
    )
  }

  const isLoading = enrollmentsLoading || usersLoading || coursesLoading

  // Get user and course names for display
  const getUserName = (userId: string) => {
    const user = users?.find((u: any) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : userId
  }

  const getCourseName = (courseId: string) => {
    const course = courses?.find((c: any) => c.id === courseId)
    return course ? course.title : courseId
  }

  // Filter students only for enrollment
  const students = users?.filter((u: any) => u.role === "STUDENT") || []

  // Column definitions for EnhancedTable
  const columns: ColumnDef<any>[] = React.useMemo(() => [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => (
        <span className="font-medium">{getUserName(row.original.userId)}</span>
      ),
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => getCourseName(row.original.courseId),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "createdAt",
      header: "Enrolled",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.original.status !== "ACTIVE" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(row.original.id, "ACTIVE")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Set as Active
                </DropdownMenuItem>
              )}
              {row.original.status !== "COMPLETED" && (
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(row.original.id, "COMPLETED")
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              {row.original.status !== "DROPPED" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(row.original.id, "DROPPED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as Dropped
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDeleteEnrollment(row.original.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
    },
  ], [users, courses, handleStatusChange, handleDeleteEnrollment])

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
                <h1 className="text-2xl font-bold tracking-tight">Enrollment Management</h1>
                <p className="text-muted-foreground">
                  Manage student course enrollments and track enrollment status
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading enrollments...
                </div>
              ) : (
                <EnhancedTable
                  data={enrollments || []}
                  columns={columns}
                  title="Enrollments"
                  searchPlaceholder="Search enrollments..."
                  itemLabel="enrollment"
                  defaultPageSize={8}
                  actionButtons={
                    <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                      <SheetTrigger asChild>
                        <Button className="rounded-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Enrollment
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <form onSubmit={handleCreateEnrollment}>
                          <SheetHeader>
                            <SheetTitle>Create New Enrollment</SheetTitle>
                            <SheetDescription>
                              Enroll a student in a course
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <Field>
                              <FieldLabel htmlFor="userId">
                                Student <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select name="userId" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                  {students.length === 0 ? (
                                    <SelectItem value="" disabled>
                                      No students found
                                    </SelectItem>
                                  ) : (
                                    students.map((student: any) => (
                                      <SelectItem key={student.id} value={student.id}>
                                        {student.firstName} {student.lastName} ({student.email})
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="courseId">
                                Course <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select name="courseId" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses && courses.length === 0 ? (
                                    <SelectItem value="" disabled>
                                      No courses found
                                    </SelectItem>
                                  ) : (
                                    courses?.map((course: any) => (
                                      <SelectItem key={course.id} value={course.id}>
                                        {course.title} ({course.code || "N/A"})
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </Field>
                          </div>
                          <SheetFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCreateSheetOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={createEnrollmentMutation.isPending}>
                              {createEnrollmentMutation.isPending
                                ? "Creating..."
                                : "Create Enrollment"}
                            </Button>
                          </SheetFooter>
                        </form>
                      </SheetContent>
                    </Sheet>
                  }
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

