"use client"

import React from "react"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { SystemHealth } from "@/lib/types"

interface SystemHealthProps {
  health: SystemHealth | null
  isLoading: boolean
}

export function SystemHealthWidget({ health, isLoading }: SystemHealthProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Unable to load system health</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "down":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">System Health</h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(health.status)}
          <span className={`text-sm font-medium capitalize ${getStatusColor(health.status)}`}>
            {health.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Uptime</span>
          <span className="font-medium">{health.performance.uptime}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Response Time</span>
          <span className="font-medium">{health.performance.responseTime}ms</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Error Rate</span>
          <span className="font-medium">{health.performance.errorRate}%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground mb-2">Services</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(health.services).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
            >
              {getStatusIcon(value)}
              <span className="capitalize">{key}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

