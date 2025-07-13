"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Calendar, Users } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth0()

  return (
    <div className="space-y-6">
      <div>
        {isLoading ? (
          <Skeleton className="h-8 w-[200px]" />
        ) : (
          <h1 className="text-2xl font-bold">
            {user ? `Welcome back, ${user.name}!` : 'Welcome to Ruh'}
          </h1>
        )}
        <p className="text-muted-foreground">
          Your wellness platform dashboard
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/clients"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Clients</h2>
              <p className="text-sm text-muted-foreground">
                View and manage your client list
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/appointments"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Appointments</h2>
              <p className="text-sm text-muted-foreground">
                Schedule and track appointments
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 