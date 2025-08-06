"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedTaskItem } from "./enhanced-task-item"
import { KanbanColumn } from "./kanban-column"
import { EnhancedKanbanBoard } from "./enhanced-kanban-board"
import { Plus, List, Columns3, Calendar } from 'lucide-react'
import { useState } from "react"
import { format, isToday } from "date-fns"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { Task } from "./smart-task-manager"

interface DayViewProps {
  date: Date
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function DayView({ date, tasks, onAddTask, onEditTask, onUpdateTask, onDeleteTask }: DayViewProps) {
  const [viewType, setViewType] = useState<"list" | "kanban">("list")

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (a.status !== b.status) {
      const statusOrder = { todo: 3, "in-progress": 2, completed: 1 }
      return statusOrder[b.status] - statusOrder[a.status]
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]
    
    onUpdateTask(taskId, { status: newStatus })
  }

  const todoTasks = tasks.filter(t => t.status === "todo")
  const inProgressTasks = tasks.filter(t => t.status === "in-progress")
  const completedTasks = tasks.filter(t => t.status === "completed")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isToday(date) ? "text-primary" : "text-foreground"}`}>
            {format(date, "EEEE, MMMM d")}
          </h2>
          <p className="text-muted-foreground">{tasks.length} tasks</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("list")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("kanban")}
              className="h-8 px-3"
            >
              <Columns3 className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={onAddTask} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewType === "list" ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <EnhancedTaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(task)}
                  onUpdate={(updates) => onUpdateTask(task.id, updates)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}

              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No tasks for this day</p>
                  <p className="text-sm">Add a task to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EnhancedKanbanBoard
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  )
}
