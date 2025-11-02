/**
 * Example: How to use Clickons icons in your components
 * 
 * This file shows different ways to integrate Clickons icons
 * Replace Akar icons with Clickons as you export them from Figma
 */

import { ClickonsIcon } from "@/lib/icons"
import { ClickonsIconWrapper } from "@/components/clickons-icon-wrapper"
import { createIconComponent } from "@/components/clickons-icon-wrapper"

// Example 1: Direct usage with ClickonsIcon
export function Example1() {
  return (
    <div>
      <ClickonsIcon name="dashboard" className="w-5 h-5" />
      <ClickonsIcon name="users" variant="stroke" className="w-6 h-6 text-blue-500" />
    </div>
  )
}

// Example 2: Using the wrapper (for easier migration)
export function Example2() {
  return (
    <div>
      <ClickonsIconWrapper icon="dashboard" className="w-5 h-5" />
      <ClickonsIconWrapper icon="book" variant="fill" className="w-6 h-6" />
    </div>
  )
}

// Example 3: Create reusable icon components
const IconDashboard = createIconComponent("dashboard")
const IconUsers = createIconComponent("users")
const IconBook = createIconComponent("book", "fill")

export function Example3() {
  return (
    <div>
      <IconDashboard className="w-5 h-5" />
      <IconUsers className="w-5 h-5" />
      <IconBook className="w-5 h-5" />
    </div>
  )
}

// Example 4: Replacing existing Akar icon usage
// BEFORE:
// import { Icon } from "@iconify/react"
// const IconDashboard = (props: any) => <Icon icon="akar-icons:dashboard" {...props} />

// AFTER:
import { createIconComponent } from "@/components/clickons-icon-wrapper"
const IconDashboard = createIconComponent("dashboard")
const IconUsers = createIconComponent("users")
const IconBook = createIconComponent("book")
const IconSettings = createIconComponent("settings")

export function Example4() {
  return (
    <div className="flex gap-4">
      <IconDashboard className="w-6 h-6" />
      <IconUsers className="w-6 h-6" />
      <IconBook className="w-6 h-6" />
      <IconSettings className="w-6 h-6" />
    </div>
  )
}

