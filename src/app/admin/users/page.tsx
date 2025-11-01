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
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Plus, Search, MoreHorizontal, Edit, Trash2, UserCog } from "lucide-react"
import { toast } from "sonner"
import type { User, UserRole } from "@/lib/types"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)
  const [editSheetOpen, setEditSheetOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiClient.getAllUsers(),
  })

  const createUserMutation = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      role: string
      matricNumber?: string
    }) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      setCreateSheetOpen(false)
      toast.success("User created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user")
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      setEditSheetOpen(false)
      setSelectedUser(null)
      toast.success("User updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user")
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      apiClient.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success("User role updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user role")
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success("User deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user")
    },
  })

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as string,
      matricNumber: formData.get("matricNumber") as string || undefined,
    }

    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.role) {
      toast.error("Please fill in all required fields")
      return
    }

    createUserMutation.mutate(data)
  }

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser) return

    const formData = new FormData(event.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      matricNumber: formData.get("matricNumber") as string || undefined,
    }

    updateUserMutation.mutate({ id: selectedUser.id, data })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ id: userId, role: newRole })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditSheetOpen(true)
  }

  const filteredUsers = React.useMemo(() => {
    if (!users) return []
    if (!searchQuery) return users

    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.matricNumber?.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const roleColors: Record<UserRole, string> = {
    STUDENT: "default",
    INSTRUCTOR: "secondary",
    ADMIN: "destructive",
    SUPER_ADMIN: "outline",
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                  <p className="text-muted-foreground">
                    Create, update, and manage user accounts in your organization
                  </p>
                </div>
                <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <form onSubmit={handleCreateUser}>
                      <SheetHeader>
                        <SheetTitle>Create New User</SheetTitle>
                        <SheetDescription>
                          Add a new user account to your organization
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <Field>
                          <FieldLabel htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="user@example.com"
                            required
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="password">
                            Password <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="password"
                            name="password"
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
                            <FieldLabel htmlFor="firstName">
                              First Name <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                              id="firstName"
                              name="firstName"
                              type="text"
                              placeholder="John"
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="lastName">
                              Last Name <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                              id="lastName"
                              name="lastName"
                              type="text"
                              placeholder="Doe"
                              required
                            />
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel htmlFor="role">
                            Role <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select name="role" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STUDENT">Student</SelectItem>
                              <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="matricNumber">Matriculation Number</FieldLabel>
                          <Input
                            id="matricNumber"
                            name="matricNumber"
                            type="text"
                            placeholder="STU001"
                          />
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
                        <Button type="submit" disabled={createUserMutation.isPending}>
                          {createUserMutation.isPending ? "Creating..." : "Create User"}
                        </Button>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Users
                      </CardTitle>
                      <CardDescription>
                        Manage all users in your organization
                      </CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
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
                      Loading users...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No users found matching your search" : "No users found"}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Matric Number</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 hover:bg-transparent"
                                  >
                                    <Badge
                                      variant={
                                        roleColors[user.role] as any
                                      }
                                    >
                                      {user.role}
                                    </Badge>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(user.id, "STUDENT")
                                    }
                                  >
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Change to Student
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(user.id, "INSTRUCTOR")
                                    }
                                  >
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Change to Instructor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(user.id, "ADMIN")
                                    }
                                  >
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Change to Admin
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>{user.matricNumber || "N/A"}</TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
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

              {/* Edit User Sheet */}
              <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
                <SheetContent>
                  {selectedUser && (
                    <form onSubmit={handleUpdateUser}>
                      <SheetHeader>
                        <SheetTitle>Edit User</SheetTitle>
                        <SheetDescription>
                          Update user information
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel htmlFor="edit-firstName">First Name</FieldLabel>
                            <Input
                              id="edit-firstName"
                              name="firstName"
                              type="text"
                              defaultValue={selectedUser.firstName}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="edit-lastName">Last Name</FieldLabel>
                            <Input
                              id="edit-lastName"
                              name="lastName"
                              type="text"
                              defaultValue={selectedUser.lastName}
                              required
                            />
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel htmlFor="edit-email">Email</FieldLabel>
                          <Input
                            id="edit-email"
                            name="email"
                            type="email"
                            defaultValue={selectedUser.email}
                            required
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="edit-matricNumber">
                            Matriculation Number
                          </FieldLabel>
                          <Input
                            id="edit-matricNumber"
                            name="matricNumber"
                            type="text"
                            defaultValue={selectedUser.matricNumber || ""}
                          />
                        </Field>
                      </div>
                      <SheetFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditSheetOpen(false)
                            setSelectedUser(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updateUserMutation.isPending}>
                          {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </SheetFooter>
                    </form>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

