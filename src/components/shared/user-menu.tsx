"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-4 border-t p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="ml-auto rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

