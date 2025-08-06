"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import type { ViewMode } from "./smart-task-manager"

interface TimeNavigationProps {
  viewMode: ViewMode
  onNavigate: (direction: "prev" | "next") => void
  onGoToToday: () => void
}

export function TimeNavigation({ viewMode, onNavigate, onGoToToday }: TimeNavigationProps) {
  const getNavigationLabel = () => {
    switch (viewMode) {
      case "day": return "day"
      case "week": return "week"
      case "month": return "month"
      default: return "period"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("prev")}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onGoToToday}
        className="flex items-center gap-2 px-3"
      >
        <Calendar className="w-4 h-4" />
        Today
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("next")}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
