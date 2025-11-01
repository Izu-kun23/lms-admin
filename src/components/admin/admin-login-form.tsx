"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [organizations, setOrganizations] = React.useState<Array<{ id: string; name: string; slug: string }>>([])
  const { login } = useAuth()

  // Load organizations from localStorage on mount
  React.useEffect(() => {
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]")
    setOrganizations(orgs)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const organizationId = formData.get("organizationId") as string

      if (!organizationId) {
        setError("Please select an organization")
        setIsSubmitting(false)
        return
      }

      await login({ email, password, organizationId })
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Admin Portal Login</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Access the administrative dashboard
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="organizationId">Organization</FieldLabel>
          <select
            id="organizationId"
            name="organizationId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          {organizations.length === 0 && (
            <FieldDescription className="text-amber-600">
              No organizations found.{" "}
              <a href="/onboarding" className="underline underline-offset-4 font-medium">
                Create one here
              </a>
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        <Field>
          <div className="flex items-center gap-2">
            <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded border" />
            <label htmlFor="remember" className="text-sm">Remember me</label>
          </div>
        </Field>
        {error ? (
          <FieldDescription className="text-center text-red-600">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-black/90 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login as Admin"}
          </Button>
        </Field>
        <FieldSeparator>Or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Student or instructor?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login here
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

