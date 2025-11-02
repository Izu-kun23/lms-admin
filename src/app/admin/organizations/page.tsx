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
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@iconify/react"
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />
const Plus = (props: any) => <Icon icon="bx:plus" {...props} />
const Search = (props: any) => <Icon icon="bx:search" {...props} />
import { toast } from "sonner"

export default function AdminOrganizationsPage() {
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)
  const queryClient = useQueryClient()

  // API call commented out - using mock data
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["admin-organizations"],
    // queryFn: () => apiClient.getOrganizations(),
    queryFn: async () => {
      // Mock data for UI testing
      return [
        {
          id: "org1",
          name: "University of Technology",
          slug: "university-of-tech",
          domain: "university.edu",
          description: "A leading technology university",
          settings: {},
          isActive: true,
          createdAt: "2024-01-20T10:00:00Z",
          updatedAt: "2024-01-20T10:00:00Z",
        },
        {
          id: "org2",
          name: "Tech Institute",
          slug: "tech-institute",
          domain: "techinstitute.edu",
          description: "Premier technical education",
          settings: {},
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ]
    },
  })

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: {
      name: string
      slug: string
      domain?: string
      description?: string
      settings?: Record<string, any>
      adminEmail: string
      adminFirstName: string
      adminLastName: string
      adminPassword: string
      adminStudentId?: number
    }) => {
      // API call commented out - simulating success
      // return apiClient.createOrganization(data)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `org-${Date.now()}`,
            ...data,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }, 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["admin-organizations"] })
      setCreateSheetOpen(false)
      toast.success("Organization created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create organization")
    },
  })

  const handleCreateOrganization = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data: {
      name: string
      slug: string
      domain?: string
      description?: string
      adminEmail: string
      adminFirstName: string
      adminLastName: string
      adminPassword: string
      adminStudentId?: number
      settings?: Record<string, any>
    } = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      domain: (formData.get("domain") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      adminEmail: formData.get("adminEmail") as string,
      adminFirstName: formData.get("adminFirstName") as string,
      adminLastName: formData.get("adminLastName") as string,
      adminPassword: formData.get("adminPassword") as string,
      adminStudentId: formData.get("adminStudentId")
        ? parseInt(formData.get("adminStudentId") as string)
        : undefined,
    }

    if (
      !data.name ||
      !data.slug ||
      !data.adminEmail ||
      !data.adminFirstName ||
      !data.adminLastName ||
      !data.adminPassword
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // Optional: Add settings if needed
    const maxUsers = formData.get("maxUsers")
    if (maxUsers) {
      data.settings = {
        maxUsers: parseInt(maxUsers as string),
        features: {
          messaging: formData.get("messaging") === "true",
          notifications: formData.get("notifications") === "true",
          analytics: formData.get("analytics") === "true",
        },
      }
    }

    createOrganizationMutation.mutate(data)
  }

  // Column definitions for EnhancedTable
  const columns: ColumnDef<any>[] = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => row.original.domain || "N/A",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
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
                <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
                <p className="text-muted-foreground">
                  Manage organizations and view organization details
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading organizations...
                </div>
              ) : (
                <EnhancedTable
                  data={organizations || []}
                  columns={columns}
                  title="Organizations"
                  searchPlaceholder="Search organizations..."
                  itemLabel="organization"
                  defaultPageSize={8}
                  actionButtons={
                    <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                      <SheetTrigger asChild>
                        <Button className="rounded-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Organization
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-3xl">
                        <form onSubmit={handleCreateOrganization}>
                          <SheetHeader>
                            <SheetTitle>Create New Organization</SheetTitle>
                            <SheetDescription>
                              Create a new organization with an administrator account
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4 pl-6">
                            <div className="border-b pb-4">
                              <h3 className="text-lg font-semibold mb-2">Organization Details</h3>
                            </div>

                            <Field>
                              <FieldLabel htmlFor="name">
                                Organization Name <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="University of Technology"
                                required
                              />
                              <FieldDescription>
                                The display name for the organization
                              </FieldDescription>
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="slug">
                                Organization Slug <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Input
                                id="slug"
                                name="slug"
                                type="text"
                                placeholder="university-of-tech"
                                pattern="[a-z0-9-]+"
                                required
                              />
                              <FieldDescription>
                                URL-friendly identifier (lowercase letters, numbers, hyphens only)
                              </FieldDescription>
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="domain">Domain (Optional)</FieldLabel>
                              <Input
                                id="domain"
                                name="domain"
                                type="text"
                                placeholder="university.edu"
                              />
                              <FieldDescription>
                                The domain associated with this organization
                              </FieldDescription>
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                              <Input
                                id="description"
                                name="description"
                                type="text"
                                placeholder="A leading technology university"
                              />
                            </Field>

                            <div className="border-t pt-4 mt-4">
                              <h3 className="text-lg font-semibold mb-4">Administrator Account</h3>
                            </div>

                            <Field>
                              <FieldLabel htmlFor="adminEmail">
                                Admin Email <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Input
                                id="adminEmail"
                                name="adminEmail"
                                type="email"
                                placeholder="admin@university.edu"
                                required
                              />
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="adminPassword">
                                Admin Password <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Input
                                id="adminPassword"
                                name="adminPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                              />
                              <FieldDescription>
                                Password must be at least 6 characters
                              </FieldDescription>
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel htmlFor="adminFirstName">
                                  First Name <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                  id="adminFirstName"
                                  name="adminFirstName"
                                  type="text"
                                  placeholder="John"
                                  required
                                />
                              </Field>
                              <Field>
                                <FieldLabel htmlFor="adminLastName">
                                  Last Name <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                  id="adminLastName"
                                  name="adminLastName"
                                  type="text"
                                  placeholder="Doe"
                                  required
                                />
                              </Field>
                            </div>

                            <Field>
                              <FieldLabel htmlFor="adminStudentId">Student ID (Optional)</FieldLabel>
                              <Input
                                id="adminStudentId"
                                name="adminStudentId"
                                type="number"
                                placeholder="12345"
                              />
                            </Field>

                            <div className="border-t pt-4 mt-4">
                              <h3 className="text-lg font-semibold mb-4">Settings</h3>
                            </div>

                            <Field>
                              <FieldLabel htmlFor="analytics">
                                Enable Analytics
                              </FieldLabel>
                              <Select name="analytics" defaultValue="false">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
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
                            <Button type="submit" disabled={createOrganizationMutation.isPending}>
                              {createOrganizationMutation.isPending
                                ? "Creating..."
                                : "Create Organization"}
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

