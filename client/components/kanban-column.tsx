"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EnhancedTaskItem } from "./enhanced-task-item"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import type { Task } from "./smart-task-manager"

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  onEditTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  color: "slate" | "yellow" | "green"
}

const COLUMN_ICONS = {
  todo: AlertCircle,
  "in-progress": Clock,
  completed: CheckCircle,
}

export function KanbanColumn({ 
  id, 
  title, 
  tasks, 
  onEditTask, 
  onUpdateTask, 
  onDeleteTask, 
  color 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const Icon = COLUMN_ICONS[id as keyof typeof COLUMN_ICONS] || AlertCircle

  return (
    <Card 
      className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 ${
        isOver 
          ? "ring-2 ring-primary/50 bg-primary/5 scale-[1.02] shadow-lg" 
          : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg transition-colors ${
              color === "slate"
                ? "bg-muted"
                : color === "yellow"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
            } ${isOver ? "bg-primary/20" : ""}`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isOver 
                  ? "text-primary" 
                  : color === "slate"
                    ? "text-muted-foreground"
                    : color === "yellow"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
              }`}
            />
          </div>
          <div>
            <h3 className={`font-semibold transition-colors ${
              isOver ? "text-primary" : "text-foreground"
            }`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div 
          ref={setNodeRef}
          className={`transition-all duration-300 ${
            isOver ? "bg-primary/5 rounded-lg" : ""
          }`}
        >
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className={`space-y-3 min-h-[300px] p-2 rounded-lg transition-all ${
              isOver ? "bg-gradient-to-b from-primary/10 to-transparent" : ""
            }`}>
              {tasks.map((task) => (
                <EnhancedTaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(task)}
                  onUpdate={(updates) => onUpdateTask(task.id, updates)}
                  onDelete={() => onDeleteTask(task.id)}
                  isDraggable
                  compact
                />
              ))}

              {tasks.length === 0 && (
                <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-all ${
                  isOver 
                    ? "border-primary/50 bg-primary/10 text-primary" 
                    : "border-border/50 text-muted-foreground/50"
                }`}>
                  <Icon className={`w-8 h-8 mb-2 ${isOver ? "text-primary" : "text-muted-foreground/30"}`} />
                  <p className="text-sm font-medium">
                    {isOver ? "Drop task here" : "No tasks"}
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  )
}
