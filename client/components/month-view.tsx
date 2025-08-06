"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isToday, 
  isSameDay 
} from "date-fns"
import type { Task } from "./smart-task-manager"

interface MonthViewProps {
  month: Date
  tasks: Task[]
  onAddTask: (date: Date) => void
  onEditTask: (task: Task) => void
  onDateSelect: (date: Date) => void
}

export function MonthView({ month, tasks, onAddTask, onEditTask, onDateSelect }: MonthViewProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = []
  let currentDay = calendarStart

  while (currentDay <= calendarEnd) {
    days.push(currentDay)
    currentDay = addDays(currentDay, 1)
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date))
  }

  const getTaskCountByStatus = (dayTasks: Task[]) => {
    return {
      todo: dayTasks.filter(t => t.status === "todo").length,
      inProgress: dayTasks.filter(t => t.status === "in-progress").length,
      completed: dayTasks.filter(t => t.status === "completed").length,
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayTasks = getTasksForDay(day)
              const taskCounts = getTaskCountByStatus(dayTasks)
              const isCurrentMonth = isSameMonth(day, month)
              const isCurrentDay = isToday(day)

              return (
                <Card
                  key={day.toISOString()}
                  className={`min-h-[120px] cursor-pointer transition-all hover:shadow-md ${
                    !isCurrentMonth ? "opacity-50" : ""
                  } ${
                    isCurrentDay ? "ring-2 ring-primary/50 bg-primary/5" : "bg-card/30"
                  }`}
                  onClick={() => onDateSelect(day)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isCurrentDay
                            ? "text-primary font-bold"
                            : isCurrentMonth
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      
                      {isCurrentMonth && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddTask(day)
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-primary/10"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Task Indicators */}
                    <div className="space-y-1">
                      {taskCounts.todo > 0 && (
                        <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
                          {taskCounts.todo} todo
                        </Badge>
                      )}
                      {taskCounts.inProgress > 0 && (
                        <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                          {taskCounts.inProgress} active
                        </Badge>
                      )}
                      {taskCounts.completed > 0 && (
                        <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          {taskCounts.completed} done
                        </Badge>
                      )}
                    </div>

                    {/* Task Preview */}
                    {dayTasks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditTask(task)
                            }}
                            className="text-xs p-1 bg-background/50 rounded cursor-pointer hover:bg-background/80 truncate"
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
