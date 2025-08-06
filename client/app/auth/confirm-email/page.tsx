"use client"

import { ConfirmEmailForm } from "@/components/confirm-email-form"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 flex items-center justify-center p-4">
      <ConfirmEmailForm />
    </div>
  )
}
