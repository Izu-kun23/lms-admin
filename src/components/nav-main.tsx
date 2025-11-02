"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: React.ComponentType<any>
}

type NavSection = {
  label?: string
  items: NavItem[]
}

type NavMainProps = {
  items?: NavItem[]
  sections?: NavSection[]
}

export function NavMain({
  items,
  sections,
}: NavMainProps) {
  const pathname = usePathname()
  // Support both old format (items) and new format (sections)
  const navSections: NavSection[] = sections || (items ? [{ items }] : [])

  return (
    <>
      {navSections.map((section, sectionIndex) => (
        <SidebarGroup key={sectionIndex} className="py-1">
          {section.label && (
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-0.5">
            <SidebarMenu>
              {section.items.map((item) => {
                // Check if current path matches the item URL exactly or is a child route
                const isActive = pathname === item.url || 
                  (item.url !== "/admin" && 
                   item.url !== "/super-admin" && 
                   pathname?.startsWith(item.url + "/"))
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      asChild
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
