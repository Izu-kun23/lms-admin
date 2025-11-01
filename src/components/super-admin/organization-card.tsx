"use client"

import React from "react"
import Link from "next/link"
import { Building2, Users, CheckCircle2, XCircle } from "lucide-react"
import type { Organization } from "@/lib/types"

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/super-admin/organizations/${organization.id}`}>
      <div className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {organization.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {organization.slug}
              </p>
              {organization.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {organization.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {organization.isActive ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-xs font-medium capitalize">
              {organization.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          {organization.domain && (
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{organization.domain}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>View details</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

