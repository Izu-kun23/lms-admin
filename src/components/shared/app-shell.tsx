"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { SuperAdminSidebar } from "../super-admin-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Determine which sidebar to show based on user role
  const renderSidebar = () => {
    if (user?.role === "SUPER_ADMIN") {
      return <SuperAdminSidebar />
    }
    // Add other role sidebars here later
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {renderSidebar()}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}

