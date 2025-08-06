"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-lg">Smart Task Manager</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-muted-foreground">
        <p>© 2024 Smart Task Manager. All rights reserved.</p>
      </div>
    </div>
  )
}
