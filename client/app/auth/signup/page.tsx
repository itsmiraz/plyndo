"use client"

import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  )
}
