"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Shield, User, Clock, Key } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[180px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-background rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(350px_circle_at_top_right,theme(colors.primary.DEFAULT)/5,transparent)] rounded-2xl" />
          <div className="absolute inset-0 bg-[length:16px_16px] opacity-10 bg-[radial-gradient(circle_1px_at_center,theme(colors.primary.DEFAULT)_0%,transparent_0%)] rounded-2xl" />
        </div>
        <div className="relative pt-8 pb-8 px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-primary/20 rounded-full blur-sm" />
              <Avatar className="h-20 w-20 border-3 border-background relative shadow-xl">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback className="text-xl">{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-foreground/90">{user?.name}</h1>
              <p className="text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
            <div className="sm:ml-auto flex items-center">
              <Badge 
                variant={user?.email_verified ? "default" : "secondary"} 
                className={`
                  ml-auto px-3 py-1 text-sm font-medium
                  ${user?.email_verified ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}
                `}
              >
                {user?.email_verified ? (
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Verified Account
                  </div>
                ) : "Unverified"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email_verified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user?.updated_at!).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-xs font-mono text-muted-foreground">#</span>
              </div>
              <div>
                <p className="text-sm font-medium">Auth0 ID</p>
                <p className="text-sm font-mono text-muted-foreground">{user?.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user?.created_at!).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">#</span>
              </div>
              <div>
                <p className="text-sm font-medium">Login Count</p>
                <p className="text-sm text-muted-foreground">{user?.logins_count} logins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 