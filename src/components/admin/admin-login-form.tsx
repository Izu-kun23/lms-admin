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
  const { login } = useAuth()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        setError("Please enter both email and password")
        setIsSubmitting(false)
        return
      }

      console.log("Submitting login form...")
      await login({ email, password })
      
      // If login succeeds, navigation will happen automatically
      // Don't reset isSubmitting here as the component will unmount on navigation
      console.log("Login successful, should navigate soon...")
    } catch (err: any) {
      console.error("Login form error:", err)
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
          <FieldDescription className="mb-4">
            <a 
              href="/onboarding" 
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 font-medium"
            >
              Create a new organization
            </a>
          </FieldDescription>
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
          {isSubmitting && (
            <FieldDescription className="text-center mt-2 text-sm text-muted-foreground">
              This may take up to 60 seconds if the server is starting up (cold start)...
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>
    </form>
  )
}

