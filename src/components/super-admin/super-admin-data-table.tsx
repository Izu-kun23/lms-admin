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
import { Icon } from "@iconify/react"
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />

interface SuperAdminDataTableProps {
  viewType?: "organizations" | "users"
}

export function SuperAdminDataTable({ viewType = "organizations" }: SuperAdminDataTableProps) {
  // API calls commented out - using mock data
  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["organizations"],
    // queryFn: () => apiClient.getOrganizations(),
    queryFn: async () => {
      return [
        {
          id: "org1",
          name: "University 1",
          slug: "university-1",
          domain: "university1.edu",
          isActive: true,
          createdAt: "2024-01-20T10:00:00Z",
        },
      ]
    },
    enabled: viewType === "organizations",
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-all"],
    // queryFn: () => apiClient.getAllUsers("all"),
    queryFn: async () => {
      return [
        {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "STUDENT",
          organization: { id: "org1", name: "University 1" },
          lastActiveAt: "2024-01-20T10:00:00Z",
        },
      ]
    },
    enabled: viewType === "users",
  })

  const isLoading = viewType === "organizations" ? orgsLoading : usersLoading

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {viewType === "organizations" ? "Organizations" : "Recent Users"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (viewType === "organizations") {
    const recentOrgs = Array.isArray(organizations) ? organizations.slice(0, 10) : []
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations
          </CardTitle>
          <CardDescription>All organizations in the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                recentOrgs.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.slug}</TableCell>
                    <TableCell>{org.domain || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={org.isActive ? "default" : "secondary"}>
                        {org.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {org.createdAt
                        ? new Date(org.createdAt).toLocaleDateString()
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

  // Users view
  const recentUsers = Array.isArray(users) ? users.slice(0, 10) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cross-Organization Users
        </CardTitle>
        <CardDescription>Users across all organizations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              recentUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.organization?.name || user.organizationId || "N/A"}
                  </TableCell>
                  <TableCell>
                    {user.lastActiveAt
                      ? new Date(user.lastActiveAt).toLocaleDateString()
                      : "Never"}
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

