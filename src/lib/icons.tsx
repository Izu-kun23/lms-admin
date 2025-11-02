/**
 * Clickons Icon System
 * 
 * To use Clickons icons:
 * 1. Export icons from Figma as SVG files to /public/icons/clickons/
 * 2. Use via ClickonsIcon component
 * 
 * Example:
 * <ClickonsIcon name="dashboard" className="w-5 h-5" />
 */

import React, { useState, useEffect } from "react"

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "src"> {
  name: string
  variant?: "fill" | "stroke"
  className?: string
}

/**
 * Clickons Icon Component
 * Loads SVG icons from the public/icons/clickons directory
 * Uses fetch to load SVG content and render inline for better control
 */
export function ClickonsIcon({ 
  name, 
  variant = "stroke",
  className = "",
  ...props 
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string>("")
  const [viewBox, setViewBox] = useState<string>("0 0 24 24")
  const [isLoading, setIsLoading] = useState(true)
  const iconPath = `/icons/clickons/${variant}/${name}.svg`
  
  useEffect(() => {
    fetch(iconPath)
      .then((res) => res.text())
      .then((svg) => {
        // Extract SVG content (remove XML declaration and wrapping)
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, "image/svg+xml")
        const svgElement = doc.querySelector("svg")
        
        if (svgElement) {
          // Get inner HTML (paths, circles, etc.)
          setSvgContent(svgElement.innerHTML)
          // Preserve viewBox from the original SVG
          const extractedViewBox = svgElement.getAttribute("viewBox")
          if (extractedViewBox) {
            setViewBox(extractedViewBox)
          }
        }
        setIsLoading(false)
      })
      .catch(() => {
        console.warn(`Clickons icon not found: ${iconPath}`)
        setIsLoading(false)
      })
  }, [name, variant, iconPath])
  
  if (isLoading || !svgContent) {
    // Fallback: Use a simple placeholder or return null
    return (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox={viewBox}
        fill="none"
        {...props}
      >
        {/* Placeholder - you can replace with a default icon */}
      </svg>
    )
  }
  
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox={props.viewBox || viewBox}
      fill="none"
      stroke="currentColor"
      {...props}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

/**
 * Alternative: Load SVG as React component
 * For better performance and styling control
 */
export async function loadClickonsIcon(name: string, variant: "fill" | "stroke" = "stroke") {
  try {
    // Dynamic import of SVG - requires next.config.ts configuration
    const iconModule = await import(`@/public/icons/clickons/${variant}/${name}.svg`)
    return iconModule.default
  } catch (error) {
    console.warn(`Clickons icon not found: ${name} (${variant})`)
    return null
  }
}

/**
 * Helper to create icon components from SVG content
 * Use this if you want to inline SVG content directly
 */
export function createClickonsIcon(svgContent: string) {
  return function IconComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className={props.className}
      />
    )
  }
}

/**
 * Icon mapping - Map our current icon names to Clickons icon names
 * Update this as you export icons from Figma
 */
export const ClickonsIconMap: Record<string, string> = {
  // Dashboard icons
  dashboard: "dashboard",
  
  // User icons
  users: "users",
  "people-group": "users-group",
  "user-circle": "user",
  person: "user",
  
  // Course icons
  book: "book",
  "book-open": "book-open",
  
  // Navigation icons
  search: "search",
  settings: "settings",
  "settings-horizontal": "settings",
  plus: "plus",
  edit: "edit",
  pencil: "edit",
  trash: "trash",
  "trash-can": "trash",
  
  // Status icons
  check: "check",
  "check-circle": "check-circle",
  "cross-circle": "close-circle",
  x: "close",
  "x-circle": "close-circle",
  
  // Building/Organization icons
  home: "home",
  building: "building",
  "building-2": "building",
  
  // Chart icons
  "chart-bar": "chart-bar",
  "bar-chart": "chart-bar",
  
  // Activity icons
  activity: "activity",
  
  // Graduation icons
  "graduation-cap": "graduation-cap",
  school: "graduation-cap",
  
  // Message icons
  message: "message",
  "message-circle": "message-circle",
  
  // Help icons
  help: "help",
  question: "question-circle",
  
  // Arrow icons
  "arrow-up": "arrow-up",
  "arrow-down": "arrow-down",
  "chevron-left": "chevron-left",
  "chevron-right": "chevron-right",
  "chevron-down": "chevron-down",
  
  // Other icons
  more: "more",
  "more-horizontal": "more-h",
  "more-vertical": "more-v",
  logout: "logout",
  "sign-out": "logout",
  bell: "bell",
  notification: "bell",
  calendar: "calendar",
  globe: "globe",
  folder: "folder",
  file: "file",
  share: "share",
  creditcard: "credit-card",
}

/**
 * Get Clickons icon name from alias
 */
export function getClickonsIconName(alias: string): string {
  return ClickonsIconMap[alias] || alias
}

