/**
 * Clickons Icon Wrapper Component
 * 
 * This component wraps Clickons icons to work with our existing icon system.
 * It automatically maps icon names and provides a consistent API.
 */

import React from "react"
import { ClickonsIcon, getClickonsIconName } from "@/lib/icons"

interface ClickonsIconWrapperProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: string
  variant?: "fill" | "stroke"
}

/**
 * Wrapper component that makes Clickons icons compatible with our icon system
 */
export function ClickonsIconWrapper({ 
  icon, 
  variant = "stroke",
  className = "",
  ...props 
}: ClickonsIconWrapperProps) {
  const iconName = getClickonsIconName(icon)
  
  return (
    <ClickonsIcon
      name={iconName}
      variant={variant}
      className={className}
      {...(props as any)}
    />
  )
}

/**
 * Helper to create icon components that match our current API
 * Usage: const IconDashboard = createIconComponent("dashboard")
 */
export function createIconComponent(iconName: string, variant: "fill" | "stroke" = "stroke") {
  return function IconComponent(props: React.SVGProps<SVGSVGElement>) {
    return <ClickonsIconWrapper icon={iconName} variant={variant} {...props} />
  }
}

