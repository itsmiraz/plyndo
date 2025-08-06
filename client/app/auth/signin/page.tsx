"use client"

import { SignInForm } from "@/components/signin-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 flex items-center justify-center p-4">
      <SignInForm />
    </div>
  )
}
