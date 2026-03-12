"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, Globe, Settings, LogOut, ShieldCheck } from "lucide-react"

export function NavUser({
  user,
}: {
  user: any
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-slate-800 bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
                <Avatar className="h-8 w-8 rounded-lg outline outline-2 outline-primary-blue-light/50 outline-offset-1">
                  <AvatarImage src={user.avatar || ""} alt={user.name} />
                  <AvatarFallback className="bg-primary-blue-light text-white rounded-lg">{user.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                  <span className="truncate font-bold text-white leading-none">{user.name}</span>
                  <span className="truncate text-xs text-primary-light flex items-center gap-1 mt-1 text-slate-400">
                    <ShieldCheck className="h-3 w-3 text-accent-cyan" />
                    {user.role}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-slate-700 bg-slate-800 text-slate-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback className="bg-primary-blue-light text-white rounded-lg">{user.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<a href="/" target="_blank" className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer rounded-md" />}>
                <Globe className="mr-2 h-4 w-4" />
                Lihat Website
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="/admin/settings" className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer rounded-md" />}>
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem render={
              <form action="/api/auth/signout" method="POST" className="w-full text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer rounded-md">
                <button type="submit" className="w-full flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </form>
            } />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
