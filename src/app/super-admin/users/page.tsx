"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { SuperAdminSidebarNew } from "@/components/super-admin/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/super-admin/super-admin-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { EnhancedTable } from "@/components/ui/enhanced-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react"
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const Search = (props: any) => <Icon icon="bx:search" {...props} />
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />

export default function SuperAdminUsersPage() {

  // API call commented out - using mock data
  const { data: users, isLoading } = useQuery({
    queryKey: ["super-admin-users"],
    // queryFn: () => apiClient.getAllUsers("all"),
    queryFn: async () => {
      return [
        {
          id: "user1",
          email: "student@university1.edu",
          firstName: "John",
          lastName: "Doe",
          role: "STUDENT",
          organization: {
            id: "org123",
            name: "University 1",
            slug: "university-1",
          },
          lastActiveAt: "2024-01-20T14:30:00Z",
          totalCourses: 3,
          completedCourses: 1,
        },
        {
          id: "user2",
          email: "instructor@university2.edu",
          firstName: "Jane",
          lastName: "Smith",
          role: "INSTRUCTOR",
          organization: {
            id: "org456",
            name: "University 2",
            slug: "university-2",
          },
          lastActiveAt: "2024-01-20T15:00:00Z",
          totalCourses: 5,
          completedCourses: 0,
        },
      ]
    },
  })

  const roleColors: Record<string, string> = {
    STUDENT: "default",
    INSTRUCTOR: "secondary",
    ADMIN: "destructive",
    SUPER_ADMIN: "outline",
  }

  // Column definitions for EnhancedTable
  const columns: ColumnDef<any>[] = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleColors[row.original.role] as any || "outline"}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {row.original.organization?.name || row.original.organizationId || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "totalCourses",
      header: "Courses",
      cell: ({ row }) => row.original.totalCourses || 0,
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last Active",
      cell: ({ row }) =>
        row.original.lastActiveAt
          ? new Date(row.original.lastActiveAt).toLocaleDateString()
          : "Never",
    },
  ], [roleColors])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SuperAdminSidebarNew variant="inset" />
      <SidebarInset>
        <SuperAdminHeader />
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Cross-Organization User Management
                </h1>
                <p className="text-muted-foreground">
                  View and manage users across all organizations
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading users...
                </div>
              ) : (
                <EnhancedTable
                  data={users || []}
                  columns={columns}
                  title="All Users"
                  searchPlaceholder="Search users..."
                  itemLabel="user"
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

