"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addWeeks, subWeeks, startOfWeek, isThisWeek } from "date-fns"

interface WeekSelectorProps {
  currentWeek: Date
  onWeekChange: (week: Date) => void
}

export function WeekSelector({ currentWeek, onWeekChange }: WeekSelectorProps) {
  const goToPreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1))
  }

  const goToNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1))
  }

  const goToCurrentWeek = () => {
    onWeekChange(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-slate-700 min-w-[200px] text-center">
          {format(currentWeek, "MMM d")} - {format(addWeeks(currentWeek, 1), "MMM d, yyyy")}
        </span>

        {!isThisWeek(currentWeek, { weekStartsOn: 1 }) && (
          <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={goToNextWeek}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
