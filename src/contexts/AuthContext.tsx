"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { User, LoginRequest, RegisterRequest } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ensure we're on the client side
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }
        
        // Try to get user info from stored token
        const token = localStorage.getItem("accessToken")
        if (token) {
          // Token exists, try to validate it by making a protected API call
          // For now, we'll just set loading to false
          // In a real app, you might want to decode the JWT and get user info
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        if (typeof window !== "undefined") {
          apiClient.clearTokens()
        }
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getRedirectPath = useCallback((user: User) => {
    // Role-based redirect
    switch (user.role) {
      case "SUPER_ADMIN":
        return "/super-admin"
      case "ADMIN":
        return "/admin"
      case "INSTRUCTOR":
        return "/instructor"
      case "STUDENT":
      default:
        return "/student/dashboard"
    }
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      console.log("Attempting login...", credentials.email)
      const response = await apiClient.login(credentials)
      
      if (!response || !response.user) {
        throw new Error("Invalid login response: missing user data")
      }
      
      console.log("Login successful, user:", response.user)
      setUser(response.user)
      
      const redirectPath = getRedirectPath(response.user)
      console.log("Redirecting to:", redirectPath)
      
      // Use replace instead of push to avoid adding to history
      router.replace(redirectPath)
      
      // Small delay to ensure state is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (error: any) {
      console.error("Login failed in context:", error)
      
      // Ensure tokens are cleared on error
      apiClient.clearTokens()
      setUser(null)
      
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          error.response?.data?.error ||
                          "Login failed. Please check your credentials."
      throw new Error(errorMessage)
    }
  }, [router, getRedirectPath])

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiClient.register(data)
      setUser(response.user)
      router.push(getRedirectPath(response.user))
    } catch (error: any) {
      console.error("Registration failed:", error)
      throw new Error(error.response?.data?.message || "Registration failed. Please try again.")
    }
  }, [router, getRedirectPath])

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      apiClient.clearTokens()
      router.push("/login")
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    // This would fetch the current user's data from the API
    // For now, we'll leave it as a placeholder
    console.log("Refresh user called")
  }, [])

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

