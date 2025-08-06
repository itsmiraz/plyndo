"use client"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react'
import type { ViewMode } from "./smart-task-manager"

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views = [
    { id: "day" as const, label: "Day", icon: Calendar },
    { id: "week" as const, label: "Week", icon: CalendarDays },
    { id: "month" as const, label: "Month", icon: CalendarRange },
  ]

  return (
    <div className="flex items-center bg-muted/50 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon
        return (
          <Button
            key={view.id}
            variant={currentView === view.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 ${
              currentView === view.id 
                ? "bg-background shadow-sm" 
                : "hover:bg-background/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
