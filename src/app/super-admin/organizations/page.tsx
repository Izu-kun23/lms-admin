"use client"

import React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { OrganizationCard } from "@/components/super-admin/organization-card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

export default function OrganizationsPage() {
  const { data: organizations = [], isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.getOrganizations(),
  })

  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage organizations across the platform
          </p>
        </div>
        <Link href="/super-admin/organizations/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-6">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            Failed to load organizations. Please try again.
          </p>
        </div>
      )}

      {/* Organizations Grid */}
      {!isLoading && !error && (
        <>
          {filteredOrganizations.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {organizations.length === 0
                  ? "No organizations found. Create your first organization to get started."
                  : "No organizations match your search."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredOrganizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

