"use client"

import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
const LogOut = (props: any) => <Icon icon="bx:log-out" {...props} />

export function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-1 flex justify-center max-w-md mx-4">
        <label className="input flex items-center gap-2 w-full bg-background border border-primary/10 rounded-full px-3 py-2 text-sm">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input 
            type="search" 
            required 
            placeholder="Search" 
            className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {user?.email}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className="h-8 w-8"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  )
}

