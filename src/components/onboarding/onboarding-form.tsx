"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { CreateOrganizationRequest } from "@/lib/types"

interface OnboardingFormProps {
  onSubmit: (data: CreateOrganizationRequest) => Promise<void>
  isSubmitting?: boolean
  error?: string
  className?: string
}

export function OnboardingForm({
  onSubmit,
  isSubmitting = false,
  error,
  className,
}: OnboardingFormProps) {
  const [formError, setFormError] = React.useState<string>("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    const submitError = error || ""

    try {
      const formData = new FormData(event.currentTarget)
      
      const data: CreateOrganizationRequest = {
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

      // Validate required fields
      if (!data.name || !data.slug || !data.adminEmail || !data.adminFirstName || 
          !data.adminLastName || !data.adminPassword) {
        setFormError("Please fill in all required fields")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.adminEmail)) {
        setFormError("Please enter a valid email address")
        return
      }

      // Validate password strength (minimum 6 characters)
      if (data.adminPassword.length < 6) {
        setFormError("Password must be at least 6 characters long")
        return
      }

      await onSubmit(data)
    } catch (err: any) {
      setFormError(err.message || submitError || "Failed to create organization. Please try again.")
    }
  }

  const displayError = formError || error

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Organization Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Information about your organization
          </p>
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
            The full name of your organization
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
            required
          />
          <FieldDescription>
            A unique identifier for your organization (lowercase, hyphens only)
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="domain">Domain</FieldLabel>
          <Input
            id="domain"
            name="domain"
            type="text"
            placeholder="university.edu"
          />
          <FieldDescription>
            Optional: Your organization's domain for email-based auto-assignment
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            name="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="A leading technology university"
          />
          <FieldDescription>
            Optional: Brief description of your organization
          </FieldDescription>
        </Field>

        <div className="border-b pb-4 mb-4 mt-6">
          <h2 className="text-xl font-semibold">Administrator Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create the first administrator account for this organization
          </p>
        </div>

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
          <FieldLabel htmlFor="adminEmail">
            Email <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="adminEmail"
            name="adminEmail"
            type="email"
            placeholder="admin@university.edu"
            required
          />
          <FieldDescription>
            This will be used to login to the admin portal
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="adminPassword">
            Password <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="adminPassword"
            name="adminPassword"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
          <FieldDescription>
            Password must be at least 6 characters long
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="adminStudentId">Student ID</FieldLabel>
          <Input
            id="adminStudentId"
            name="adminStudentId"
            type="number"
            placeholder="2023001"
          />
          <FieldDescription>
            Optional: Student or employee ID number
          </FieldDescription>
        </Field>

        {displayError && (
          <FieldDescription className="text-center text-red-600">
            {displayError}
          </FieldDescription>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-black/90 flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Organization"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

