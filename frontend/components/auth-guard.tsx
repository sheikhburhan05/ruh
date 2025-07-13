"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: pathname,
        },
      })
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 