"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Task } from "./weekly-todo-manager"

interface ProgressTrackerProps {
  tasks: Task[]
}

export function ProgressTracker({ tasks }: ProgressTrackerProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Weekly Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
        </div>

        <Progress value={completionPercentage} className="mb-6 h-3" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">To Do</p>
              <p className="text-lg font-semibold text-slate-900">{todoTasks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">In Progress</p>
              <p className="text-lg font-semibold text-slate-900">{inProgressTasks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-lg font-semibold text-slate-900">{completedTasks}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
