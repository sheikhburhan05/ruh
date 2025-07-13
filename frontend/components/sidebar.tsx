"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Users, Calendar, LayoutDashboard, ChevronLeft, Menu, LogOut, LogIn, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth0 } from "@auth0/auth0-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const pathname = usePathname();

  const toggleSidebar = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed left-4 top-4 z-50 rounded-lg border bg-background/95 p-2 shadow-sm md:hidden"
        onClick={() => toggleSidebar(!isSidebarCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-card shadow-lg transition-all duration-300 z-40",
        isSidebarCollapsed ? "w-[4.5rem]" : "w-64",
        "md:translate-x-0",
        isSidebarCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "px-6 border-b flex flex-col items-center",
            isSidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            <Link href="/" className={cn(
              "flex flex-col items-center",
              isSidebarCollapsed ? "justify-center" : "space-y-2"
            )}>
              <div className={cn(
                "flex-shrink-0 flex items-center justify-center",
                isSidebarCollapsed ? "h-10 w-10" : "h-16 w-16"
              )}>
                <img
                  src="/ruh-logo.png"
                  alt="Ruh Logo"
                  className="h-full w-full object-contain p-1"
                />
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className={cn(
                "flex h-10 w-full items-center rounded-lg px-4 text-sm font-medium transition-colors",
                isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                isSidebarCollapsed ? "justify-center" : "space-x-3"
              )}
              title={isSidebarCollapsed ? "Dashboard" : undefined}
            >
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </Link>
            <Link
              href="/clients"
              className={cn(
                "flex h-10 w-full items-center rounded-lg px-4 text-sm font-medium transition-colors",
                isActive("/clients") ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                isSidebarCollapsed ? "justify-center" : "space-x-3"
              )}
              title={isSidebarCollapsed ? "Clients" : undefined}
            >
              <Users className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Clients</span>}
            </Link>
            <Link
              href="/appointments"
              className={cn(
                "flex h-10 w-full items-center rounded-lg px-4 text-sm font-medium transition-colors",
                isActive("/appointments") ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                isSidebarCollapsed ? "justify-center" : "space-x-3"
              )}
              title={isSidebarCollapsed ? "Appointments" : undefined}
            >
              <Calendar className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Appointments</span>}
            </Link>
          </nav>

          {/* User Settings */}
          {isAuthenticated ? (
            <div className="p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 px-4",
                      isActive("/profile") ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                      isSidebarCollapsed && "justify-center"
                    )}
                  >
                    <User className="h-5 w-5" />
                    {!isSidebarCollapsed && <span>Settings</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align={isSidebarCollapsed ? "center" : "start"}
                  side="right"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-4 hover:bg-primary/10 hover:text-primary",
                  isSidebarCollapsed && "justify-center"
                )}
                onClick={() => loginWithRedirect()}
              >
                <LogIn className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Login</span>}
              </Button>
            </div>
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={() => toggleSidebar(!isSidebarCollapsed)}
            className={cn(
              "absolute -right-3 top-12 hidden size-6 items-center justify-center rounded-full border bg-background shadow-sm transition-transform hover:bg-primary/10 hover:text-primary md:flex",
              isSidebarCollapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => toggleSidebar(true)}
        />
      )}
    </>
  )
} 