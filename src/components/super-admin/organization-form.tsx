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
import type { CreateOrganizationRequest, Organization } from "@/lib/types"

interface OrganizationFormProps {
  initialData?: Organization
  onSubmit: (data: CreateOrganizationRequest) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function OrganizationForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: OrganizationFormProps) {
  const [error, setError] = React.useState<string>("")
  const [settingsEnabled, setSettingsEnabled] = React.useState(
    !!initialData?.settings
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    try {
      const formData = new FormData(event.currentTarget)
      const data: CreateOrganizationRequest = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        domain: formData.get("domain") as string || undefined,
        description: formData.get("description") as string || undefined,
      }

      if (settingsEnabled) {
        const maxUsers = formData.get("maxUsers")
        const messaging = formData.get("messaging") === "true"
        const notifications = formData.get("notifications") === "true"
        const analytics = formData.get("analytics") === "true"

        data.settings = {
          maxUsers: maxUsers ? parseInt(maxUsers as string) : undefined,
          features: {
            messaging,
            notifications,
            analytics,
          },
        }
      }

      await onSubmit(data)
    } catch (err: any) {
      setError(err.message || "Failed to save organization")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">
            Organization Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Tech University"
            required
            defaultValue={initialData?.name}
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
            placeholder="tech-university"
            required
            defaultValue={initialData?.slug}
            pattern="[a-z0-9-]+"
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
            placeholder="techuniversity.edu"
            defaultValue={initialData?.domain}
          />
          <FieldDescription>
            Email domain for automatic organization assignment
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Leading technology university offering computer science programs"
            defaultValue={initialData?.description}
          />
        </Field>

        <Field>
          <div className="flex items-center gap-2">
            <input
              id="settingsEnabled"
              name="settingsEnabled"
              type="checkbox"
              className="h-4 w-4 rounded border"
              checked={settingsEnabled}
              onChange={(e) => setSettingsEnabled(e.target.checked)}
            />
            <FieldLabel htmlFor="settingsEnabled">Configure Advanced Settings</FieldLabel>
          </div>
        </Field>

        {settingsEnabled && (
          <div className="ml-6 space-y-4 border-l-2 pl-4">
            <Field>
              <FieldLabel htmlFor="maxUsers">Maximum Users</FieldLabel>
              <Input
                id="maxUsers"
                name="maxUsers"
                type="number"
                placeholder="10000"
                defaultValue={initialData?.settings?.maxUsers}
              />
              <FieldDescription>
                Maximum number of users allowed in this organization
              </FieldDescription>
            </Field>

            <div>
              <FieldLabel>Features</FieldLabel>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="messaging"
                    name="messaging"
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    defaultChecked={initialData?.settings?.features?.messaging ?? true}
                  />
                  <label htmlFor="messaging" className="text-sm">
                    Messaging
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    defaultChecked={
                      initialData?.settings?.features?.notifications ?? true
                    }
                  />
                  <label htmlFor="notifications" className="text-sm">
                    Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="analytics"
                    name="analytics"
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    defaultChecked={initialData?.settings?.features?.analytics ?? true}
                  />
                  <label htmlFor="analytics" className="text-sm">
                    Analytics
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <FieldDescription className="text-red-600">
            {error}
          </FieldDescription>
        )}

        <Field>
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? "Saving..." : initialData ? "Update Organization" : "Create Organization"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}

