"use client"

import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { ApiProvider } from "@/lib/contexts/api-context"
import { fontSans, fontMono } from "@/lib/fonts"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { Auth0ProviderWithNavigate } from "@/lib/contexts/auth0-provider"
import { AuthGuard } from "@/components/auth-guard"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontMono.variable
      )}>
        <Auth0ProviderWithNavigate>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ApiProvider>
              <AuthGuard>
                <div className="flex min-h-screen">
                  <Sidebar onCollapsedChange={setIsSidebarCollapsed} />
                  {/* Main Content */}
                  <main className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarCollapsed ? "md:ml-[4.5rem]" : "md:ml-64",
                    "ml-0"
                  )}>
                    <div className="container mx-auto p-8">
                      {children}
                    </div>
                  </main>
                </div>
              </AuthGuard>
            </ApiProvider>
          </ThemeProvider>
        </Auth0ProviderWithNavigate>
      </body>
    </html>
  )
} 