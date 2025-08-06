"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import type { Task, ViewMode } from "./smart-task-manager"

interface ProgressIndicatorProps {
  tasks: Task[]
  viewMode: ViewMode
}

export function ProgressIndicator({ tasks, viewMode }: ProgressIndicatorProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getViewLabel = () => {
    switch (viewMode) {
      case "day": return "Today's"
      case "week": return "This Week's"
      case "month": return "This Month's"
      default: return ""
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {getViewLabel()} Progress
          </h3>
          <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
        </div>

        <Progress value={completionPercentage} className="mb-6 h-3" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To Do</p>
              <p className="text-lg font-semibold text-foreground">{todoTasks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-lg font-semibold text-foreground">{inProgressTasks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold text-foreground">{completedTasks}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
