"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { OrganizationForm } from "@/components/super-admin/organization-form"
import type { CreateOrganizationRequest } from "@/lib/types"

export default function NewOrganizationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateOrganizationRequest) => apiClient.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
      router.push("/super-admin/organizations")
    },
  })

  const handleSubmit = async (data: CreateOrganizationRequest) => {
    await createMutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Organization</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new organization on the platform
        </p>
      </div>

      <div className="max-w-2xl">
        <OrganizationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  )
}

