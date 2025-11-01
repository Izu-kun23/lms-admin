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
import { School, Plus, MoreHorizontal, Trash2, CheckCircle, XCircle, BookOpen } from "lucide-react"
import { toast } from "sonner"

export default function AdminEnrollmentsPage() {
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: () => apiClient.getEnrollments(),
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiClient.getAllUsers(),
  })

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => apiClient.getCourses(),
  })

  const createEnrollmentMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      apiClient.createEnrollment(userId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
      setCreateSheetOpen(false)
      toast.success("Enrollment created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create enrollment")
    },
  })

  const updateEnrollmentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.updateEnrollment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
      toast.success("Enrollment status updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update enrollment")
    },
  })

  const deleteEnrollmentMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] })
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Enrollment Management</h1>
                  <p className="text-muted-foreground">
                    Manage student course enrollments and track enrollment status
                  </p>
                </div>
                <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>
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
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Enrollments
                  </CardTitle>
                  <CardDescription>
                    All course enrollments in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading enrollments...
                    </div>
                  ) : !enrollments || enrollments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No enrollments found
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Enrolled</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment: any) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">
                              {getUserName(enrollment.userId)}
                            </TableCell>
                            <TableCell>{getCourseName(enrollment.courseId)}</TableCell>
                            <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                            <TableCell>
                              {enrollment.createdAt
                                ? new Date(enrollment.createdAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {enrollment.status !== "ACTIVE" && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(enrollment.id, "ACTIVE")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Set as Active
                                    </DropdownMenuItem>
                                  )}
                                  {enrollment.status !== "COMPLETED" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(enrollment.id, "COMPLETED")
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                                  {enrollment.status !== "DROPPED" && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(enrollment.id, "DROPPED")}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Mark as Dropped
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

