"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Clock, Tag } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "./smart-task-manager"

interface EnhancedTaskItemProps {
  task: Task
  onEdit: () => void
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
  isDraggable?: boolean
  compact?: boolean
}

const PRIORITY_COLORS = {
  low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
}

const STATUS_COLORS = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
}

export function EnhancedTaskItem({ 
  task, 
  onEdit, 
  onUpdate, 
  onDelete, 
  isDraggable = false, 
  compact = false 
}: EnhancedTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  const toggleComplete = () => {
    const newStatus = task.status === "completed" ? "todo" : "completed"
    onUpdate({ status: newStatus })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isDraggable ? listeners : {})}
      className={`bg-card border-border/50 shadow-sm transition-all duration-200 ${
        isDraggable 
          ? `cursor-grab active:cursor-grabbing ${
              isDragging 
                ? "shadow-2xl ring-2 ring-primary/50 bg-primary/5 rotate-2 scale-105" 
                : ""
            }` 
          : "cursor-pointer"
      } ${task.status === "completed" ? "opacity-75" : ""} ${
        compact ? "p-2" : ""
      }`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={task.status === "completed"} 
            onCheckedChange={toggleComplete} 
            className="mt-1" 
          />

          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium ${compact ? "text-sm" : "text-base"} mb-1 ${
                task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task.title}
            </h4>

            {task.description && !compact && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </Badge>

              <Badge variant="outline" className={`text-xs ${STATUS_COLORS[task.status]}`}>
                {task.status.replace("-", " ")}
              </Badge>

              {task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  {task.tags.slice(0, compact ? 1 : 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > (compact ? 1 : 2) && (
                    <span className="text-xs text-muted-foreground">
                      +{task.tags.length - (compact ? 1 : 2)}
                    </span>
                  )}
                </div>
              )}

              {!compact && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {format(task.date, "MMM d")}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
