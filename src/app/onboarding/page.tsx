"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import type { CreateOrganizationRequest } from "@/lib/types"

export default function OnboardingPage() {
  const router = useRouter()

  const createMutation = useMutation({
    mutationFn: async (data: CreateOrganizationRequest) => {
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
    onSuccess: (data: any) => {
      // Update organizations in localStorage
      const existingOrgs = JSON.parse(localStorage.getItem("organizations") || "[]")
      existingOrgs.push(data)
      localStorage.setItem("organizations", JSON.stringify(existingOrgs))
      
      // Show success message and redirect to login
      alert("Organization created successfully! You can now login with the admin credentials you provided.")
      router.push("/admin/login")
    },
    onError: (error: any) => {
      console.error("Failed to create organization:", error)
    },
  })

  const handleSubmit = async (data: CreateOrganizationRequest) => {
    await createMutation.mutateAsync(data)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/admin/login" className="flex items-center gap-2 font-medium pt-10">
            <span className="font-bebas text-4xl leading-none tracking-wide">GLACQ</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Your Organization</h1>
              <p className="text-muted-foreground">
                Set up your organization and create the first administrator account
              </p>
            </div>
            <OnboardingForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
              error={createMutation.error?.message}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/glacq_image.jpeg"
          alt="Onboarding background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

