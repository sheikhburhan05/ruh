"use client"

import { Auth0Provider } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"

export function Auth0ProviderWithNavigate({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!
  const callbackUrl = process.env.NEXT_PUBLIC_CALLBACK!

  if (!(domain && clientId && callbackUrl)) {
    throw new Error("Missing Auth0 configuration")
  }

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
} 