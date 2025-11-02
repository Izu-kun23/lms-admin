"use client"

import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />
const Globe = (props: any) => <Icon icon="bx:globe" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const Calendar = (props: any) => <Icon icon="bx:calendar" {...props} />
const Pencil = (props: any) => <Icon icon="bx:edit" {...props} />
const Trash2 = (props: any) => <Icon icon="bx:trash" {...props} />
const CheckCircle2 = (props: any) => <Icon icon="bx:check-circle" {...props} />
const XCircle = (props: any) => <Icon icon="bx:x-circle" {...props} />

export default function OrganizationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const orgId = params.id as string

  // API call commented out - using mock data
  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    // queryFn: () => apiClient.getOrganization(orgId),
    queryFn: async () => {
      return {
        id: orgId,
        name: "University of Technology",
        slug: "university-of-tech",
        domain: "university.edu",
        description: "A leading technology university",
        settings: {
          maxUsers: 10000,
          features: {
            messaging: true,
            notifications: true,
            analytics: true,
          },
        },
        isActive: true,
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-01-20T10:00:00Z",
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // API call commented out - simulating success
      // return apiClient.deleteOrganization(orgId)
      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["organizations"] })
      router.push("/super-admin/organizations")
    },
  })

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      await deleteMutation.mutateAsync()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Organization not found
        </p>
        <Link href="/super-admin/organizations">
          <Button className="mt-4">Back to Organizations</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground mt-1">{organization.slug}</p>
            <div className="mt-3 flex items-center gap-2">
              {organization.isActive ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium capitalize">
                {organization.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/super-admin/organizations/${orgId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                Organization Name
              </div>
              <p className="text-sm font-medium">{organization.name}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Globe className="h-4 w-4" />
                Slug
              </div>
              <p className="text-sm font-medium">{organization.slug}</p>
            </div>
            {organization.domain && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Globe className="h-4 w-4" />
                  Domain
                </div>
                <p className="text-sm font-medium">{organization.domain}</p>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Created At
              </div>
              <p className="text-sm font-medium">
                {new Date(organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {organization.description && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-sm text-muted-foreground">{organization.description}</p>
          </div>
        )}

        {organization.settings && (
          <div className="rounded-lg border bg-card p-6 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {organization.settings.maxUsers && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Max Users
                  </div>
                  <p className="text-lg font-semibold">
                    {organization.settings.maxUsers.toLocaleString()}
                  </p>
                </div>
              )}
              {organization.settings.features && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Features
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {organization.settings.features.messaging && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        Messaging
                      </span>
                    )}
                    {organization.settings.features.notifications && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        Notifications
                      </span>
                    )}
                    {organization.settings.features.analytics && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                        Analytics
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/super-admin/organizations">
          <Button variant="outline">Back to Organizations</Button>
        </Link>
        <Link href={`/super-admin/organizations/${orgId}/edit`}>
          <Button>Edit Organization</Button>
        </Link>
      </div>
    </div>
  )
}

