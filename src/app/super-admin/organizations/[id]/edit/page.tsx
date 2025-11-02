"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { OrganizationForm } from "@/components/super-admin/organization-form"
import type { UpdateOrganizationRequest } from "@/lib/types"

export default function EditOrganizationPage() {
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

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateOrganizationRequest) => {
      // API call commented out - simulating success
      // return apiClient.updateOrganization(orgId, data)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: orgId,
            ...data,
            updatedAt: new Date().toISOString(),
          })
        }, 500)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["organization", orgId] })
      // queryClient.invalidateQueries({ queryKey: ["organizations"] })
      router.push(`/super-admin/organizations/${orgId}`)
    },
  })

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.back()
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Organization</h1>
        <p className="text-muted-foreground mt-2">
          Update organization information
        </p>
      </div>

      <div className="max-w-2xl">
        <OrganizationForm
          initialData={organization}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  )
}

