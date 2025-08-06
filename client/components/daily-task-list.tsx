"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskItem } from "./task-item"
import { Plus } from "lucide-react"
import { format, isToday } from "date-fns"
import type { Task } from "./weekly-todo-manager"

interface DailyTaskListProps {
  day: string
  dayIndex: number
  date: Date
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function DailyTaskList({
  day,
  dayIndex,
  date,
  tasks,
  onAddTask,
  onEditTask,
  onUpdateTask,
  onDeleteTask,
}: DailyTaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <Card
      className={`bg-white/70 backdrop-blur-sm border-0 shadow-lg transition-all hover:shadow-xl ${
        isToday(date) ? "ring-2 ring-blue-500/20 bg-blue-50/50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${isToday(date) ? "text-blue-700" : "text-slate-900"}`}>{day}</h3>
            <p className="text-sm text-slate-600">{format(date, "MMM d")}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onAddTask} className="h-8 w-8 p-0 hover:bg-blue-100">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 min-h-[200px]">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-slate-400">
              <p className="text-sm">No tasks for this day</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
