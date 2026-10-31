
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  ChevronDown,
  LogOut,
  Settings2,
  CreditCard,
  UserRound,
  Command,
  X,
} from "lucide-react"

import { useAuth } from "@/context/auth-context"
import api from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Conversations", url: "/dashboard/chat", icon: MessageSquare },
  { title: "AI Agents", url: "/dashboard/agents", icon: Bot },
]

const settingsNavItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
]

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()
  const [loggingOut, setLoggingOut] = React.useState(false)

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const isActive = (url: string) => {
    if (pathname === url) return true
    if (url === "/dashboard") return false
    return pathname.startsWith(`${url}/`)
  }

  const initials = user?.name?.trim()
    ? user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U"

  const logout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      await api.get("/auth/logout")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      setOpenMobile(false)
      router.replace("/login")
      setLoggingOut(false)
    }
  }

  const renderNavItem = (
    item: (typeof mainNavItems)[number]
  ) => {
    const active = isActive(item.url)
    const Icon = item.icon

    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton
          render={
            <Link
              href={item.url}
              aria-current={active ? "page" : undefined}
            />
          }
          onClick={closeMobileSidebar}
          isActive={active}
          tooltip={item.title}
          className="h-9 rounded-md px-3 text-[13px] font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
        >
          <Icon className="size-[17px] shrink-0" strokeWidth={1.8} />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="relative px-3 pb-3 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="AgentsDev"
              render={<Link href="/dashboard" />}
              onClick={closeMobileSidebar}
              className="h-11 gap-3 rounded-lg px-2 hover:bg-transparent"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="size-[17px]" strokeWidth={2} />
              </div>

              <div className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[14px] font-semibold tracking-tight">
                  AgentsDev
                </span>
                <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  AI workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Mobile close button */}
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpenMobile(false)}
          className="absolute right-4 top-5 z-50 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
        >
          <X className="size-5" />
        </button>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 pt-3">
        <SidebarGroup className="px-0 py-2">
          <SidebarGroupLabel className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-5 px-0 py-2">
          <SidebarGroupLabel className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
            Manage
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {settingsNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user?.email || "Account"}
                    className="h-12 gap-2 rounded-lg border border-transparent px-2 hover:border-sidebar-border hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="size-8 shrink-0 rounded-full">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={user?.name || "Account"}
                  />
                  <AvatarFallback className="rounded-full bg-muted text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-[12px] font-semibold">
                    {user?.name || "Account"}
                  </span>
                  <span className="mt-1 truncate text-[11px] text-muted-foreground">
                    {user?.email || "Manage your account"}
                  </span>
                </div>

                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={8}
                className="w-60 rounded-lg p-1.5"
              >
                {/* Plain div avoids the Base UI MenuGroupContext error */}
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-medium">
                    {user?.name || "Your account"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email || "Signed in"}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  render={<Link href="/dashboard/account" />}
                  onClick={closeMobileSidebar}
                  className="gap-2 rounded-md py-2"
                >
                  <UserRound className="size-4 text-muted-foreground" />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={<Link href="/dashboard/settings" />}
                  onClick={closeMobileSidebar}
                  className="gap-2 rounded-md py-2"
                >
                  <Settings2 className="size-4 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={<Link href="/dashboard/billing" />}
                  onClick={closeMobileSidebar}
                  className="gap-2 rounded-md py-2"
                >
                  <CreditCard className="size-4 text-muted-foreground" />
                  Billing
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  disabled={loggingOut}
                  className="gap-2 rounded-md py-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
